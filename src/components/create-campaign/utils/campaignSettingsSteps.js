export const settingsSteps = [
  { name: 'Basic Info' },
  { name: 'Design' },
  { name: 'Campaign Details' },
  { name: 'Response Settings' },
  { name: 'Review' }
];

// Validation for each step
export const isStepValid = (currentStep, formData, surveyQuestions) => {
  switch (currentStep) {
    case 0: // Basic Info: require name, title and description
      return Boolean(formData.name?.trim() && formData.title?.trim() && formData.description?.trim());
    case 1: // Design: always valid since theme has a default value
      return true;
    case 2: // Campaign Details: require at least one non-empty survey question or an explainer video
      const hasValidSurveyQuestions = surveyQuestions?.length > 0 && surveyQuestions.some(q => q.question && q.question.trim());
      const hasExplainerVideo = formData.hasExplainerVideo && formData.explainerVideo;
      
      return Boolean(hasValidSurveyQuestions || hasExplainerVideo);
    case 3: // Response Settings: always valid
      return true;
    case 4: // Review: always valid since it's the last step
      return true;
    default:
      return false;
  }
}; 