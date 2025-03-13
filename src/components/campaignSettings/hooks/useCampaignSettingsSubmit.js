import { useState } from 'react';
import { SERVER_URL, auth } from '../../../lib/firebase';

export const useCampaignSettingsSubmit = (
  campaignId,
  formData,
  surveyQuestions,
  selectedTheme,
  gradientColors,
  gradientDirection,
  hexText,
  previewImage,
  hasExplainerVideo,
  explainerVideo,
  currentNamespaceId,
  setError,
  setSuccessMessage,
  fetchCampaign
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingModal, setLoadingModal] = useState({
    isOpen: false,
    status: 'loading', // 'loading', 'success', 'error'
    error: null,
    message: '',
    campaignId: null,
    campaignName: ''
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage('');
      
      // Open the loading modal
      setLoadingModal({
        isOpen: true,
        status: 'loading',
        error: null,
        message: 'Updating campaign settings...',
        campaignId: campaignId,
        campaignName: formData.name
      });
      
      // Prepare the survey questions in the format expected by the API
      const formattedQuestions = surveyQuestions.map(q => q.question);
      
      // Prepare the custom colors data
      const customColors = {
        gradientColors,
        gradientDirection,
        hexText
      };
      
      // Prepare the update data
      const updateData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        theme: selectedTheme,
        surveyQuestions: formattedQuestions,
        customColors: JSON.stringify(customColors),
        hasExplainerVideo: hasExplainerVideo,
        explainerVideo: explainerVideo,
        businessName: formData.businessName,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        namespaceId: currentNamespaceId
      };
      
      // Send the update request
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaigns/${campaignId}?namespaceId=${currentNamespaceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update campaign');
      }
      
      // Update was successful
      setLoadingModal({
        isOpen: true,
        status: 'success',
        error: null,
        message: 'Campaign settings updated successfully!',
        campaignId: campaignId,
        campaignName: formData.name
      });
      
      setSuccessMessage('Campaign settings updated successfully');
      
      // Refresh the campaign data
      fetchCampaign();
    } catch (err) {
      console.error('Error updating campaign settings:', err);
      setError(err.message);
      
      setLoadingModal({
        isOpen: true,
        status: 'error',
        error: err.message,
        message: 'Failed to update campaign settings',
        campaignId: campaignId,
        campaignName: formData.name
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    loadingModal,
    setLoadingModal
  };
}; 