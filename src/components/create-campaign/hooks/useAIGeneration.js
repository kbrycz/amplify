import { useState } from 'react';
import { SERVER_URL, auth } from '../../../lib/firebase';

export const useAIGeneration = (
  formData, 
  updateFormData, 
  setSurveyQuestions, 
  setAiGeneratedFields, 
  setIsAIModalOpen, 
  setCurrentStep
) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setAiError('');
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/generate-campaign`, {
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
      
      // For business fields, only mark as AI-generated if they contain content
      if (data.campaignData.businessName) newAiGeneratedFields.businessName = true;
      if (data.campaignData.website) newAiGeneratedFields.website = true;
      if (data.campaignData.email) newAiGeneratedFields.email = true;
      if (data.campaignData.phone) newAiGeneratedFields.phone = true;

      // Update survey questions from AI
      const newQuestions = data.campaignData.surveyQuestions.map((question, index) => ({
        id: index + 1,
        question,
      }));
      
      setSurveyQuestions(newQuestions);
      
      // Mark questions as AI generated
      data.campaignData.surveyQuestions.forEach((question, index) => {
        if (question.trim()) newAiGeneratedFields[`question_${index}`] = true;
      });
      
      setAiGeneratedFields(newAiGeneratedFields);
      setIsAIModalOpen(false);
      setAiPrompt('');
      
      // Move to the Design step after AI generation (now step 3 instead of 1)
      setCurrentStep(3);
    } catch (error) {
      console.error('Fetch error:', error);
      setAiError('Failed to connect to server. Please try again.');
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