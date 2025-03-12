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
    campaignName: '', 
    videoUploadError: null,
    videoUploadWarning: null
  });

  const handleSubmit = async (e, currentStep, totalSteps) => {
    e.preventDefault();
    
    // Only allow form submission from the last step (Review)
    if (currentStep !== totalSteps - 1) {
      console.log("Form submission prevented: Not on the last step");
      return;
    }
    
    setLoadingModal({ isOpen: true, status: 'loading', error: null });
    setIsSubmitting(true);

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
      surveyQuestions.some(q => q.question && q.question.trim());
    
    if (emptyFields.length > 0 || (!hasValidQuestions && !hasExplainerVideo)) {
      let errorMessage = 'Please fill in the following required fields: ';
      
      if (emptyFields.length > 0) {
        errorMessage += emptyFields.join(', ');
      }
      
      if (!hasValidQuestions && !hasExplainerVideo) {
        errorMessage += emptyFields.length > 0 ? ', and add at least one valid survey question or an explainer video' : 'Add at least one valid survey question or an explainer video';
      }
      
      setLoadingModal({ isOpen: true, status: 'error', error: errorMessage });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Update loading modal to show campaign creation step
      setLoadingModal(prev => ({ 
        ...prev, 
        status: 'loading', 
        message: 'Creating campaign...' 
      }));
      
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
      
      // Create campaign data without the explainer video
      const campaignData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        category: category,
        theme: selectedTheme,
        customColors: customColors ? JSON.stringify(customColors) : '',
        campaignImage: previewImage,
        subcategory: subcategory,
        surveyQuestions: JSON.stringify(surveyQuestions.map(q => q.question)),
        hasExplainerVideo: hasExplainerVideo
      };
      
      // STEP 1: Create the campaign without the large video
      console.log('Step 1: Creating campaign without large video');
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(errorData.message || `Failed to create campaign. Server returned ${response.status}`);
      }

      const campaign = await response.json().catch(() => {
        throw new Error('Failed to parse campaign data from server');
      });
      
      console.log('Campaign created successfully:', campaign.id);
      
      // STEP 2 & 3: Upload explainer video if present
      if (hasExplainerVideo && explainerVideo) {
        try {
          // Update loading modal to show video upload step
          setLoadingModal(prev => ({ 
            ...prev, 
            status: 'loading', 
            message: 'Uploading explainer video...' 
          }));
          
          console.log('Step 2: Getting signed URL for video upload');
          // STEP 2: Get the signed URL for uploading the video
          const urlResponse = await fetch(`${SERVER_URL}/campaign/campaigns/${campaign.id}/explainer-upload-url`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          
          if (!urlResponse.ok) {
            console.error(`Failed to get upload URL for explainer video. Server returned ${urlResponse.status}`);
            throw new Error(`Failed to get upload URL for video. Server returned ${urlResponse.status}`);
          }
          
          const { uploadUrl, filePath } = await urlResponse.json();
          
          if (!uploadUrl) {
            throw new Error('No valid upload URL received from server');
          }
          
          console.log('Received signed URL for video upload');
          
          // STEP 3: Convert video to blob and upload directly to Cloud Storage
          console.log('Step 3: Uploading video directly to Cloud Storage');
          
          // Convert data URL to blob
          let blob;
          if (explainerVideo.startsWith('data:')) {
            // For data URLs
            blob = await fetch(explainerVideo).then(r => r.blob());
          } else {
            // Fallback if it's just base64 content
            const base64Data = explainerVideo.split(',')[1] || explainerVideo;
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512);
              
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            
            blob = new Blob(byteArrays, { type: 'video/mp4' });
          }
          
          // Upload the video directly to the signed URL
          console.log('Uploading video to signed URL...');
          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'video/mp4'
            },
            body: blob
          });
          
          if (!uploadResponse.ok) {
            console.error(`Failed to upload explainer video. Status: ${uploadResponse.status}`);
            throw new Error(`Failed to upload video. Status: ${uploadResponse.status}`);
          }
          
          console.log('Explainer video uploaded successfully');
          
        } catch (videoError) {
          console.error('Error in video upload process:', videoError);
          // Show warning but don't fail the whole campaign creation
          setLoadingModal(prev => ({ 
            ...prev, 
            videoUploadError: `Video upload failed: ${videoError.message}. You can upload it later from the campaign settings.` 
          }));
        }
      }

      // Clear form cache after successful submission
      clearFormCache();

      // Show success message
      setLoadingModal({ 
        isOpen: true, 
        status: 'success', 
        error: null,
        campaignId: campaign.id,
        campaignName: formData.title,
        // Include any video upload error as a warning
        videoUploadWarning: loadingModal.videoUploadError
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