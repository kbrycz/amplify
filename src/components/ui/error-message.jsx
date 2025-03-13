import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export function ErrorMessage({ message, duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-dismiss the error after the specified duration if onClose is provided
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation before calling onClose
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Wait for fade-out animation before calling onClose
    }
  };
  
  return (
    <div 
      className={`my-4 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-6 py-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 max-w-[800px] shadow-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button 
          onClick={handleClose}
          className="rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}