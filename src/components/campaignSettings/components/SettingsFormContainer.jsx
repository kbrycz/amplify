import React, { useState, useEffect } from 'react';
import { BasicSettingsCard } from '../steps/BasicSettingsCard';
import { DesignSettingsCard } from '../steps/DesignSettingsCard';
import { CampaignDetailsSettingsCard } from '../steps/CampaignDetailsSettingsCard';
import { ResponseSettingsCard } from '../steps/ResponseSettingsCard';
import { ReviewSettings } from '../steps/ReviewSettings';
import { SettingsStepNavigation } from '../navigation/SettingsStepNavigation';
import { ErrorMessage } from '../../ui/error-message';
import { ConfirmationModal } from '../../ui/confirmation-modal';
import { HelpModal } from '../../create-campaign/modals/HelpModal';

export const SettingsFormContainer = ({
  formData,
  setFormData,
  surveyQuestions,
  setSurveyQuestions,
  previewImage,
  setPreviewImage,
  selectedTheme,
  setSelectedTheme,
  themes,
  hasExplainerVideo,
  setHasExplainerVideo,
  explainerVideo,
  setExplainerVideo,
  currentStep,
  setCurrentStep,
  isSubmitting,
  isSavingDraft,
  error,
  setError,
  handleSubmit,
  handleDelete,
  currentNamespace,
  userPermission,
  campaignId,
  gradientColors,
  setGradientColors,
  gradientDirection,
  setGradientDirection,
  hexText,
  setHexText
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Validate form based on current step
  useEffect(() => {
    let valid = true;
    
    if (currentStep === 1) {
      // Basic settings validation
      valid = !!formData.name && !!formData.title;
    } else if (currentStep === 2) {
      // Design settings validation
      valid = !!selectedTheme;
    } else if (currentStep === 3) {
      // Campaign details validation
      if (surveyQuestions.length > 0) {
        valid = surveyQuestions.every(q => !!q.question && q.question.trim() !== '');
      }
      if (hasExplainerVideo) {
        valid = valid && !!explainerVideo;
      }
    } else if (currentStep === 4) {
      // Response settings validation
      valid = !!formData.businessName && !!formData.email;
    }
    
    setIsFormValid(valid);
  }, [currentStep, formData, selectedTheme, surveyQuestions, hasExplainerVideo, explainerVideo]);

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle survey question changes
  const handleQuestionChange = (id, value) => {
    setSurveyQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, question: value } : q)
    );
  };

  // Add a new survey question
  const addQuestion = () => {
    if (surveyQuestions.length < 3) {
      setSurveyQuestions(prev => [
        ...prev, 
        { id: Date.now().toString(), question: '' }
      ]);
    }
  };

  // Remove a survey question
  const removeQuestion = (id) => {
    setSurveyQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setPreviewImage(null);
  };

  // Handle video upload
  const handleVideoUpload = (file) => {
    if (file) {
      setExplainerVideo(file);
    }
  };

  // Remove uploaded video
  const removeVideo = () => {
    setExplainerVideo(null);
  };

  // Handle video URL input
  const handleVideoUrlChange = (url) => {
    setExplainerVideo(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && (
        <div className="mb-4">
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
            duration={5000} 
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          {currentStep === 1 && (
            <BasicSettingsCard
              formData={formData}
              handleInputChange={handleInputChange}
              previewImage={previewImage}
              handleImageChange={handleImageUpload}
              handleRemoveImage={removeImage}
            />
          )}

          {currentStep === 2 && (
            <DesignSettingsCard
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              gradientColors={gradientColors}
              setGradientColors={setGradientColors}
              gradientDirection={gradientDirection}
              setGradientDirection={setGradientDirection}
              hexText={hexText}
              setHexText={setHexText}
              themes={themes}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {currentStep === 3 && (
            <CampaignDetailsSettingsCard
              formData={formData}
              handleInputChange={handleInputChange}
              surveyQuestions={surveyQuestions}
              handleQuestionChange={handleQuestionChange}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
              hasExplainerVideo={hasExplainerVideo}
              setHasExplainerVideo={setHasExplainerVideo}
              explainerVideo={explainerVideo}
              handleVideoUpload={handleVideoUpload}
              removeVideo={removeVideo}
              handleVideoUrlChange={handleVideoUrlChange}
              setIsHelpOpen={setIsHelpOpen}
            />
          )}

          {currentStep === 4 && (
            <ResponseSettingsCard
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 5 && (
            <ReviewSettings
              formData={formData}
              surveyQuestions={surveyQuestions}
              previewImage={previewImage}
              selectedTheme={selectedTheme}
              themes={themes}
              hasExplainerVideo={hasExplainerVideo}
              explainerVideo={explainerVideo}
              currentNamespace={currentNamespace}
              userPermission={userPermission}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
            />
          )}
        </div>

        <SettingsStepNavigation
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          isSavingDraft={isSavingDraft}
          handleSubmit={handleSubmit}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          totalSteps={5}
        />
      </div>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            handleDelete(campaignId);
            setIsDeleteModalOpen(false);
          }}
          title="Delete Campaign"
          message={`Are you sure you want to delete this campaign? This action cannot be undone and will permanently remove all associated data.`}
          confirmButtonText="Delete Campaign"
          confirmButtonVariant="destructive"
        />
      )}

      {isHelpOpen && (
        <HelpModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />
      )}
    </div>
  );
}; 