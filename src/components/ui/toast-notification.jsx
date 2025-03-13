import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

// Create a context for toast notifications
const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 5000, toastId = null) => {
    // If toastId is provided, replace that toast instead of adding a new one
    if (toastId !== null) {
      setToasts(prev => prev.map(toast => 
        toast.id === toastId 
          ? { ...toast, message, type, duration } 
          : toast
      ));
      
      // Reset the auto-remove timeout if duration is provided
      if (duration > 0) {
        setTimeout(() => {
          removeToast(toastId);
        }, duration);
      }
      
      return toastId;
    }
    
    // Otherwise, create a new toast
    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after duration if duration is not 0
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose the context value
  const contextValue = {
    toasts,
    addToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const { id, message, type } = toast;
  
  // Define styles based on type
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />,
      title: 'Success'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
      title: 'Error'
    },
    info: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      border: 'border-primary-200 dark:border-primary-800',
      icon: <AlertCircle className="w-5 h-5 text-primary-500 dark:text-primary-400" />,
      title: 'Info'
    }
  };
  
  const style = styles[type] || styles.info;

  // Animation effect
  useEffect(() => {
    const element = document.getElementById(`toast-${id}`);
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateX(100%)';
      
      // Trigger animation
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
      }, 10);
    }
  }, [id]);

  return (
    <div
      id={`toast-${id}`}
      className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out flex items-start gap-3`}
      style={{ opacity: 0, transform: 'translateX(100%)' }}
    >
      <div className="flex-shrink-0">
        {style.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">{style.title}</p>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {typeof message === 'string' ? message : message}
        </div>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
} 