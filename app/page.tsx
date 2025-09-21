'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataProcessor } from '@/lib/data-processor';
import { ClinicalBERTProcessor } from '@/lib/clinical-bert';
import { AppState, WorkflowStep } from '@/types';
import WorkflowStepper from '@/components/WorkflowStepper';
import TextInputStage from '@/components/TextInputStage';
import AnalysisStage from '@/components/AnalysisStage';
import ConditionSelectionStage from '@/components/ConditionSelectionStage';
import PMBComplianceStage from '@/components/PMBComplianceStage';
import EvidenceStage from '@/components/EvidenceStage';
import ClaimExportStage from '@/components/ClaimExportStage';

const initialWorkflowSteps: WorkflowStep[] = [
  {
    id: 'input',
    title: 'Clinical Note Input',
    description: 'Enter or paste clinical notes',
    completed: false,
    active: true
  },
  {
    id: 'analysis',
    title: 'ClinicalBERT Analysis',
    description: 'AI analysis of clinical terms',
    completed: false,
    active: false
  },
  {
    id: 'condition',
    title: 'Condition Selection',
    description: 'Select confirmed condition',
    completed: false,
    active: false
  },
  {
    id: 'pmb',
    title: 'PMB Compliance',
    description: 'Select treatment procedures',
    completed: false,
    active: false
  },
  {
    id: 'evidence',
    title: 'Supporting Evidence',
    description: 'Upload supporting documents',
    completed: false,
    active: false
  },
  {
    id: 'export',
    title: 'Claim Export',
    description: 'Generate and export claim',
    completed: false,
    active: false
  }
];

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 0,
    clinicalNote: '',
    selectedProcedures: [],
    workflowSteps: initialWorkflowSteps
  });

  const [dataProcessor] = useState(() => new DataProcessor());
  const [clinicalBERT] = useState(() => new ClinicalBERTProcessor(dataProcessor));
  const [isLoading, setIsLoading] = useState(false);

  const updateWorkflowStep = (stepIndex: number, updates: Partial<WorkflowStep>) => {
    setAppState(prev => ({
      ...prev,
      workflowSteps: prev.workflowSteps.map((step, index) => 
        index === stepIndex ? { ...step, ...updates } : step
      )
    }));
  };

  const moveToNextStep = () => {
    if (appState.currentStep < appState.workflowSteps.length - 1) {
      // Mark current step as completed
      updateWorkflowStep(appState.currentStep, { completed: true, active: false });
      
      // Activate next step
      updateWorkflowStep(appState.currentStep + 1, { active: true });
      
      setAppState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    }
  };

  const moveToPreviousStep = () => {
    if (appState.currentStep > 0) {
      // Deactivate current step
      updateWorkflowStep(appState.currentStep, { active: false });
      
      // Reactivate previous step
      updateWorkflowStep(appState.currentStep - 1, { active: true, completed: false });
      
      setAppState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  const handleClinicalNoteSubmit = async (note: string) => {
    setIsLoading(true);
    setAppState(prev => ({ ...prev, clinicalNote: note }));
    
    try {
      const analysisResult = await clinicalBERT.analyzeClinicalNote(note);
      setAppState(prev => ({ ...prev, analysisResult }));
      moveToNextStep();
    } catch (error) {
      console.error('Analysis failed:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleConditionSelect = (condition: any) => {
    setAppState(prev => ({ ...prev, selectedCondition: condition }));
    moveToNextStep();
  };

  const handleProceduresSelect = (procedures: any[]) => {
    setAppState(prev => ({ ...prev, selectedProcedures: procedures }));
    moveToNextStep();
  };

  const handleEvidenceUpload = (evidence: File[]) => {
    setAppState(prev => ({ 
      ...prev, 
      claimPackage: {
        condition: prev.selectedCondition!,
        selectedProcedures: prev.selectedProcedures,
        supportingEvidence: evidence,
        createdAt: new Date(),
        claimId: `CLAIM-${Date.now()}`
      }
    }));
    moveToNextStep();
  };

  const renderCurrentStage = () => {
    switch (appState.currentStep) {
      case 0:
        return (
          <TextInputStage
            onSubmit={handleClinicalNoteSubmit}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <AnalysisStage
            analysisResult={appState.analysisResult}
            onNext={moveToNextStep}
            onPrevious={moveToPreviousStep}
          />
        );
      case 2:
        return (
          <ConditionSelectionStage
            analysisResult={appState.analysisResult}
            onConditionSelect={handleConditionSelect}
            onPrevious={moveToPreviousStep}
          />
        );
      case 3:
        return (
          <PMBComplianceStage
            selectedCondition={appState.selectedCondition}
            dataProcessor={dataProcessor}
            onProceduresSelect={handleProceduresSelect}
            onPrevious={moveToPreviousStep}
          />
        );
      case 4:
        return (
          <EvidenceStage
            selectedProcedures={appState.selectedProcedures}
            onEvidenceUpload={handleEvidenceUpload}
            onPrevious={moveToPreviousStep}
          />
        );
      case 5:
        return (
          <ClaimExportStage
            claimPackage={appState.claimPackage}
            onPrevious={moveToPreviousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SaluLink Specialist Aid Documentation
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered PMB compliance documentation for chronic conditions
          </p>
        </div>

        {/* Workflow Stepper */}
        <WorkflowStepper 
          steps={appState.workflowSteps}
          currentStep={appState.currentStep}
        />

        {/* Main Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={appState.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
