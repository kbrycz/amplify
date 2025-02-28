import React from 'react';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';

export function NavigationButtons({ 
  currentStep, 
  isUploading, 
  uploadProgress,
  goToPreviousStep, 
  goToNextStep,
  handleSubmit,
  theme, 
  themes 
}) {
  if (currentStep === 'intro' || currentStep === 'success') return null;

  return (
    <div className="mt-8 flex justify-between">
      <button
        onClick={goToPreviousStep}
        disabled={isUploading}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
          theme 
            ? `${themes[theme].border} border-2 ${themes[theme].text} hover:bg-white/10` 
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      {currentStep === 'response' ? (
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
            theme 
              ? `${themes[theme].border} border-2 ${themes[theme].text} hover:bg-white/10` 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading... {uploadProgress}%
            </span>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Video
            </>
          )}
        </button>
      ) : (
        <button
          onClick={goToNextStep}
          disabled={isUploading}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
            theme 
              ? `${themes[theme].border} border-2 ${themes[theme].text} hover:bg-white/10` 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}