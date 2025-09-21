'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, File, X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { SelectedProcedure } from '@/types';

interface EvidenceStageProps {
  selectedProcedures: SelectedProcedure[];
  onEvidenceUpload: (evidence: File[]) => void;
  onPrevious: () => void;
}

export default function EvidenceStage({ 
  selectedProcedures, 
  onEvidenceUpload, 
  onPrevious 
}: EvidenceStageProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [procedureEvidence, setProcedureEvidence] = useState<Map<string, File[]>>(new Map());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileToRemove));
    
    // Remove from procedure evidence mapping
    const newProcedureEvidence = new Map(procedureEvidence);
    newProcedureEvidence.forEach((files, key) => {
      const updatedFiles = files.filter(file => file !== fileToRemove);
      if (updatedFiles.length === 0) {
        newProcedureEvidence.delete(key);
      } else {
        newProcedureEvidence.set(key, updatedFiles);
      }
    });
    setProcedureEvidence(newProcedureEvidence);
  };

  const assignFileToProcedure = (file: File, procedure: SelectedProcedure) => {
    const key = `${procedure.procedure.procedureCode}-${procedure.procedure.basketType}`;
    const currentFiles = procedureEvidence.get(key) || [];
    
    if (!currentFiles.includes(file)) {
      const newFiles = [...currentFiles, file];
      setProcedureEvidence(prev => new Map(prev).set(key, newFiles));
    }
  };

  const removeFileFromProcedure = (file: File, procedure: SelectedProcedure) => {
    const key = `${procedure.procedure.procedureCode}-${procedure.procedure.basketType}`;
    const currentFiles = procedureEvidence.get(key) || [];
    const updatedFiles = currentFiles.filter(f => f !== file);
    
    if (updatedFiles.length === 0) {
      setProcedureEvidence(prev => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    } else {
      setProcedureEvidence(prev => new Map(prev).set(key, updatedFiles));
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleContinue = () => {
    onEvidenceUpload(uploadedFiles);
  };

  const getProcedureEvidence = (procedure: SelectedProcedure) => {
    const key = `${procedure.procedure.procedureCode}-${procedure.procedure.basketType}`;
    return procedureEvidence.get(key) || [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Upload className="w-6 h-6 mr-3 text-primary-600" />
            Supporting Evidence Documentation
          </h2>
          <p className="text-gray-600 mt-2">
            Upload supporting evidence for each selected procedure. This documentation is required for PMB compliance.
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload Area */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Evidence Files</h3>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-primary-600 font-medium">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG, GIF
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <span className="ml-2 text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(file)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {/* Assign to Procedures */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Assign to procedures:</p>
                      <div className="space-y-1">
                        {selectedProcedures.map((procedure, procIndex) => {
                          const isAssigned = getProcedureEvidence(procedure).includes(file);
                          return (
                            <button
                              key={procIndex}
                              onClick={() => 
                                isAssigned 
                                  ? removeFileFromProcedure(file, procedure)
                                  : assignFileToProcedure(file, procedure)
                              }
                              className={`
                                w-full text-left text-xs p-2 rounded border transition-colors
                                ${isAssigned 
                                  ? 'bg-primary-100 border-primary-300 text-primary-800' 
                                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="flex items-center">
                                {isAssigned && <CheckCircle className="w-3 h-3 mr-1" />}
                                <span className="truncate">
                                  {procedure.procedure.procedureDescription}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Procedure Evidence Mapping */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Evidence Assignment Summary
            </h3>
            <div className="space-y-4">
              {selectedProcedures.map((procedure, index) => {
                const evidence = getProcedureEvidence(procedure);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {procedure.procedure.procedureDescription}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Code: {procedure.procedure.procedureCode} | 
                          Quantity: {procedure.quantity} | 
                          Type: {procedure.procedure.basketType === 'diagnostic' ? 'Diagnostic' : 'Ongoing Management'}
                        </p>
                      </div>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${evidence.length > 0 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-warning-100 text-warning-800'
                        }
                      `}>
                        {evidence.length > 0 ? `${evidence.length} file(s)` : 'No evidence'}
                      </span>
                    </div>
                    
                    {evidence.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {evidence.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className="flex items-center bg-gray-50 px-2 py-1 rounded text-xs"
                          >
                            {getFileIcon(file)}
                            <span className="ml-1 text-gray-700">{file.name}</span>
                            <button
                              onClick={() => removeFileFromProcedure(file, procedure)}
                              className="ml-1 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No evidence files assigned to this procedure
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Evidence Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Evidence Requirements</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Test results (e.g., blood results, imaging reports)</li>
              <li>• Specialist consultation notes</li>
              <li>• Laboratory reports with reference ranges</li>
              <li>• Imaging studies with radiologist reports</li>
              <li>• Procedure reports and findings</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onPrevious}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Treatment Selection
            </button>
            
            <button
              onClick={handleContinue}
              className="btn-primary flex items-center"
            >
              Continue to Claim Export
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
