import { useState } from 'react';
import { SERVER_URL, auth } from '../../../lib/firebase';
import { CATEGORIES } from '../../../lib/categoryEnums';
import { isValidCategory, isValidSubcategory } from '../../../lib/categoryEnums';

export const useCampaignSubmit = (
  formData,
  surveyQuestions,
  selectedTheme,
  gradientColors,
  gradientDirection,
  hexText,
  previewImage,
  hasExplainerVideo,
  explainerVideo,
  clearFormCache,
  resetForm
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingModal, setLoadingModal] = useState({ 
    isOpen: false, 
    status: 'loading', 
    error: null, 
    campaignId: null, 
    campaignName: '' 
  });

  const handleSubmit = async (e, currentStep, totalSteps) => {
    e.preventDefault();
    
    // Only allow form submission from the last step (Review)
    if (currentStep !== totalSteps - 1) {
      console.log("Form submission prevented: Not on the last step");
      return;
    }
    
    setLoadingModal({ isOpen: true, status: 'loading', error: null });

    // Validate required fields
    const requiredFields = {
      'Campaign Name': formData.name,
      'Campaign Title': formData.title,
      'Campaign Description': formData.description,
      'Campaign Category': formData.category
    };
    
    // Add subcategory validation if category is political
    if (formData.category === CATEGORIES.POLITICAL) {
      requiredFields['Representative Level'] = formData.subcategory;
    }
    
    // Check for empty required fields
    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || !value.trim())
      .map(([field]) => field);
    
    // Validate survey questions
    const hasValidQuestions = surveyQuestions.length > 0 && 
      surveyQuestions.every(q => q.question && q.question.trim());
    
    if (emptyFields.length > 0 || !hasValidQuestions) {
      let errorMessage = 'Please fill in the following required fields: ';
      
      if (emptyFields.length > 0) {
        errorMessage += emptyFields.join(', ');
      }
      
      if (!hasValidQuestions) {
        errorMessage += emptyFields.length > 0 ? ', and add at least one valid survey question' : 'Add at least one valid survey question';
      }
      
      setLoadingModal({ isOpen: true, status: 'error', error: errorMessage });
      return;
    }
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      
      // Get custom colors if the theme is 'custom'
      const customColors = selectedTheme === 'custom' ? {
        gradientColors,
        gradientDirection,
        textColor: hexText
      } : null;
      
      // Validate category and subcategory
      const category = formData.category;
      let subcategory = formData.subcategory;
      
      if (!isValidCategory(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      // If subcategory is provided, validate it
      if (subcategory && !isValidSubcategory(category, subcategory)) {
        console.warn(`Invalid subcategory ${subcategory} for category ${category}, defaulting to null`);
        subcategory = null;
      }
      
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          title: formData.title,
          description: formData.description,
          category: category,
          theme: selectedTheme,
          customColors: customColors,
          campaignImage: previewImage,
          subcategory: subcategory,
          surveyQuestions: surveyQuestions.map(q => q.question),
          hasExplainerVideo: hasExplainerVideo,
          explainerVideo: explainerVideo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create campaign. Please try again.');
      }

      // Clear form cache after successful submission
      clearFormCache();

      const campaign = await response.json();
      setLoadingModal({ 
        isOpen: true, 
        status: 'success', 
        error: null,
        campaignId: campaign.id,
        campaignName: formData.title
      });
      
      // Reset form state
      resetForm();
    } catch (err) {
      console.error('Error creating campaign:', err);
      setLoadingModal({ isOpen: true, status: 'error', error: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    loadingModal,
    setLoadingModal,
    handleSubmit
  };
}; 