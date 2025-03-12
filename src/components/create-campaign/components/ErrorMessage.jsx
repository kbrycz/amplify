import React from 'react';
import { X } from 'lucide-react';

export const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <div role="alert" className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
      error.type === 'success'
        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400'
    }`}>
      {error.type === 'success' ? (
        <svg className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <X className="h-4 w-4" />
      )}
      {error.message || error}
    </div>
  );
}; 