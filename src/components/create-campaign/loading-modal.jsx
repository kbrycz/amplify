import React from 'react';
import { Loader2, X, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CopyButton } from '../ui/copy-button';

// Helper function to format error messages in a user-friendly way
const formatErrorMessage = (error) => {
  if (!error) return "An unknown error occurred. Please try again.";
  
  // Check for JSON parsing errors which often happen when HTML is returned instead of JSON
  if (error.includes("Unexpected token '<'") || error.includes("<!DOCTYPE")) {
    return "We're having trouble connecting to our servers. Please try again later or contact support if the issue persists.";
  }
  
  // Check for network errors
  if (error.includes("Network Error") || error.includes("Failed to fetch")) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }
  
  // Check for authorization errors
  if (error.includes("unauthorized") || error.includes("Unauthorized") || error.includes("403") || error.includes("401")) {
    return "Your session may have expired. Please refresh the page and try again.";
  }
  
  // If the error message is too long, truncate it
  if (error.length > 150) {
    return error.substring(0, 150) + "...";
  }
  
  return error;
};

export function LoadingModal({ isOpen, onClose, status, error, campaignId, campaignName }) {
  if (!isOpen) return null;

  const surveyUrl = campaignId ? `${window.location.origin}/survey/${campaignId}` : '';
  const formattedError = formatErrorMessage(error);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={error ? onClose : undefined}
      />

      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {error && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="text-center">
            {error ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                  <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                  Campaign Creation Failed
                </h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {formattedError}
                </p>
                <div className="mt-8">
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
                <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                  Campaign Created Successfully!
                </h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Your campaign "{campaignName}" has been created. Share the survey link with your audience to start collecting responses.
                </p>

                <div className="mt-8">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Survey URL
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        readOnly
                        value={surveyUrl}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <CopyButton text={surveyUrl} />
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
                  <Link
                    to={`/app/campaigns/${campaignId}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Campaign
                  </Link>
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
                <div className="mx-auto flex h-16 w-16 items-center justify-center mb-2">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Creating Your Campaign
                </h3>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-400 px-4">
                  Please wait while we set up your campaign...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}