'use client';

import { motion } from 'framer-motion';
import { Brain, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface AnalysisStageProps {
  analysisResult?: AnalysisResult;
  onNext: () => void;
  onPrevious: () => void;
}

export default function AnalysisStage({ analysisResult, onNext, onPrevious }: AnalysisStageProps) {
  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <div className="animate-pulse">
            <Brain className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analyzing Clinical Note
            </h2>
            <p className="text-gray-600">
              ClinicalBERT is processing your clinical notes to extract medical terms and identify potential conditions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success-600';
    if (confidence >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-6 h-6 mr-3 text-primary-600" />
            ClinicalBERT Analysis Results
          </h2>
          <p className="text-gray-600 mt-2">
            AI analysis has extracted medical terms and identified potential chronic conditions.
          </p>
        </div>

        <div className="space-y-6">
          {/* Confidence Score */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Confidence</h3>
              <span className={`text-lg font-bold ${getConfidenceColor(analysisResult.confidence)}`}>
                {analysisResult.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysisResult.confidence >= 80 ? 'bg-success-600' :
                  analysisResult.confidence >= 60 ? 'bg-warning-600' : 'bg-error-600'
                }`}
                style={{ width: `${analysisResult.confidence}%` }}
              />
            </div>
            <p className={`text-sm mt-2 ${getConfidenceColor(analysisResult.confidence)}`}>
              {getConfidenceLabel(analysisResult.confidence)}
            </p>
          </div>

          {/* Extracted Terms */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-success-600" />
              Extracted Medical Terms ({analysisResult.extractedTerms.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.extractedTerms.map((term, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>

          {/* Matched Conditions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-warning-600" />
              Potential Chronic Conditions ({analysisResult.matchedConditions.length})
            </h3>
            {analysisResult.matchedConditions.length > 0 ? (
              <div className="space-y-3">
                {analysisResult.matchedConditions.map((condition, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{condition.condition}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">ICD-10:</span> {condition.icd10Code}
                        </p>
                        <p className="text-sm text-gray-600">
                          {condition.icd10Description}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          PMB Eligible
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800">
                    No chronic conditions were identified from the clinical notes. 
                    Please review the extracted terms or provide more detailed clinical information.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onPrevious}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Input
            </button>
            
            {analysisResult.matchedConditions.length > 0 && (
              <button
                onClick={onNext}
                className="btn-primary flex items-center"
              >
                Continue to Condition Selection
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
