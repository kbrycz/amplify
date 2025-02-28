import React from 'react';

export function StepProgress({ currentStep, steps }) {
  return (
    <div className="fixed inset-x-0 top-0 z-[100]">
      <div className="h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-1 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}