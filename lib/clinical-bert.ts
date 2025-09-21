import { AnalysisResult } from '@/types';

export class ClinicalBERTProcessor {
  private dataProcessor: any;

  constructor(dataProcessor: any) {
    this.dataProcessor = dataProcessor;
  }

  /**
   * Simulates ClinicalBERT processing of clinical notes
   * In a real implementation, this would use the actual ClinicalBERT model
   */
  public async analyzeClinicalNote(clinicalNote: string): Promise<AnalysisResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract medical terms and keywords from the clinical note
    const extractedTerms = this.extractMedicalTerms(clinicalNote);
    
    // Find matching conditions based on extracted terms
    const matchedConditions = this.dataProcessor.getConditionsByKeywords(extractedTerms);
    
    // Calculate confidence score based on term matches
    const confidence = this.calculateConfidence(extractedTerms, matchedConditions);

    return {
      extractedTerms,
      matchedConditions,
      confidence
    };
  }

  private extractMedicalTerms(text: string): string[] {
    const medicalTerms: string[] = [];
    const lowerText = text.toLowerCase();

    // Define medical term patterns and keywords
    const medicalKeywords = [
      // Diabetes related
      'diabetes', 'diabetic', 'glucose', 'insulin', 'sugar', 'hyperglycemia', 'hypoglycemia',
      'hba1c', 'glycated hemoglobin', 'ketoacidosis', 'diabetic nephropathy', 'diabetic retinopathy',
      
      // Cardiovascular
      'heart', 'cardiac', 'cardiovascular', 'coronary', 'angina', 'myocardial infarction',
      'hypertension', 'blood pressure', 'cholesterol', 'triglycerides', 'ecg', 'echocardiogram',
      
      // Renal
      'kidney', 'renal', 'nephritis', 'nephropathy', 'creatinine', 'urea', 'proteinuria',
      'hemodialysis', 'dialysis', 'glomerulonephritis',
      
      // Respiratory
      'lung', 'pulmonary', 'respiratory', 'asthma', 'copd', 'bronchitis', 'pneumonia',
      'spirometry', 'peak flow', 'oxygen saturation',
      
      // Neurological
      'brain', 'neurological', 'epilepsy', 'seizure', 'multiple sclerosis', 'ms',
      'parkinson', 'alzheimer', 'dementia', 'migraine', 'headache',
      
      // Endocrine
      'thyroid', 'hypothyroidism', 'hyperthyroidism', 'tsh', 't4', 't3',
      'adrenal', 'cortisol', 'addison', 'cushing',
      
      // Rheumatological
      'arthritis', 'rheumatoid', 'joint', 'arthropathy', 'lupus', 'sle',
      'inflammatory', 'autoimmune', 'rheumatism',
      
      // Hematological
      'blood', 'anemia', 'hemoglobin', 'platelet', 'coagulation', 'bleeding',
      'haemophilia', 'thrombosis', 'embolism',
      
      // Ophthalmological
      'eye', 'vision', 'glaucoma', 'retinal', 'ophthalmic', 'cataract',
      'tonometry', 'fundus', 'visual field',
      
      // Psychiatric
      'depression', 'anxiety', 'bipolar', 'schizophrenia', 'mood', 'mental',
      'psychiatric', 'psychological', 'cognitive',
      
      // General symptoms
      'fatigue', 'weakness', 'pain', 'fever', 'weight loss', 'weight gain',
      'nausea', 'vomiting', 'diarrhea', 'constipation', 'shortness of breath',
      'chest pain', 'abdominal pain', 'headache', 'dizziness', 'syncope'
    ];

    // Extract terms that appear in the text
    medicalKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        medicalTerms.push(keyword);
      }
    });

    // Extract ICD-10 codes if present
    const icd10Pattern = /[A-Z]\d{2}(?:\.\d)?/g;
    const icd10Matches = text.match(icd10Pattern);
    if (icd10Matches) {
      medicalTerms.push(...icd10Matches);
    }

    // Extract medication names (basic pattern)
    const medicationPattern = /(?:metformin|insulin|aspirin|warfarin|atorvastatin|lisinopril|metoprolol|omeprazole|prednisone|methotrexate)/gi;
    const medicationMatches = text.match(medicationPattern);
    if (medicationMatches) {
      medicalTerms.push(...medicationMatches.map(m => m.toLowerCase()));
    }

    // Extract lab values and measurements
    const labPattern = /(?:glucose|creatinine|urea|cholesterol|triglycerides|hb|hba1c|tsh|t4|t3|cortisol)\s*:?\s*\d+(?:\.\d+)?/gi;
    const labMatches = text.match(labPattern);
    if (labMatches) {
      medicalTerms.push(...labMatches.map(m => m.toLowerCase()));
    }

    return [...new Set(medicalTerms)]; // Remove duplicates
  }

  private calculateConfidence(extractedTerms: string[], matchedConditions: any[]): number {
    if (matchedConditions.length === 0) return 0;
    
    // Base confidence on number of matching terms and conditions
    const termScore = Math.min(extractedTerms.length * 10, 50);
    const conditionScore = Math.min(matchedConditions.length * 15, 30);
    const specificityScore = this.calculateSpecificityScore(extractedTerms);
    
    return Math.min(termScore + conditionScore + specificityScore, 100);
  }

  private calculateSpecificityScore(terms: string[]): number {
    // Higher score for more specific medical terms
    const specificTerms = [
      'hba1c', 'ketoacidosis', 'diabetic nephropathy', 'diabetic retinopathy',
      'myocardial infarction', 'angina', 'hypertension', 'creatinine',
      'proteinuria', 'hemodialysis', 'spirometry', 'peak flow',
      'seizure', 'epilepsy', 'multiple sclerosis', 'parkinson',
      'hypothyroidism', 'hyperthyroidism', 'cortisol', 'addison',
      'rheumatoid arthritis', 'lupus', 'sle', 'haemophilia',
      'glaucoma', 'tonometry', 'fundus', 'bipolar', 'schizophrenia'
    ];

    const specificTermCount = terms.filter(term => 
      specificTerms.includes(term.toLowerCase())
    ).length;

    return Math.min(specificTermCount * 5, 20);
  }

  /**
   * Enhanced analysis with context understanding
   */
  public async analyzeWithContext(clinicalNote: string): Promise<AnalysisResult> {
    const basicAnalysis = await this.analyzeClinicalNote(clinicalNote);
    
    // Add context-based improvements
    const contextualTerms = this.extractContextualTerms(clinicalNote);
    const enhancedTerms = [...basicAnalysis.extractedTerms, ...contextualTerms];
    
    // Re-analyze with enhanced terms
    const enhancedConditions = this.dataProcessor.getConditionsByKeywords(enhancedTerms);
    const enhancedConfidence = this.calculateConfidence(enhancedTerms, enhancedConditions);

    return {
      extractedTerms: enhancedTerms,
      matchedConditions: enhancedConditions,
      confidence: enhancedConfidence
    };
  }

  private extractContextualTerms(text: string): string[] {
    const contextualTerms: string[] = [];
    const lowerText = text.toLowerCase();

    // Extract contextual patterns
    const contextPatterns = [
      // Time-based patterns
      { pattern: /(?:recent|acute|chronic|long.?term|ongoing)/gi, terms: ['chronic', 'ongoing'] },
      
      // Severity patterns
      { pattern: /(?:severe|mild|moderate|advanced|progressive)/gi, terms: ['severe', 'progressive'] },
      
      // Family history
      { pattern: /(?:family history|hereditary|genetic|inherited)/gi, terms: ['hereditary', 'genetic'] },
      
      // Medication response
      { pattern: /(?:responds to|improved with|controlled by|resistant to)/gi, terms: ['medication response'] },
      
      // Complications
      { pattern: /(?:complication|secondary to|resulting in|leading to)/gi, terms: ['complications'] }
    ];

    contextPatterns.forEach(({ pattern, terms }) => {
      if (pattern.test(text)) {
        contextualTerms.push(...terms);
      }
    });

    return contextualTerms;
  }
}
