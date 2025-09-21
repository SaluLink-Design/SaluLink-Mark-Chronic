from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
import os

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = FastAPI(title="SaluLink Specialist Aid API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("spaCy model not found. Please install with: python -m spacy download en_core_web_sm")
    nlp = None

# Data models
class ClinicalNoteRequest(BaseModel):
    text: str

class ExtractedTerm(BaseModel):
    term: str
    confidence: float
    category: str

class ChronicCondition(BaseModel):
    condition: str
    icd10Code: str
    icd10Description: str

class AnalysisResult(BaseModel):
    extractedTerms: List[str]
    matchedConditions: List[ChronicCondition]
    confidence: float

class TreatmentBasket(BaseModel):
    procedureDescription: str
    procedureCode: str
    coverageLimit: int
    basketType: str

class ConditionWithBaskets(BaseModel):
    condition: ChronicCondition
    diagnosticBasket: List[TreatmentBasket]
    ongoingManagementBasket: List[TreatmentBasket]
    specialistCoverage: int

# Global variables for data
chronic_conditions_df = None
treatment_baskets_df = None
vectorizer = None
condition_vectors = None

def load_data():
    """Load the chronic conditions and treatment baskets data"""
    global chronic_conditions_df, treatment_baskets_df, vectorizer, condition_vectors
    
    try:
        # Load chronic conditions
        chronic_conditions_df = pd.read_csv('../CMS Chronic Conditions.csv')
        chronic_conditions_df = chronic_conditions_df.dropna(subset=['CHRONIC CONDITIONS'])
        
        # Load treatment baskets
        treatment_baskets_df = pd.read_csv('../Discovery treatment-baskets-for-the-pmb-cdl-conditions.csv')
        
        # Prepare text for vectorization
        condition_texts = []
        for _, row in chronic_conditions_df.iterrows():
            condition = row['CHRONIC CONDITIONS']
            icd10_desc = row.get('ICD-10 Description', '')
            text = f"{condition} {icd10_desc}".lower()
            condition_texts.append(text)
        
        # Create TF-IDF vectorizer
        vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1
        )
        condition_vectors = vectorizer.fit_transform(condition_texts)
        
        print(f"Loaded {len(chronic_conditions_df)} chronic conditions")
        print(f"Loaded treatment baskets data")
        
    except Exception as e:
        print(f"Error loading data: {e}")

def extract_medical_terms(text: str) -> List[str]:
    """Extract medical terms from clinical text"""
    terms = []
    text_lower = text.lower()
    
    # Medical term patterns
    medical_keywords = [
        # Diabetes related
        'diabetes', 'diabetic', 'glucose', 'insulin', 'sugar', 'hyperglycemia', 'hypoglycemia',
        'hba1c', 'glycated hemoglobin', 'ketoacidosis', 'diabetic nephropathy', 'diabetic retinopathy',
        
        # Cardiovascular
        'heart', 'cardiac', 'cardiovascular', 'coronary', 'angina', 'myocardial infarction',
        'hypertension', 'blood pressure', 'cholesterol', 'triglycerides', 'ecg', 'echocardiogram',
        
        # Renal
        'kidney', 'renal', 'nephritis', 'nephropathy', 'creatinine', 'urea', 'proteinuria',
        'hemodialysis', 'dialysis', 'glomerulonephritis',
        
        # Respiratory
        'lung', 'pulmonary', 'respiratory', 'asthma', 'copd', 'bronchitis', 'pneumonia',
        'spirometry', 'peak flow', 'oxygen saturation',
        
        # Neurological
        'brain', 'neurological', 'epilepsy', 'seizure', 'multiple sclerosis', 'ms',
        'parkinson', 'alzheimer', 'dementia', 'migraine', 'headache',
        
        # Endocrine
        'thyroid', 'hypothyroidism', 'hyperthyroidism', 'tsh', 't4', 't3',
        'adrenal', 'cortisol', 'addison', 'cushing',
        
        # Rheumatological
        'arthritis', 'rheumatoid', 'joint', 'arthropathy', 'lupus', 'sle',
        'inflammatory', 'autoimmune', 'rheumatism',
        
        # Hematological
        'blood', 'anemia', 'hemoglobin', 'platelet', 'coagulation', 'bleeding',
        'haemophilia', 'thrombosis', 'embolism',
        
        # Ophthalmological
        'eye', 'vision', 'glaucoma', 'retinal', 'ophthalmic', 'cataract',
        'tonometry', 'fundus', 'visual field',
        
        # Psychiatric
        'depression', 'anxiety', 'bipolar', 'schizophrenia', 'mood', 'mental',
        'psychiatric', 'psychological', 'cognitive',
        
        # General symptoms
        'fatigue', 'weakness', 'pain', 'fever', 'weight loss', 'weight gain',
        'nausea', 'vomiting', 'diarrhea', 'constipation', 'shortness of breath',
        'chest pain', 'abdominal pain', 'headache', 'dizziness', 'syncope'
    ]
    
    # Extract terms that appear in the text
    for keyword in medical_keywords:
        if keyword in text_lower:
            terms.append(keyword)
    
    # Extract ICD-10 codes
    icd10_pattern = r'[A-Z]\d{2}(?:\.\d)?'
    icd10_matches = re.findall(icd10_pattern, text)
    terms.extend(icd10_matches)
    
    # Extract medication names
    medication_pattern = r'(?:metformin|insulin|aspirin|warfarin|atorvastatin|lisinopril|metoprolol|omeprazole|prednisone|methotrexate)'
    medication_matches = re.findall(medication_pattern, text_lower)
    terms.extend(medication_matches)
    
    # Extract lab values
    lab_pattern = r'(?:glucose|creatinine|urea|cholesterol|triglycerides|hb|hba1c|tsh|t4|t3|cortisol)\s*:?\s*\d+(?:\.\d+)?'
    lab_matches = re.findall(lab_pattern, text_lower)
    terms.extend(lab_matches)
    
    return list(set(terms))  # Remove duplicates

def find_matching_conditions(extracted_terms: List[str], top_k: int = 5) -> List[ChronicCondition]:
    """Find matching chronic conditions based on extracted terms"""
    if chronic_conditions_df is None or vectorizer is None or condition_vectors is None:
        return []
    
    # Create query text from extracted terms
    query_text = " ".join(extracted_terms).lower()
    
    # Vectorize query
    query_vector = vectorizer.transform([query_text])
    
    # Calculate similarities
    similarities = cosine_similarity(query_vector, condition_vectors).flatten()
    
    # Get top matches
    top_indices = np.argsort(similarities)[::-1][:top_k]
    
    matched_conditions = []
    for idx in top_indices:
        if similarities[idx] > 0.1:  # Minimum similarity threshold
            row = chronic_conditions_df.iloc[idx]
            condition = ChronicCondition(
                condition=row['CHRONIC CONDITIONS'],
                icd10Code=row.get('ICD-10 Code', ''),
                icd10Description=row.get('ICD-10 Description', '')
            )
            matched_conditions.append(condition)
    
    return matched_conditions

def calculate_confidence(extracted_terms: List[str], matched_conditions: List[ChronicCondition]) -> float:
    """Calculate confidence score for the analysis"""
    if not extracted_terms or not matched_conditions:
        return 0.0
    
    # Base confidence on number of terms and matches
    term_score = min(len(extracted_terms) * 10, 50)
    condition_score = min(len(matched_conditions) * 15, 30)
    
    # Specificity bonus
    specific_terms = [
        'hba1c', 'ketoacidosis', 'diabetic nephropathy', 'diabetic retinopathy',
        'myocardial infarction', 'angina', 'hypertension', 'creatinine',
        'proteinuria', 'hemodialysis', 'spirometry', 'peak flow',
        'seizure', 'epilepsy', 'multiple sclerosis', 'parkinson',
        'hypothyroidism', 'hyperthyroidism', 'cortisol', 'addison',
        'rheumatoid arthritis', 'lupus', 'sle', 'haemophilia',
        'glaucoma', 'tonometry', 'fundus', 'bipolar', 'schizophrenia'
    ]
    
    specific_count = sum(1 for term in extracted_terms if term.lower() in specific_terms)
    specificity_score = min(specific_count * 5, 20)
    
    return min(term_score + condition_score + specificity_score, 100)

@app.on_event("startup")
async def startup_event():
    """Load data on startup"""
    load_data()

@app.get("/")
async def root():
    return {"message": "SaluLink Specialist Aid API", "version": "1.0.0"}

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_clinical_note(request: ClinicalNoteRequest):
    """Analyze clinical note and return extracted terms and matched conditions"""
    try:
        # Extract medical terms
        extracted_terms = extract_medical_terms(request.text)
        
        # Find matching conditions
        matched_conditions = find_matching_conditions(extracted_terms)
        
        # Calculate confidence
        confidence = calculate_confidence(extracted_terms, matched_conditions)
        
        return AnalysisResult(
            extractedTerms=extracted_terms,
            matchedConditions=matched_conditions,
            confidence=confidence
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/conditions")
async def get_all_conditions():
    """Get all chronic conditions"""
    if chronic_conditions_df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    conditions = []
    for _, row in chronic_conditions_df.iterrows():
        condition = ChronicCondition(
            condition=row['CHRONIC CONDITIONS'],
            icd10Code=row.get('ICD-10 Code', ''),
            icd10Description=row.get('ICD-10 Description', '')
        )
        conditions.append(condition)
    
    return conditions

@app.get("/treatment-baskets/{icd10_code}")
async def get_treatment_baskets(icd10_code: str):
    """Get treatment baskets for a specific ICD-10 code"""
    if treatment_baskets_df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # This is a simplified implementation
    # In a real application, you would parse the treatment baskets CSV properly
    # and return the appropriate baskets for the given ICD-10 code
    
    # For now, return a mock response
    return {
        "condition": {
            "condition": "Example Condition",
            "icd10Code": icd10_code,
            "icd10Description": "Example description"
        },
        "diagnosticBasket": [
            {
                "procedureDescription": "Example diagnostic procedure",
                "procedureCode": "1234",
                "coverageLimit": 1,
                "basketType": "diagnostic"
            }
        ],
        "ongoingManagementBasket": [
            {
                "procedureDescription": "Example ongoing procedure",
                "procedureCode": "5678",
                "coverageLimit": 2,
                "basketType": "ongoing_management"
            }
        ],
        "specialistCoverage": 1
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
