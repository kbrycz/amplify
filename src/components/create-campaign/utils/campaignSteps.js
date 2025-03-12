export const steps = [
  { name: 'Internal Name' },
  { name: 'Category' },
  { name: 'Template' },
  { name: 'Design' },
  { name: 'Campaign Info' },
  { name: 'Campaign Details' },
  { name: 'Review' }
];

// Validation for each step
export const isStepValid = (currentStep, formData, surveyQuestions) => {
  switch (currentStep) {
    case 0: // Internal Name: always valid since we want to allow saving drafts
      return Boolean(formData.name?.trim());
    case 1: // Category: require a category selection
      return Boolean(formData.category);
    case 2: // Template: require a subcategory selection (or skip if category is 'other')
      return formData.category === 'other' || Boolean(formData.subcategory);
    case 3: // Design: always valid since theme has a default value
      return true; // Theme selection is always valid since it has a default value
    case 4: // Basic Info: require title and description
      return Boolean(formData.title?.trim() && formData.description?.trim());
    case 5: // Campaign Details: require category (and subcategory if political) and at least one non-empty survey question
      return Boolean(
        formData.category &&
        (formData.category === 'political' ? formData.subcategory?.trim() : true) &&
        surveyQuestions?.length > 0 &&
        surveyQuestions.every(q => q.question.trim())
      );
    case 6: // Review: always valid since it's the last step
      return true;
    default:
      return false;
  }
}; 