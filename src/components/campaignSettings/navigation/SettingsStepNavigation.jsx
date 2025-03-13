import React from 'react';
import { ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react';
import { isStepValid } from '../../create-campaign/utils/campaignSettingsSteps';

export function SettingsStepNavigation({
  className = '',
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
  formData,
  surveyQuestions,
  setIsDeleteModalOpen
}) {
  const canProceed = isStepValid(currentStep, formData, surveyQuestions);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  
  // Ensure button is always enabled on the last step (review)
  const isButtonDisabled = React.useMemo(() => {
    // Always enable the button on the last step (review page)
    if (isLastStep) {
      return isSubmitting;
    }
    
    // For other steps, check if the step is valid
    return isSubmitting || !canProceed;
  }, [currentStep, isSubmitting, canProceed, isLastStep]);
  
  // Get the correct button text based on current state
  const getCorrectButtonText = () => {
    if (isSubmitting) {
      return currentStep === totalSteps - 1 ? 'Updating...' : 'Next...';
    }
    
    if (currentStep === totalSteps - 1) {
      return 'Update Campaign';
    }
    
    return 'Next';
  };

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 w-full ${className}`}>
      {/* Left side - Previous button */}
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

      {/* Right side - Next/Save/Submit buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
        {/* Delete button - only on review step */}
        {isLastStep && (
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete Campaign
          </button>
        )}

        {/* Next/Submit button - always last */}
        <button
          type={currentStep === totalSteps - 1 ? 'submit' : 'button'}
          onClick={currentStep < totalSteps - 1 ? onNext : undefined}
          disabled={isButtonDisabled}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 ${
            isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {getCorrectButtonText()}
            </>
          ) : (
            <>
              {isLastStep ? <Save className="h-4 w-4" /> : null}
              {getCorrectButtonText()}
              {currentStep < totalSteps - 1 && <ChevronRight className="h-4 w-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
} 