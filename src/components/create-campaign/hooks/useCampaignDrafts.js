import { useState, useEffect } from 'react';
import { SERVER_URL, auth } from '../../../lib/firebase';
import { CATEGORIES } from '../../../lib/categoryEnums';
import { isValidCategory, isValidSubcategory } from '../../../lib/categoryEnums';

export const useCampaignDrafts = (
  formData, 
  updateFormData, 
  clearFormCache, 
  surveyQuestions, 
  setSurveyQuestions,
  setAiGeneratedFields,
  selectedTheme,
  gradientColors,
  gradientDirection,
  hexText,
  previewImage,
  hasExplainerVideo,
  explainerVideo,
  setCurrentStep,
  setIsDraftsOpen,
  namespaceId
) => {
  const [drafts, setDrafts] = useState([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [error, setError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, [namespaceId]);

  const fetchDrafts = async () => {
    if (!namespaceId) {
      setIsLoadingDrafts(false);
      setDrafts([]);
      return;
    }
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/draftCampaign/drafts?namespaceId=${namespaceId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }

      const data = await response.json();
      setDrafts(data);
    } catch (err) {
      console.error('Error fetching drafts:', err);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.name.trim()) {
      setError('Please enter a campaign name to save as draft');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!namespaceId) {
      setError({
        type: 'error',
        message: 'No namespace selected. Please select a namespace before saving a draft.'
      });
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsSavingDraft(true);

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
      
      if (category && !isValidCategory(category)) {
        console.warn(`Invalid category: ${category}, defaulting to null`);
        category = null;
      }
      
      // If subcategory is provided, validate it
      if (subcategory && category && !isValidSubcategory(category, subcategory)) {
        console.warn(`Invalid subcategory ${subcategory} for category ${category}, defaulting to null`);
        subcategory = null;
      }
      
      const draftData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        category: category,
        theme: selectedTheme,
        customColors: customColors,
        campaignImage: previewImage,
        subcategory: subcategory,
        surveyQuestions: Array.isArray(surveyQuestions) 
          ? JSON.stringify(surveyQuestions.map(q => q.question)) 
          : JSON.stringify([]),
        hasExplainerVideo: hasExplainerVideo,
        explainerVideo: explainerVideo,
        namespaceId: namespaceId // Add namespace ID to draft data
      };

      const response = await fetch(isEditingDraft 
        ? `${SERVER_URL}/draftCampaign/drafts/${selectedDraftId}?namespaceId=${namespaceId}`
        : `${SERVER_URL}/draftCampaign/drafts?namespaceId=${namespaceId}`, {
        method: isEditingDraft ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(draftData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          throw new Error(errorData.error || 'You do not have permission to save drafts in this namespace.');
        } else {
          throw new Error(errorData.message || errorData.error || 'Failed to save draft');
        }
      }

      await fetchDrafts();
      clearFormCache(); // Clear the form cache on successful save
      
      setError({
        type: 'success',
        message: isEditingDraft ? 'Draft updated successfully!' : 'Draft saved successfully!'
      });
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Error saving draft:', err);
      
      // Create a more user-friendly error message
      let errorMessage = 'Unable to save draft at this time. Please try again later.';
      
      // Add more specific messages for common errors
      if (err.message.includes('permission')) {
        errorMessage = 'You don\'t have permission to save drafts in this namespace.';
      } else if (err.message.includes('network') || err.message.includes('offline')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError({
        type: 'error',
        message: errorMessage
      });
      
      // Automatically clear the error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleLoadDraft = async (draftId) => {
    try {
      setSelectedDraftId(draftId);
      setIsEditingDraft(true);
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/draftCampaign/drafts/${draftId}?namespaceId=${namespaceId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          throw new Error(errorData.error || 'You do not have permission to access this draft.');
        } else {
          throw new Error(errorData.error || 'Failed to load draft');
        }
      }

      const draft = await response.json();
      
      // Load the draft data, including any legacy business fields that might exist
      // but won't be included in future submissions
      updateFormData({
        name: draft.name || '',
        title: draft.title || '',
        description: draft.description || '',
        category: draft.category || '',
        subcategory: draft.subcategory || '',
        // Keep these fields for backward compatibility with existing drafts
        businessName: draft.businessName || '',
        website: draft.website || '',
        email: draft.email || '',
        phone: draft.phone || ''
      });
      
      // Load custom colors if available
      if (draft.customColors) {
        // These are passed as props, so we don't update them directly
        // setGradientColors(draft.customColors.gradientColors || {...});
        // setGradientDirection(draft.customColors.gradientDirection || 'br');
        // setHexText(draft.customColors.textColor || '#ffffff');
      }
      
      // Load explainer video if available
      if (draft.hasExplainerVideo) {
        // These are passed as props, so we don't update them directly
        // setHasExplainerVideo(true);
        // setExplainerVideo(draft.explainerVideo || null);
      }
      
      // Handle surveyQuestions which might be a string, array, or null
      let questions = [];
      if (draft.surveyQuestions) {
        if (typeof draft.surveyQuestions === 'string') {
          try {
            questions = JSON.parse(draft.surveyQuestions);
          } catch (e) {
            console.error('Error parsing surveyQuestions:', e);
            questions = [];
          }
        } else if (Array.isArray(draft.surveyQuestions)) {
          questions = draft.surveyQuestions;
        }
      }
      
      setSurveyQuestions(questions.map((question, index) => ({
        id: index + 1,
        question: typeof question === 'string' ? question : ''
      })));
      setIsDraftsOpen(false);
      
      // Clear AI indicators when loading a draft
      setAiGeneratedFields({});
      
      // Show success message
      setError({
        type: 'success',
        message: `Draft "${draft.name}" loaded successfully!`
      });
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Error loading draft:', err);
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteDraft = async (draftId) => {
    if (!draftId) return;
    
    setIsDeletingDraft(true);
    setDeleteMessage(null);

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/draftCampaign/drafts/${draftId}?namespaceId=${namespaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          throw new Error(errorData.error || 'You do not have permission to delete this draft. Admin access required.');
        } else {
          throw new Error(errorData.error || 'Failed to delete draft');
        }
      }

      await fetchDrafts();
      setIsDraftsOpen(false);
      setSelectedDraftId(null);
      
      setDeleteMessage({
        type: 'success',
        message: 'Draft deleted successfully!'
      });
      setTimeout(() => setDeleteMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting draft:', err);
      setDeleteMessage({
        type: 'error',
        message: err.message || 'Error deleting draft'
      });
    } finally {
      setIsDeletingDraft(false);
    }
  };

  return {
    drafts,
    isLoadingDrafts,
    selectedDraftId,
    setSelectedDraftId,
    isDeletingDraft,
    isEditingDraft,
    setIsEditingDraft,
    isSavingDraft,
    error,
    setError,
    deleteMessage,
    setDeleteMessage,
    fetchDrafts,
    handleSaveDraft,
    handleLoadDraft,
    handleDeleteDraft
  };
}; 