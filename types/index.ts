export interface ChronicCondition {
  condition: string;
  icd10Code: string;
  icd10Description: string;
}

export interface TreatmentBasket {
  procedureDescription: string;
  procedureCode: string;
  coverageLimit: number;
  basketType: 'diagnostic' | 'ongoing_management';
}

export interface ConditionWithBaskets {
  condition: ChronicCondition;
  diagnosticBasket: TreatmentBasket[];
  ongoingManagementBasket: TreatmentBasket[];
  specialistCoverage: number;
}

export interface ClinicalNote {
  text: string;
  extractedTerms: string[];
  matchedConditions: ChronicCondition[];
  selectedCondition?: ChronicCondition;
}

export interface SelectedProcedure {
  procedure: TreatmentBasket;
  quantity: number;
  evidenceFiles: File[];
}

export interface ClaimPackage {
  condition: ChronicCondition;
  selectedProcedures: SelectedProcedure[];
  supportingEvidence: File[];
  createdAt: Date;
  claimId: string;
}

export interface AnalysisResult {
  extractedTerms: string[];
  matchedConditions: ChronicCondition[];
  confidence: number;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface AppState {
  currentStep: number;
  clinicalNote: string;
  analysisResult?: AnalysisResult;
  selectedCondition?: ChronicCondition;
  selectedProcedures: SelectedProcedure[];
  claimPackage?: ClaimPackage;
  workflowSteps: WorkflowStep[];
}
