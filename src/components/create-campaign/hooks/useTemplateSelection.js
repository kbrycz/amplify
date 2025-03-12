import { useState } from 'react';

export const useTemplateSelection = (
  formData,
  updateFormData,
  setSelectedTheme,
  setGradientColors,
  setGradientDirection,
  setHexText,
  setPreviewImage,
  setSurveyQuestions,
  setCurrentStep,
  setError
) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleUseTemplate = () => {
    setIsTemplateModalOpen(true);
  };
  
  const clearSelectedTemplate = () => {
    setSelectedTemplate(null);
    setError({
      type: 'info',
      message: 'Template removed. You can now create a campaign from scratch.',
      icon: 'info'
    });
    setTimeout(() => setError(null), 3000);
  };

  const handleSelectTemplate = (campaignData) => {
    // Keep the current name (or empty string) but copy everything else
    const currentName = formData.name;
    
    updateFormData({
      name: currentName, // Keep the current name
      title: campaignData.title || '',
      description: campaignData.description || '',
      category: campaignData.category || '',
      subcategory: campaignData.subcategory || '',
      businessName: campaignData.businessName || '',
      website: campaignData.website || '',
      email: campaignData.email || '',
      phone: campaignData.phone || ''
    });
    
    // Set theme if available
    if (campaignData.theme) {
      setSelectedTheme(campaignData.theme);
    }
    
    // Set custom colors if available
    if (campaignData.customColors) {
      setGradientColors(campaignData.customColors.gradientColors || {
        from: '#1a365d',
        via: '#3182ce',
        to: '#2c5282'
      });
      setGradientDirection(campaignData.customColors.gradientDirection || 'br');
      setHexText(campaignData.customColors.textColor || '#ffffff');
    }
    
    // Set campaign image if available
    if (campaignData.campaignImage) {
      setPreviewImage(campaignData.campaignImage);
    }
    
    // Set survey questions if available
    if (campaignData.surveyQuestions && Array.isArray(campaignData.surveyQuestions)) {
      setSurveyQuestions(campaignData.surveyQuestions.map((question, index) => ({
        id: index + 1,
        question
      })));
    }
    
    // Store the selected template info
    setSelectedTemplate({
      id: campaignData.id,
      title: campaignData.title || 'Untitled Campaign'
    });
    
    // Show a success message with the template name
    setError({
      type: 'success',
      message: `Template "${campaignData.title || 'Untitled Campaign'}" applied successfully!`,
      icon: 'check'
    });
    setTimeout(() => setError(null), 3000);
  };

  return {
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    handleUseTemplate,
    handleSelectTemplate,
    clearSelectedTemplate,
    selectedTemplate
  };
}; 