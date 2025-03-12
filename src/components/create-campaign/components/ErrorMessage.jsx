import React from 'react';
import { X, Info } from 'lucide-react';

export const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  // Determine the background and text colors based on the error type
  const getStyles = () => {
    if (error.type === 'success') {
      return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    } else if (error.type === 'info') {
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    } else {
      return 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400';
    }
  };
  
  // Get the appropriate icon based on the error type
  const getIcon = () => {
    if (error.type === 'success') {
      return (
        <svg className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    } else if (error.type === 'info') {
      return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    } else {
      return <X className="h-4 w-4" />;
    }
  };
  
  return (
    <div role="alert" className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${getStyles()}`}>
      {getIcon()}
      {error.message || error}
    </div>
  );
}; 