import React from 'react';
import { X, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';

export default function NamespaceLoadingModal({ isOpen, status, error, onClose, namespaceName, onRetry, isEditMode = false }) {
  if (!isOpen) return null;

  const actionText = isEditMode ? 'Updating' : 'Creating';
  const actionTextPast = isEditMode ? 'updated' : 'created';
  const errorActionText = isEditMode ? 'Updating' : 'Creating';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 mx-4">
        {(status === 'error' || status === 'success') && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <div className="flex flex-col items-center text-center">
          {status === 'loading' ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {actionText} Namespace
              </h3>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please wait while we {actionText.toLowerCase()} your namespace{namespaceName ? ` "${namespaceName}"` : ''}...
              </p>
              
              <div className="mt-6 w-full space-y-2">
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This may take a few moments
                </p>
              </div>
            </>
          ) : status === 'success' ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Namespace {actionTextPast.charAt(0).toUpperCase() + actionTextPast.slice(1)} Successfully
              </h3>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Your namespace{namespaceName ? ` "${namespaceName}"` : ''} has been {actionTextPast} successfully.
              </p>
              
              <button
                onClick={onClose}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Continue
              </button>
            </>
          ) : status === 'error' ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Error {errorActionText} Namespace
              </h3>
              
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error || 'An unexpected error occurred. Please try again.'}
              </p>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={onRetry || onClose}
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Try Again
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
} 