import React from 'react';

export function ProgressBar({ currentStepIndex, totalSteps, theme, themes }) {
  return (
    <div className="fixed inset-x-0 top-0">
      <div className={`h-1 ${theme ? 'bg-white/10' : 'bg-gray-200 dark:bg-gray-800'}`}>
        <div
          className={`h-1 ${theme ? 'bg-white/20' : 'bg-indigo-600 dark:bg-indigo-400'} transition-all duration-500`}
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}