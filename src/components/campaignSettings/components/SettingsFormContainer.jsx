import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';
import { AlertCircle } from 'lucide-react';
import { steps } from '../../create-campaign/utils/campaignSteps';
import { themes } from '../../create-campaign/utils/campaignThemes';
import { InternalName } from '../../create-campaign/steps/InternalName';
import { BasicInfo } from '../../create-campaign/steps/BasicInfo';
import { DesignPage } from '../../create-campaign/steps/DesignPage';
import { CampaignDetails } from '../../create-campaign/steps/CampaignDetails';
import { ReviewCampaign } from '../../create-campaign/steps/ReviewCampaign';
import { UpdateLoadingModal } from './UpdateLoadingModal';
import { post, put } from '../../../lib/api';
import { useToast } from '../../ui/toast-notification';
import { ErrorMessage } from '../../create-campaign/components/ErrorMessage';
import { StepNavigation } from '../../create-campaign/navigation/StepNavigation';

// Modified isStepValid function for settings flow (without category and subcategory steps)
const isStepValid = (currentStep, formData) => {
  switch (currentStep) {
    case 0: // Internal Name: always valid since we want to allow saving drafts
      return Boolean(formData.name?.trim());
    case 1: // Design: always valid since theme has a default value
      return true;
    case 2: // Basic Info: require name and description
      return Boolean(formData.title?.trim() && formData.description?.trim());
    case 3: // Campaign Details: require at least one non-empty survey question
      return Boolean(
        formData.surveyQuestions?.length > 0 &&
        formData.surveyQuestions.every(q => q.question.trim())
      );
    case 4: // Review: always valid
      return true;
    default:
      return false;
  }
};

// Map the original step indices to the new ones (skipping category and subcategory)
const mapStepIndex = (originalIndex) => {
  // Original steps: 0=Internal, 1=Category, 2=Subcategory, 3=Design, 4=BasicInfo, 5=Details, 6=Review
  // New steps: 0=Internal, 1=Design, 2=BasicInfo, 3=Details, 4=Review
  const mapping = {
    0: 0, // Internal Name -> Internal Name
    1: 1, // Category -> Design (skip)
    2: 1, // Subcategory -> Design (skip)
    3: 1, // Design -> Design
    4: 2, // BasicInfo -> BasicInfo
    5: 3, // Details -> Details
    6: 4  // Review -> Review
  };
  return mapping[originalIndex] || 0;
};

export function SettingsFormContainer({
  formData,
  updateFormData,
  clearFormCache,
  surveyQuestions,
  setSurveyQuestions,
  aiGeneratedFields,
  setAiGeneratedFields,
  previewImage,
  setPreviewImage,
  hasExplainerVideo,
  setHasExplainerVideo,
  explainerVideo,
  setExplainerVideo,
  selectedTheme,
  setSelectedTheme,
  gradientColors,
  setGradientColors,
  gradientDirection,
  setGradientDirection,
  hexText,
  setHexText,
  currentStep,
  setCurrentStep,
  handleInputChange,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  handleImageChange,
  handleRemoveImage,
  handleNext,
  handlePrevious,
  campaignId,
  namespaceId,
  readOnly = false
}) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loadingModal, setLoadingModal] = useState({
    isOpen: false,
    status: 'loading',
    error: null,
    campaignId: null,
    campaignName: '',
    message: 'Updating campaign...',
    videoUploadError: null,
    videoUploadWarning: null
  });

  // Total number of steps (reduced by 2 for category and subcategory)
  const totalSteps = 5; // Instead of 7
  
  // Map the current step to the new step index
  const mappedStep = mapStepIndex(currentStep);
  
  // Check if current step is valid
  const canProceed = isStepValid(mappedStep, { ...formData, surveyQuestions });
  
  // Check if we're on the first step
  const isFirstStep = mappedStep === 0;
  
  // Check if we're on the last step
  const isLastStep = mappedStep === totalSteps - 1;
  
  // Determine if the button should be disabled
  const isButtonDisabled = React.useMemo(() => {
    return isSubmitting || !canProceed;
  }, [isSubmitting, canProceed]);

  // Custom navigation handlers to skip category and subcategory steps
  const handleCustomNext = () => {
    if (currentStep === 0) {
      // Skip from Internal Name directly to Design (step 3)
      setCurrentStep(3);
    } else if (currentStep === 5) {
      // From Campaign Details, go to Review (step 6)
      setCurrentStep(6);
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCustomPrevious = () => {
    if (currentStep === 3) {
      // Skip from Design directly to Internal Name (step 0)
      setCurrentStep(0);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get the correct button text based on current state
  const getButtonText = () => {
    if (isSubmitting) {
      return isLastStep ? 'Updating...' : 'Next...';
    }
    
    if (isLastStep) {
      return 'Update Campaign';
    }
    
    return 'Next';
  };

  // Handle campaign update
  const handleUpdateCampaign = async () => {
    if (readOnly) {
      addToast('You do not have permission to update this campaign', 'error');
      return;
    }

    if (!campaignId) {
      addToast('Campaign ID is required', 'error');
      return;
    }

    if (!namespaceId) {
      addToast('Namespace ID is required', 'error');
      return;
    }

    setIsSubmitting(true);
    setLoadingModal({
      isOpen: true,
      status: 'loading',
      error: null,
      campaignId: campaignId,
      campaignName: formData.name,
      message: 'Updating campaign settings...',
      videoUploadError: null,
      videoUploadWarning: null
    });

    try {
      // Prepare campaign data for update
      const campaignData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        category: formData.category, // Keep original category
        subcategory: formData.subcategory, // Keep original subcategory
        businessName: formData.businessName,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        theme: selectedTheme,
        gradientColors: gradientColors,
        gradientDirection: gradientDirection,
        textColor: hexText,
        surveyQuestions: surveyQuestions.map(q => q.question),
        namespaceId: namespaceId
      };

      // Update campaign using PUT request to the correct endpoint
      const response = await put(`/campaign/campaigns/${campaignId}?namespaceId=${namespaceId}`, campaignData);

      if (response) {
        // Handle image upload if image has changed
        if (previewImage && previewImage.startsWith('data:')) {
          setLoadingModal(prev => ({
            ...prev,
            message: 'Uploading campaign image...'
          }));

          // Upload image
          const imageFormData = new FormData();
          const blob = await (await fetch(previewImage)).blob();
          imageFormData.append('image', blob, 'campaign-image.png');
          imageFormData.append('namespaceId', namespaceId);

          const imageResponse = await fetch(`/api/campaign/campaigns/${campaignId}/image`, {
            method: 'POST',
            body: imageFormData
          });

          if (!imageResponse.ok) {
            throw new Error('Failed to upload campaign image');
          }
        }

        // Handle video upload if video has changed
        if (hasExplainerVideo && explainerVideo && explainerVideo.startsWith('data:')) {
          setLoadingModal(prev => ({
            ...prev,
            message: 'Uploading explainer video...'
          }));

          // Upload video
          const videoFormData = new FormData();
          const blob = await (await fetch(explainerVideo)).blob();
          videoFormData.append('video', blob, 'explainer-video.mp4');
          videoFormData.append('namespaceId', namespaceId);

          const videoResponse = await fetch(`/api/campaign/campaigns/${campaignId}/video`, {
            method: 'POST',
            body: videoFormData
          });

          if (!videoResponse.ok) {
            throw new Error('Failed to upload explainer video');
          }
        }

        // Success
        setLoadingModal(prev => ({
          ...prev,
          status: 'success',
          message: 'Campaign updated successfully!'
        }));

        // Clear form cache
        clearFormCache();

        // Show success toast
        addToast('Campaign updated successfully!', 'success');

        // Remove the automatic redirection
        // Let the user close the modal and stay on the current page
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      setLoadingModal(prev => ({
        ...prev,
        status: 'error',
        error: error.message || 'Failed to update campaign'
      }));
      setError(error.message || 'Failed to update campaign');
      addToast(error.message || 'Failed to update campaign', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Placeholder for save draft functionality
  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      addToast('Draft saved successfully', 'success');
      setIsSavingDraft(false);
    }, 1000);
  };

  // Placeholder for template functionality
  const handleUseTemplate = () => {
    addToast('Template functionality is not available in settings mode', 'info');
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          // The form submission is now handled by the StepNavigation component
          // through the onSubmit prop, so we don't need to handle it here
        }}>
          {currentStep === 0 && (
            <InternalName
              formData={formData}
              handleInputChange={handleInputChange}
              aiGeneratedFields={aiGeneratedFields}
            />
          )}

          {currentStep === 3 && (
            <DesignPage
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              gradientColors={gradientColors}
              setGradientColors={setGradientColors}
              gradientDirection={gradientDirection}
              setGradientDirection={setGradientDirection}
              hexText={hexText}
              setHexText={setHexText}
              themes={themes}
              previewImage={previewImage}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              readOnly={readOnly}
            />
          )}

          {currentStep === 4 && (
            <BasicInfo
              formData={formData}
              handleInputChange={handleInputChange}
              aiGeneratedFields={aiGeneratedFields}
              readOnly={readOnly}
            />
          )}

          {currentStep === 5 && (
            <CampaignDetails
              formData={formData}
              handleInputChange={handleInputChange}
              surveyQuestions={surveyQuestions}
              handleAddQuestion={handleAddQuestion}
              handleRemoveQuestion={handleRemoveQuestion}
              handleQuestionChange={handleQuestionChange}
              aiGeneratedFields={aiGeneratedFields}
              hasExplainerVideo={hasExplainerVideo}
              setHasExplainerVideo={setHasExplainerVideo}
              explainerVideo={explainerVideo}
              setExplainerVideo={setExplainerVideo}
              readOnly={readOnly}
            />
          )}

          {currentStep === 6 && (
            <ReviewCampaign
              formData={formData}
              surveyQuestions={surveyQuestions}
              selectedTheme={selectedTheme}
              previewImage={previewImage}
              hasExplainerVideo={hasExplainerVideo}
              explainerVideo={explainerVideo}
              themes={themes}
              isUpdateMode={true}
              currentNamespace={namespaceId}
              userPermission={readOnly ? 'readonly' : 'read/write'}
              submitButtonText="Update Campaign"
            />
          )}

          <div className="mt-8">
            <ErrorMessage error={error} />

            <StepNavigation
              currentStep={mappedStep}
              totalSteps={totalSteps}
              onPrevious={handleCustomPrevious}
              onNext={handleCustomNext}
              isSubmitting={isSubmitting}
              isSavingDraft={isSavingDraft}
              handleSaveDraft={handleSaveDraft}
              isEditingDraft={false}
              formData={{
                ...formData,
                hasExplainerVideo,
                explainerVideo
              }}
              surveyQuestions={surveyQuestions}
              setIsAIModalOpen={setIsAIModalOpen}
              onUseTemplate={handleUseTemplate}
              submitButtonText="Update Campaign"
              onSubmit={handleUpdateCampaign}
            />
          </div>

          {readOnly && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Read-only mode</p>
                <p className="text-xs mt-1">You do not have permission to edit this campaign. Contact an administrator to request edit access.</p>
              </div>
            </div>
          )}
        </form>
      </CardContent>

      <UpdateLoadingModal
        isOpen={loadingModal.isOpen}
        status={loadingModal.status}
        error={loadingModal.error}
        campaignId={loadingModal.campaignId}
        campaignName={loadingModal.campaignName}
        message={loadingModal.message}
        videoUploadError={loadingModal.videoUploadError}
        videoUploadWarning={loadingModal.videoUploadWarning}
        onClose={() => setLoadingModal({ ...loadingModal, isOpen: false })}
      />
    </Card>
  );
} 