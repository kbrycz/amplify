import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Copy } from 'lucide-react';

// Updated validation for each step
const isStepValid = (currentStep, formData) => {
  switch (currentStep) {
    case 0: // Internal Name: always valid since we want to allow saving drafts
      return Boolean(formData.name?.trim());
    case 1: // Category: require a category selection
      return Boolean(formData.category);
    case 2: // Template: require a subcategory selection (or skip if category is 'other')
      return formData.category === 'other' || Boolean(formData.subcategory);
    case 3: // Design: always valid since theme has a default value
      return true; // Theme selection is always valid since it has a default value
    case 4: // Basic Info: require name and description
      return Boolean(formData.title?.trim() && formData.description?.trim());
    case 5: // Campaign Details: require category (and subcategory if political) and at least one non-empty survey question
      return Boolean(
        formData.category &&
        (formData.category === 'political' ? formData.subcategory?.trim() : true) &&
        formData.surveyQuestions?.length > 0 &&
        formData.surveyQuestions.every(q => q.question.trim())
      );
    case 6: // Business Info: require Business Name and Business Email
      return Boolean(formData.businessName?.trim() && formData.email?.trim());
    default:
      return false;
  }
};

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
  surveyQuestions,
  setIsAIModalOpen,
  onUseTemplate
}) {
  const canProceed = isStepValid(currentStep, { ...formData, surveyQuestions });
  const isFirstStep = currentStep === 0;
  
  // Debug logging
  React.useEffect(() => {
    console.log('StepNavigation state:', { 
      currentStep, 
      hasCategory: Boolean(formData.category),
      hasSubcategory: Boolean(formData.subcategory),
      buttonText: getCorrectButtonText()
    });
  }, [currentStep, formData.category, formData.subcategory, totalSteps]);
  
  // Ensure button is always enabled on steps 1 and 2
  const isButtonDisabled = React.useMemo(() => {
    if (currentStep === 1 || currentStep === 2) {
      return isSubmitting;
    }
    return isSubmitting || !canProceed;
  }, [currentStep, isSubmitting, canProceed]);
  
  // Get the correct button text based on current state
  const getCorrectButtonText = () => {
    console.log('getCorrectButtonText called with:', { 
      currentStep, 
      hasCategory: Boolean(formData.category),
      hasSubcategory: Boolean(formData.subcategory)
    });
    
    if (isSubmitting) {
      return currentStep === totalSteps - 1 ? 'Creating...' : 'Next...';
    }
    
    if (currentStep === totalSteps - 1) {
      return 'Create Campaign';
    }
    
    // Always show "Continue without template" on step 1 if no category is selected
    // This is critical for when users navigate back to this step
    if (currentStep === 1 && !formData.category) {
      return 'Continue without template';
    }
    
    // Always show "Continue without example questions" on step 2 if no subcategory is selected
    if (currentStep === 2 && !formData.subcategory) {
      console.log('Showing "Continue without example questions" button');
      return 'Continue without example questions';
    }
    
    return 'Next';
  };

  // Force update when component re-renders
  React.useEffect(() => {
    // This will force the component to re-render with the correct button text
    const buttonText = getCorrectButtonText();
    console.log('Button text updated:', buttonText);
  }, [currentStep, formData.category, formData.subcategory, isSubmitting]);

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 w-full ${className}`}>
      {/* Left side - Previous button or Template button (desktop only) */}
      <div className="order-2 sm:order-1 hidden sm:block">
        {isFirstStep ? (
          // Show "Use Previous Campaign as Template" button on first step (desktop only)
          <button
            type="button"
            onClick={onUseTemplate}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-indigo-400 dark:hover:bg-gray-800"
          >
            <Copy className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-normal text-left">Use Previous Campaign as Template</span>
          </button>
        ) : (
          // Show Previous button on other steps
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
        {/* Mobile layout for first step */}
        {isFirstStep && (
          <>
            {/* Template button on mobile - no margin bottom */}
            <div className="sm:hidden w-full">
              <button
                type="button"
                onClick={onUseTemplate}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-indigo-400 dark:hover:bg-gray-800"
              >
                <Copy className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-normal text-left">Use Previous Campaign as Template</span>
              </button>
            </div>

            {/* AI Generate button */}
            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              disabled={!formData.name?.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-normal text-left">Generate with AI</span>
            </button>
          </>
        )}

        {/* Mobile layout for other steps - reordered buttons */}
        {!isFirstStep && (
          <>
            {/* Save Draft button - first on mobile for other steps */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || !formData.name?.trim()}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 ${
                (isSavingDraft || !formData.name?.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSavingDraft ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  {isEditingDraft ? 'Update Draft' : 'Save Draft'}
                </>
              )}
            </button>

            {/* Previous button (visible on mobile for steps > 0) */}
            <button
              type="button"
              onClick={onPrevious}
              className="sm:hidden inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
          </>
        )}

        {/* Next/Submit button - always last */}
        <button
          type={currentStep === totalSteps - 1 ? 'submit' : 'button'}
          onClick={currentStep < totalSteps - 1 ? onNext : undefined}
          disabled={isButtonDisabled}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 ${
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
              {getCorrectButtonText()}
              {currentStep < totalSteps - 1 && <ChevronRight className="h-4 w-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}