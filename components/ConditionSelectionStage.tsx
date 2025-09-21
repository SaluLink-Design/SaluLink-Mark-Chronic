'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Search, Info } from 'lucide-react';
import { AnalysisResult, ChronicCondition } from '@/types';

interface ConditionSelectionStageProps {
  analysisResult?: AnalysisResult;
  onConditionSelect: (condition: ChronicCondition) => void;
  onPrevious: () => void;
}

export default function ConditionSelectionStage({ 
  analysisResult, 
  onConditionSelect, 
  onPrevious 
}: ConditionSelectionStageProps) {
  const [selectedCondition, setSelectedCondition] = useState<ChronicCondition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConditions = analysisResult?.matchedConditions.filter(condition =>
    condition.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.icd10Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.icd10Description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleConditionSelect = (condition: ChronicCondition) => {
    setSelectedCondition(condition);
  };

  const handleConfirm = () => {
    if (selectedCondition) {
      onConditionSelect(selectedCondition);
    }
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
            <CheckCircle className="w-6 h-6 mr-3 text-primary-600" />
            Condition Selection & Confirmation
          </h2>
          <p className="text-gray-600 mt-2">
            Review the AI-suggested conditions and select the correct one for PMB compliance processing.
          </p>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conditions, ICD-10 codes, or descriptions..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Analysis Summary */}
          {analysisResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Analysis Summary</h3>
                  <p className="text-blue-800 text-sm mt-1">
                    Found {analysisResult.matchedConditions.length} potential conditions from {analysisResult.extractedTerms.length} medical terms.
                    Confidence: {analysisResult.confidence}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conditions List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select the Correct Condition ({filteredConditions.length} found)
            </h3>
            
            {filteredConditions.length > 0 ? (
              <div className="space-y-3">
                {filteredConditions.map((condition, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${selectedCondition?.icd10Code === condition.icd10Code
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleConditionSelect(condition)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`
                            w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                            ${selectedCondition?.icd10Code === condition.icd10Code
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300'
                            }
                          `}>
                            {selectedCondition?.icd10Code === condition.icd10Code && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900">{condition.condition}</h4>
                        </div>
                        <div className="ml-7 mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">ICD-10 Code:</span> {condition.icd10Code}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Description:</span> {condition.icd10Description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          PMB Eligible
                        </span>
                        {selectedCondition?.icd10Code === condition.icd10Code && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conditions found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or go back to provide more detailed clinical notes.
                </p>
              </div>
            )}
          </div>

          {/* PMB Information */}
          {selectedCondition && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-success-50 border border-success-200 rounded-lg p-4"
            >
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-success-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-success-900">PMB Compliance Confirmed</h3>
                  <p className="text-success-800 text-sm mt-1">
                    {selectedCondition.condition} is a Prescribed Minimum Benefit (PMB) chronic condition.
                    Treatment baskets and procedures will be loaded for compliance verification.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onPrevious}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={!selectedCondition}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Condition & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
