import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Updated validation for each step
const isStepValid = (currentStep, formData) => {
  switch (currentStep) {
    case 0: // Internal Name: require internal name
      return Boolean(formData.internalName?.trim());
    case 1: // Design: always valid since theme has a default value
      return true; // Theme selection is always valid since it has a default value
    case 2: // Basic Info: require name and description
      return Boolean(formData.name?.trim() && formData.description?.trim());
    case 3: // Campaign Details: require category (and subcategory if political) and at least one non-empty survey question
      return Boolean(
        formData.category &&
        (formData.category === 'political' ? formData.subcategory?.trim() : true) &&
        formData.surveyQuestions?.length > 0 &&
        formData.surveyQuestions.every(q => q.question.trim())
      );
    case 4: // Business Info: require Business Name and Business Email
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
  setIsAIModalOpen
}) {
  const canProceed = isStepValid(currentStep, { ...formData, surveyQuestions });

  return (
    <div className={`flex items-center justify-between gap-4 mt-8 w-full ${className}`}>
      {currentStep > 0 && (
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
      )}
      {!currentStep && <div />}
      <div className="flex justify-end gap-4">
        {currentStep > 0 && (
          <button
            type="button"
            disabled={!canProceed || isSubmitting || isSavingDraft}
            className={`rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium ${
              !canProceed 
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            } dark:border-gray-800 dark:bg-gray-900`}
            onClick={handleSaveDraft}
          >
            {isSavingDraft ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isEditingDraft ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              isEditingDraft ? 'Update Draft' : 'Save as Draft'
            )}
          </button>
        )}
        
        {currentStep === 0 && (
          <button
            type="button"
            onClick={() => setIsAIModalOpen(true)}
            disabled={!formData.internalName?.trim()}
            className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium ${
              !formData.internalName?.trim()
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            } dark:border-gray-800 dark:bg-gray-900`}
          >
            <Sparkles className="h-4 w-4" />
            Generate Campaign info with AI
          </button>
        )}

        {currentStep < totalSteps - 1 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white ${
              canProceed ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canProceed || isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Create Campaign'
            )}
          </button>
        )}
      </div>
    </div>
  );
}