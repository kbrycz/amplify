import { useState } from 'react';
import { SERVER_URL, auth } from '../../../lib/firebase';

export const useAIGeneration = (
  formData, 
  updateFormData, 
  setSurveyQuestions, 
  setAiGeneratedFields, 
  setIsAIModalOpen, 
  setCurrentStep,
  namespaceId
) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    if (!namespaceId) {
      setAiError('No namespace selected. Please select a namespace before generating AI content.');
      return;
    }

    setIsGenerating(true);
    setAiError('');
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/generate-campaign?namespaceId=${namespaceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json();

      if (data.status === 'error') {
        setAiError(data.message || 'Failed to generate campaign');
        return;
      }

      // Update form data with AI generated content
      updateFormData({
        ...formData,
        title: data.campaignData.title || data.campaignData.name,
        description: data.campaignData.description,
        category: data.campaignData.category,
        subcategory: data.campaignData.subcategory,
        businessName: data.campaignData.businessName,
        website: data.campaignData.website,
        email: data.campaignData.email,
        phone: data.campaignData.phone,
      });

      // Set which fields were AI generated - only mark fields that actually have values
      const newAiGeneratedFields = {};
      
      // Only mark fields as AI-generated if they actually contain content
      if (data.campaignData.title || data.campaignData.name) newAiGeneratedFields.title = true;
      if (data.campaignData.description) newAiGeneratedFields.description = true;
      if (data.campaignData.category) newAiGeneratedFields.category = true;
      if (data.campaignData.subcategory) newAiGeneratedFields.subcategory = true;
      if (data.campaignData.businessName) newAiGeneratedFields.businessName = true;
      if (data.campaignData.website) newAiGeneratedFields.website = true;
      if (data.campaignData.email) newAiGeneratedFields.email = true;
      if (data.campaignData.phone) newAiGeneratedFields.phone = true;
      
      setAiGeneratedFields(newAiGeneratedFields);
      
      // Set survey questions if provided
      if (data.campaignData.surveyQuestions && data.campaignData.surveyQuestions.length > 0) {
        const formattedQuestions = data.campaignData.surveyQuestions.map((question, index) => ({
          id: index + 1,
          question: question
        }));
        
        setSurveyQuestions(formattedQuestions);
        
        // Mark survey questions as AI-generated
        formattedQuestions.forEach((_, index) => {
          newAiGeneratedFields[`question_${index}`] = true;
        });
        
        setAiGeneratedFields(newAiGeneratedFields);
      }
      
      // Close the AI modal
      setIsAIModalOpen(false);
      
      // Move to the next step if we're on the first step
      if (formData.name) {
        setCurrentStep(1); // Move to category selection
      }
    } catch (error) {
      console.error('Error generating campaign with AI:', error);
      setAiError('Failed to generate campaign. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    aiPrompt,
    setAiPrompt,
    isGenerating,
    aiError,
    handleAIGenerate
  };
}; 