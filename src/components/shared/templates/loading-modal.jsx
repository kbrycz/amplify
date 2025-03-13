import React from 'react';
import { Loader2, X, CheckCircle } from 'lucide-react';

export function LoadingModal({ isOpen, onClose, status, error, entityName, entityType = "template" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={error ? onClose : undefined}
      />

      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          {error && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="mt-3 text-center sm:mt-5">
            {error ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                  <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {entityType.charAt(0).toUpperCase() + entityType.slice(1)} Creation Failed
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {error}
                </p>
                <div className="mt-6">
                  <button
                    onClick={onClose}
                    className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              </>
            ) : status === 'success' ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {entityType.charAt(0).toUpperCase() + entityType.slice(1)} Created Successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Your {entityType} "{entityName}" has been created successfully.
                </p>

                <div className="mt-6">
                  <button
                    onClick={onClose}
                    className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-text-600 dark:text-primary-text-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Creating Your {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we set up your {entityType}...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 