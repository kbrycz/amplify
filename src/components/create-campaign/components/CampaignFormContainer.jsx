import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { InternalName } from '../steps/InternalName';
import { CategorySelection } from '../steps/CategorySelection';
import { SubcategorySelection } from '../steps/SubcategorySelection';
import { DesignPage } from '../steps/DesignPage';
import { BasicInfo } from '../steps/BasicInfo';
import { CampaignDetails } from '../steps/CampaignDetails';
import { ReviewCampaign } from '../steps/ReviewCampaign';
import { StepNavigation } from '../navigation/StepNavigation';
import { ErrorMessage } from './ErrorMessage';
import { Building, Info, Users, Shield } from 'lucide-react';

export const CampaignFormContainer = ({
  currentStep,
  formData,
  handleInputChange,
  updateFormData,
  aiGeneratedFields,
  surveyQuestions,
  setSurveyQuestions,
  handleNext,
  handlePrevious,
  handleSubmit,
  isSubmitting,
  isSavingDraft,
  handleSaveDraft,
  isEditingDraft,
  setIsAIModalOpen,
  handleUseTemplate,
  clearSelectedTemplate,
  selectedTemplate,
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
  userPermission
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
        {/* Only display namespace information on the review page (step 6) */}
        
        <form onSubmit={(e) => {
          // Only allow form submission from the last step (Review)
          if (currentStep !== 6) { // 6 is the last step index
            e.preventDefault();
            return;
          }
          handleSubmit(e, currentStep, 7); // 7 is the total number of steps
        }} className="space-y-8">
          {currentStep === 0 && (
            <InternalName
              formData={formData}
              handleInputChange={handleInputChange}
              aiGeneratedFields={aiGeneratedFields}
            />
          )}

          {currentStep === 1 && (
            <CategorySelection
              formData={formData}
              setFormData={updateFormData}
              handleNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <SubcategorySelection
              formData={formData}
              setFormData={(newData) => {
                console.log('SubcategorySelection setFormData called with:', newData);
                
                // Handle both regular form data updates and survey question updates
                if (newData.surveyQuestions) {
                  console.log('Setting survey questions:', newData.surveyQuestions);
                  // First set the survey questions
                  setSurveyQuestions(newData.surveyQuestions);
                  
                  // Then update the form data without the survey questions
                  const { surveyQuestions: _, ...rest } = newData;
                  updateFormData(prev => ({ ...prev, ...rest }));
                } else {
                  console.log('Updating form data without survey questions');
                  updateFormData(prev => ({ ...prev, ...newData }));
                }
                
                // Force a re-render of the StepNavigation component to update button text
                setTimeout(() => {
                  console.log('Forcing re-render after subcategory update');
                }, 0);
              }}
              handleNext={() => {
                // If no subcategory is selected, set it to 'custom' before proceeding
                if (!formData.subcategory) {
                  updateFormData(prev => ({
                    ...prev,
                    subcategory: 'custom'
                  }));
                }
                handleNext();
              }}
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
            />
          )}

          {currentStep === 4 && (
            <BasicInfo
              formData={formData}
              handleInputChange={handleInputChange}
              previewImage={previewImage}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              aiGeneratedFields={aiGeneratedFields}
            />
          )}

          {currentStep === 5 && (
            <CampaignDetails
              formData={formData}
              handleInputChange={handleInputChange}
              surveyQuestions={surveyQuestions}
              handleAddQuestion={() => {
                // Limit to a maximum of 3 questions
                if (surveyQuestions.length >= 3) {
                  return;
                }
                
                setSurveyQuestions([
                  ...surveyQuestions,
                  { id: surveyQuestions.length + 1, question: '' }
                ]);
              }}
              handleRemoveQuestion={(id) => {
                setSurveyQuestions(surveyQuestions.filter(q => q.id !== id));
              }}
              handleQuestionChange={(id, value) => {
                // Check if this question was AI generated
                const questionIndex = surveyQuestions.findIndex(q => q.id === id);
                const fieldName = `question_${questionIndex}`;
                
                setSurveyQuestions(
                  surveyQuestions.map(q => q.id === id ? { ...q, question: value } : q)
                );
              }}
              setIsHelpOpen={setIsHelpOpen}
              aiGeneratedFields={aiGeneratedFields}
              hasExplainerVideo={hasExplainerVideo}
              setHasExplainerVideo={setHasExplainerVideo}
              explainerVideo={explainerVideo}
              setExplainerVideo={setExplainerVideo}
            />
          )}

          {currentStep === 6 && (
            <ReviewCampaign
              formData={formData}
              handleInputChange={handleInputChange}
              aiGeneratedFields={aiGeneratedFields}
              surveyQuestions={surveyQuestions}
              previewImage={previewImage}
              selectedTheme={selectedTheme}
              themes={themes}
              hasExplainerVideo={hasExplainerVideo}
              explainerVideo={explainerVideo}
              currentNamespace={currentNamespace}
              userPermission={userPermission}
            />
          )}

          <div className="mt-8">
            <ErrorMessage error={error} />

            <StepNavigation
              currentStep={currentStep}
              totalSteps={7}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isSubmitting={isSubmitting}
              isSavingDraft={isSavingDraft}
              handleSaveDraft={handleSaveDraft}
              isEditingDraft={isEditingDraft}
              formData={{
                ...formData,
                hasExplainerVideo,
                explainerVideo
              }}
              surveyQuestions={surveyQuestions}
              setIsAIModalOpen={setIsAIModalOpen}
              onUseTemplate={handleUseTemplate}
              clearSelectedTemplate={clearSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 