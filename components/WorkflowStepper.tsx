'use client';

import { WorkflowStep } from '@/types';
import { Check, Circle } from 'lucide-react';

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  currentStep: number;
}

export default function WorkflowStepper({ steps, currentStep }: WorkflowStepperProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                step-indicator
                ${step.completed ? 'step-completed' : ''}
                ${step.active ? 'step-active' : ''}
                ${!step.completed && !step.active ? 'step-pending' : ''}
              `}>
                {step.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  step.active ? 'text-primary-600' : 
                  step.completed ? 'text-success-600' : 
                  'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 mt-4
                ${index < currentStep ? 'bg-success-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
