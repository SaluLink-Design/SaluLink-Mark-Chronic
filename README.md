# SaluLink Specialist Aid Documentation App

A comprehensive AI-powered application designed to assist medical specialists and their assistant teams in accurately documenting chronic condition cases for compliance with Prescribed Minimum Benefits (PMBs). The app integrates free-text clinical note analysis, ICD-10 code matching, and treatment basket mapping to ensure that claims are fully compliant and complete before submission to a medical scheme.

## Features

### 🤖 AI-Powered Clinical Analysis

- **ClinicalBERT Integration**: Advanced natural language processing for clinical note analysis
- **Medical Term Extraction**: Automatically identifies relevant medical terminology and symptoms
- **ICD-10 Code Matching**: Intelligent matching with chronic condition databases

### 📋 PMB Compliance Workflow

- **Condition Selection**: AI-suggested chronic conditions with confidence scoring
- **Treatment Basket Mapping**: Automatic loading of diagnostic and ongoing management procedures
- **Coverage Verification**: Real-time validation against PMB coverage limits

### 📄 Evidence Management

- **File Upload**: Support for multiple file formats (PDF, DOC, images, etc.)
- **Procedure Mapping**: Link evidence files to specific procedures
- **Documentation Tracking**: Complete audit trail of supporting evidence

### 📊 Claim Generation

- **Automated Compilation**: Generate complete claim packages
- **PDF Export**: Professional claim documents ready for submission
- **PMB Compliance Statement**: Built-in compliance verification

## Technology Stack

### Frontend

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form management
- **React Dropzone** for file uploads
- **jsPDF** for PDF generation

### Backend

- **FastAPI** for Python API
- **Pandas** for data processing
- **scikit-learn** for ML algorithms
- **spaCy** for NLP processing
- **NLTK** for text processing

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Git

### Frontend Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy model**:

   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Start the API server**:

   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## Data Sources

The application uses two core datasets:

### 1. CMS Chronic Conditions.csv

Contains the list of PMB chronic conditions and their ICD-10 mappings, including:

- Condition names
- ICD-10 codes
- ICD-10 descriptions

### 2. Discovery treatment-baskets-for-the-pmb-cdl-conditions.csv

Contains diagnostic and ongoing management baskets with:

- Procedure/test descriptions
- Procedure/test codes
- Coverage limits
- Specialist coverage information

## Workflow Overview

### 1. Clinical Note Input

- Large text input for clinical notes
- Support for file uploads
- Example clinical notes provided

### 2. ClinicalBERT Analysis

- AI extraction of medical terms
- Confidence scoring
- Potential condition identification

### 3. Condition Selection

- Review AI-suggested conditions
- Search and filter capabilities
- PMB eligibility confirmation

### 4. PMB Compliance

- Treatment basket loading
- Procedure selection with quantities
- Coverage limit validation

### 5. Evidence Documentation

- File upload and management
- Procedure-evidence mapping
- Documentation requirements

### 6. Claim Export

- Automated claim compilation
- PDF generation
- PMB compliance statement

## Example Workflow: Addison's Disease

1. **Input**: Clinical note describing adrenal insufficiency symptoms
2. **Analysis**: ClinicalBERT extracts "adrenal insufficiency, fatigue, cortisol deficiency"
3. **Matching**: AI identifies Addison's Disease (ICD-10: E27.1)
4. **Confirmation**: Specialist confirms the condition
5. **Treatment Baskets**:
   - **Diagnostic**: U & E (4171), Creatinine (4032), Cortisol level (4499), ACTH stimulation (4523)
   - **Ongoing Management**: U & E (4171), Creatinine (4032)
6. **Evidence**: Upload blood chemistry reports, cortisol assays
7. **Export**: Generate compliant claim package

## API Endpoints

### Analysis

- `POST /analyze` - Analyze clinical notes
- `GET /conditions` - Get all chronic conditions
- `GET /treatment-baskets/{icd10_code}` - Get treatment baskets

### Documentation

- `GET /docs` - API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## Development

### Frontend Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Backend Development

```bash
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests (when implemented)
pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software developed for SaluLink. All rights reserved.

## Support

For technical support or questions, please contact the development team.

## Version History

- **v1.0.0** - Initial release with core PMB compliance workflow
- **v1.1.0** - Enhanced AI analysis and evidence management
- **v1.2.0** - Improved UI/UX and PDF export functionality

---

**Note**: This application is designed specifically for South African medical aid PMB compliance and uses local medical coding standards (ICD-10) and treatment basket definitions.
