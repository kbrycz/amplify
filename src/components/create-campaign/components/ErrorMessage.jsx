import React, { useState, useEffect } from 'react';
import { X, Info, AlertCircle, CheckCircle } from 'lucide-react';

export const ErrorMessage = ({ error, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(!!error);
  
  // Reset visibility when error changes
  useEffect(() => {
    if (error) {
      setIsVisible(true);
      
      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [error, duration]);
  
  if (!error) return null;
  
  // Determine the background and text colors based on the error type
  const getStyles = () => {
    if (error.type === 'success') {
      return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    } else if (error.type === 'info') {
      return 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border-primary-200 dark:border-primary-800';
    } else {
      return 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400 border-red-200 dark:border-red-800';
    }
  };
  
  // Get the appropriate icon based on the error type
  const getIcon = () => {
    if (error.type === 'success') {
      return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
    } else if (error.type === 'info') {
      return <Info className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };
  
  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
  };
  
  return (
    <div 
      role="alert" 
      className={`mb-4 flex items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm border shadow-sm transition-all duration-300 ${getStyles()} ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-[-10px]'}`}
    >
      <div className="flex items-center gap-2">
        {getIcon()}
        <span>{error.message || error}</span>
      </div>
      <button 
        onClick={handleClose}
        className="rounded-full p-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}; 