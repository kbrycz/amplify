import React from 'react';
import { ChevronLeft, ChevronRight, Copy } from 'lucide-react';

export function StepNavigation({
  className = '',
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
  isSavingDraft,
  handleSaveDraft,
  isEditingDraft,
  formData,
  selectedCaptionStyle,
  isStepValid = true,
  finalStepText // optional custom final button text
}) {
  const canProceed = isStepValid;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 w-full ${className}`}>
      <div className="order-2 sm:order-1">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
        )}
      </div>
      <div className="order-1 sm:order-2 flex flex-col sm:flex-row gap-2 sm:items-center">
        {handleSaveDraft && (
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || !formData?.name?.trim()}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 ${
              (isSavingDraft || !formData?.name?.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSavingDraft ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{isEditingDraft ? 'Update Draft' : 'Save Draft'}</span>
              </>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting || !canProceed}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 ${
            (isSubmitting || !canProceed) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{isLastStep ? (finalStepText || 'Creating...') : 'Next...'}</span>
            </>
          ) : (
            <>
              <span>{isLastStep ? (finalStepText || 'Create Template') : 'Next'}</span>
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}