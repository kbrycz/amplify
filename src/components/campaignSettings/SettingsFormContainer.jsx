import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { BasicSettingsCard } from './steps/BasicSettingsCard';
import { DesignSettingsCard } from './steps/DesignSettingsCard';
import { CampaignDetailsSettingsCard } from './steps/CampaignDetailsSettingsCard';
import { ResponseSettingsCard } from './steps/ResponseSettingsCard';
import { ReviewSettings } from './steps/ReviewSettings';
import { SettingsStepNavigation } from './navigation/SettingsStepNavigation';
import { ErrorMessage } from '../create-campaign/components/ErrorMessage';

export const SettingsFormContainer = ({
  currentStep,
  formData,
  handleInputChange,
  updateFormData,
  surveyQuestions,
  setSurveyQuestions,
  handleNext,
  handlePrevious,
  handleSubmit,
  isSubmitting,
  selectedTheme,
  setSelectedTheme,
  gradientColors,
  setGradientColors,
  gradientDirection,
  setGradientDirection,
  hexText,
  setHexText,
  themes,
  previewImage,
  handleImageChange,
  handleRemoveImage,
  setIsHelpOpen,
  hasExplainerVideo,
  setHasExplainerVideo,
  explainerVideo,
  setExplainerVideo,
  error,
  currentNamespace,
  userPermission,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsDeleteModalOpen
}) => {
  // Helper function to display permission in a user-friendly way
  const formatPermission = (permission) => {
    if (!permission) return 'No Access';
    
    switch(permission) {
      case 'admin':
        return 'Admin (Full Access)';
      case 'read/write':
        return 'Editor (Read/Write)';
      case 'readonly':
        return 'Viewer (Read Only)';
      default:
        return permission;
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <form onSubmit={(e) => {
          // Only allow form submission from the last step (Review)
          if (currentStep !== 4) { // 4 is the last step index
            e.preventDefault();
            return;
          }
          handleSubmit(e);
        }} className="space-y-8">
          {currentStep === 0 && (
            <BasicSettingsCard
              formData={formData}
              handleInputChange={handleInputChange}
              previewImage={previewImage}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
            />
          )}

          {currentStep === 1 && (
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
            />
          )}

          {currentStep === 2 && (
            <CampaignDetailsSettingsCard
              formData={formData}
              handleInputChange={handleInputChange}
              surveyQuestions={surveyQuestions}
              handleAddQuestion={handleAddQuestion}
              handleRemoveQuestion={handleRemoveQuestion}
              handleQuestionChange={handleQuestionChange}
              setIsHelpOpen={setIsHelpOpen}
              hasExplainerVideo={hasExplainerVideo}
              setHasExplainerVideo={setHasExplainerVideo}
              explainerVideo={explainerVideo}
              setExplainerVideo={setExplainerVideo}
            />
          )}

          {currentStep === 3 && (
            <ResponseSettingsCard
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 4 && (
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

          <div className="mt-8">
            <ErrorMessage error={error} />

            <SettingsStepNavigation
              currentStep={currentStep}
              totalSteps={5}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isSubmitting={isSubmitting}
              formData={formData}
              surveyQuestions={surveyQuestions}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 