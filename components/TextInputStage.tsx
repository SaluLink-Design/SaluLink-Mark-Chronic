'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Loader2 } from 'lucide-react';

interface TextInputStageProps {
  onSubmit: (note: string) => void;
  isLoading: boolean;
}

export default function TextInputStage({ onSubmit, isLoading }: TextInputStageProps) {
  const [clinicalNote, setClinicalNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clinicalNote.trim()) {
      onSubmit(clinicalNote.trim());
    }
  };

  const exampleNotes = [
    "Patient presents with fatigue, weight loss, and hyperpigmentation. Blood pressure 90/60. Laboratory results show low cortisol levels and elevated ACTH. Suspected adrenal insufficiency.",
    "45-year-old male with type 2 diabetes mellitus, HbA1c 8.5%, presenting with polyuria, polydipsia, and blurred vision. Blood glucose 15.2 mmol/L.",
    "Patient with rheumatoid arthritis, morning stiffness >1 hour, symmetric joint swelling in hands and feet. Positive rheumatoid factor and anti-CCP antibodies.",
    "60-year-old female with hypertension, blood pressure 160/95, family history of cardiovascular disease. ECG shows left ventricular hypertrophy."
  ];

  const handleExampleClick = (example: string) => {
    setClinicalNote(example);
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
            <FileText className="w-6 h-6 mr-3 text-primary-600" />
            Clinical Note Input
          </h2>
          <p className="text-gray-600 mt-2">
            Enter or paste clinical notes describing the patient's symptoms, history, and preliminary diagnoses.
            Our AI will analyze the text to identify relevant chronic conditions and ICD-10 codes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="clinical-note" className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Notes
            </label>
            <textarea
              id="clinical-note"
              rows={12}
              className="input-field resize-none"
              placeholder="Enter clinical notes here... Include symptoms, medical history, laboratory results, and any preliminary diagnoses."
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {clinicalNote.length} characters
            </p>
          </div>

          {/* Example Notes */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Example Clinical Notes:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleNotes.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {example}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Option */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Or upload a clinical note file
            </p>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="file-upload"
              className="btn-secondary cursor-pointer inline-block"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: TXT, DOC, DOCX, PDF
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!clinicalNote.trim() || isLoading}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Analyze Clinical Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
