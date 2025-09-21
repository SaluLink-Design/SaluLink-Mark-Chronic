'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { ChronicCondition, TreatmentBasket, SelectedProcedure } from '@/types';

interface PMBComplianceStageProps {
  selectedCondition?: ChronicCondition;
  dataProcessor: any;
  onProceduresSelect: (procedures: SelectedProcedure[]) => void;
  onPrevious: () => void;
}

export default function PMBComplianceStage({ 
  selectedCondition, 
  dataProcessor, 
  onProceduresSelect, 
  onPrevious 
}: PMBComplianceStageProps) {
  const [treatmentBaskets, setTreatmentBaskets] = useState<any>(null);
  const [selectedProcedures, setSelectedProcedures] = useState<SelectedProcedure[]>([]);

  useEffect(() => {
    if (selectedCondition) {
      const baskets = dataProcessor.getTreatmentBaskets(selectedCondition.icd10Code);
      setTreatmentBaskets(baskets);
    }
  }, [selectedCondition, dataProcessor]);

  const handleProcedureToggle = (procedure: TreatmentBasket, basketType: 'diagnostic' | 'ongoing_management') => {
    const procedureKey = `${procedure.procedureCode}-${basketType}`;
    const existingIndex = selectedProcedures.findIndex(p => 
      p.procedure.procedureCode === procedure.procedureCode && 
      p.procedure.basketType === basketType
    );

    if (existingIndex >= 0) {
      // Remove procedure
      setSelectedProcedures(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      // Add procedure
      const newProcedure: SelectedProcedure = {
        procedure: { ...procedure, basketType },
        quantity: 1,
        evidenceFiles: []
      };
      setSelectedProcedures(prev => [...prev, newProcedure]);
    }
  };

  const handleQuantityChange = (procedureCode: string, basketType: string, quantity: number) => {
    setSelectedProcedures(prev => prev.map(p => 
      p.procedure.procedureCode === procedureCode && p.procedure.basketType === basketType
        ? { ...p, quantity: Math.max(1, Math.min(quantity, p.procedure.coverageLimit)) }
        : p
    ));
  };

  const isProcedureSelected = (procedure: TreatmentBasket, basketType: 'diagnostic' | 'ongoing_management') => {
    return selectedProcedures.some(p => 
      p.procedure.procedureCode === procedure.procedureCode && 
      p.procedure.basketType === basketType
    );
  };

  const getSelectedProcedure = (procedure: TreatmentBasket, basketType: 'diagnostic' | 'ongoing_management') => {
    return selectedProcedures.find(p => 
      p.procedure.procedureCode === procedure.procedureCode && 
      p.procedure.basketType === basketType
    );
  };

  const handleContinue = () => {
    onProceduresSelect(selectedProcedures);
  };

  if (!selectedCondition || !treatmentBaskets) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <div className="animate-pulse">
            <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Treatment Baskets
            </h2>
            <p className="text-gray-600">
              Retrieving PMB treatment baskets for {selectedCondition?.condition}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-primary-600" />
            PMB Compliance - Treatment Basket Selection
          </h2>
          <p className="text-gray-600 mt-2">
            Select the procedures and tests that have been performed for {selectedCondition.condition} (ICD-10: {selectedCondition.icd10Code}).
          </p>
        </div>

        <div className="space-y-8">
          {/* Condition Summary */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h3 className="font-semibold text-primary-900 mb-2">Selected Condition</h3>
            <p className="text-primary-800">
              <strong>{selectedCondition.condition}</strong> - {selectedCondition.icd10Description}
            </p>
            <p className="text-sm text-primary-700 mt-1">
              Specialist Coverage: {treatmentBaskets.specialistCoverage} visit(s) per year
            </p>
          </div>

          {/* Diagnostic Basket */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
              Diagnostic Basket
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({treatmentBaskets.diagnosticBasket.length} procedures available)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treatmentBaskets.diagnosticBasket.map((procedure: TreatmentBasket, index: number) => {
                const isSelected = isProcedureSelected(procedure, 'diagnostic');
                const selectedProc = getSelectedProcedure(procedure, 'diagnostic');
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      border rounded-lg p-4 transition-all duration-200
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{procedure.procedureDescription}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Code: {procedure.procedureCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          Coverage: {procedure.coverageLimit} test(s)
                        </p>
                      </div>
                      <button
                        onClick={() => handleProcedureToggle(procedure, 'diagnostic')}
                        className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                          ${isSelected 
                            ? 'border-primary-500 bg-primary-500' 
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                    </div>
                    
                    {isSelected && selectedProc && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-primary-200 pt-3"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Number of tests performed:
                          </label>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              title="Decrease number of tests"
                              aria-label="Decrease number of tests"
                              onClick={() => handleQuantityChange(procedure.procedureCode, 'diagnostic', selectedProc.quantity - 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {selectedProc.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(procedure.procedureCode, 'diagnostic', selectedProc.quantity + 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum: {procedure.coverageLimit} tests
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Ongoing Management Basket */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Ongoing Management Basket
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({treatmentBaskets.ongoingManagementBasket.length} procedures available)
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treatmentBaskets.ongoingManagementBasket.map((procedure: TreatmentBasket, index: number) => {
                const isSelected = isProcedureSelected(procedure, 'ongoing_management');
                const selectedProc = getSelectedProcedure(procedure, 'ongoing_management');
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      border rounded-lg p-4 transition-all duration-200
                      ${isSelected 
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{procedure.procedureDescription}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Code: {procedure.procedureCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          Coverage: {procedure.coverageLimit} test(s)
                        </p>
                      </div>
                      <button
                        onClick={() => handleProcedureToggle(procedure, 'ongoing_management')}
                        className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                          ${isSelected 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                    </div>
                    
                    {isSelected && selectedProc && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-green-200 pt-3"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Number of tests performed:
                          </label>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(procedure.procedureCode, 'ongoing_management', selectedProc.quantity - 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {selectedProc.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(procedure.procedureCode, 'ongoing_management', selectedProc.quantity + 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum: {procedure.coverageLimit} tests
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Selected Procedures Summary */}
          {selectedProcedures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                Selected Procedures Summary ({selectedProcedures.length})
              </h3>
              <div className="space-y-2">
                {selectedProcedures.map((proc, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {proc.procedure.procedureDescription} ({proc.procedure.procedureCode})
                    </span>
                    <span className="text-gray-600">
                      {proc.quantity} test(s) - {proc.procedure.basketType === 'diagnostic' ? 'Diagnostic' : 'Ongoing Management'}
                    </span>
                  </div>
                ))}
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
              Back to Condition Selection
            </button>
            
            <button
              onClick={handleContinue}
              disabled={selectedProcedures.length === 0}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Evidence Upload
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
