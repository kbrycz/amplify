import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardContent } from '../components/ui/card'; 
import { PhonePreview } from '../components/create-campaign/preview/PhonePreview';
import { LoadingModal } from '../components/create-campaign/modals/loading-modal';
import { AIModal } from '../components/create-campaign/modals/AIModal';
import { HelpModal } from '../components/create-campaign/modals/HelpModal';
import { CampaignTemplateModal } from '../components/create-campaign/modals/CampaignTemplateModal';
import { DraftSection } from '../components/create-campaign/components/DraftSection';
import { CampaignFormContainer } from '../components/create-campaign/components/CampaignFormContainer';
import { themes } from '../components/create-campaign/utils/campaignThemes';
import { steps } from '../components/create-campaign/utils/campaignSteps';
import { useCampaignForm } from '../components/create-campaign/hooks/useCampaignForm';
import { useCampaignDrafts } from '../components/create-campaign/hooks/useCampaignDrafts';
import { useAIGeneration } from '../components/create-campaign/hooks/useAIGeneration';
import { useCampaignSubmit } from '../components/create-campaign/hooks/useCampaignSubmit';
import { useTemplateSelection } from '../components/create-campaign/hooks/useTemplateSelection';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  // Use the form hook
  const form = useCampaignForm();
  
  // Use the drafts hook
  const drafts = useCampaignDrafts(
    form.formData,
    form.updateFormData,
    form.clearFormCache,
    form.surveyQuestions,
    form.setSurveyQuestions,
    form.setAiGeneratedFields,
    form.selectedTheme,
    form.gradientColors,
    form.gradientDirection,
    form.hexText,
    form.previewImage,
    form.hasExplainerVideo,
    form.explainerVideo,
    form.setCurrentStep,
    setIsDraftsOpen
  );
  
  // Use the AI generation hook
  const ai = useAIGeneration(
    form.formData,
    form.updateFormData,
    form.setSurveyQuestions,
    form.setAiGeneratedFields,
    setIsAIModalOpen,
    form.setCurrentStep
  );
  
  // Use the campaign submission hook
  const submit = useCampaignSubmit(
    form.formData,
    form.surveyQuestions,
    form.selectedTheme,
    form.gradientColors,
    form.gradientDirection,
    form.hexText,
    form.previewImage,
    form.hasExplainerVideo,
    form.explainerVideo,
    form.clearFormCache,
    form.resetForm
  );
  
  // Use the template selection hook
  const template = useTemplateSelection(
    form.formData,
    form.updateFormData,
    form.setSelectedTheme,
    form.setGradientColors,
    form.setGradientDirection,
    form.setHexText,
    form.setPreviewImage,
    form.setSurveyQuestions,
    form.setCurrentStep,
    drafts.setError
  );
  
  // Wrap the handleImageChange to pass setError
  const handleImageChange = (e) => form.handleImageChange(e, drafts.setError);

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Campaign</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Set up your campaign details and customize your survey questions.
          </p>
          <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4">
            <div
              className="absolute inset-y-0 left-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
              style={{ width: `${((form.currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <DraftSection
          drafts={drafts.drafts}
          isLoadingDrafts={drafts.isLoadingDrafts}
          isDraftsOpen={isDraftsOpen}
          setIsDraftsOpen={setIsDraftsOpen}
          handleLoadDraft={drafts.handleLoadDraft}
          handleDeleteDraft={drafts.handleDeleteDraft}
          selectedDraftId={drafts.selectedDraftId}
          setSelectedDraftId={drafts.setSelectedDraftId}
          setIsEditingDraft={drafts.setIsEditingDraft}
          isDeletingDraft={drafts.isDeletingDraft}
          deleteMessage={drafts.deleteMessage}
        />

        <div className={`grid grid-cols-1 ${form.showPreview ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start ${!form.showPreview ? 'w-full' : ''}`}>
          <CampaignFormContainer
            currentStep={form.currentStep}
            formData={form.formData}
            handleInputChange={form.handleInputChange}
            updateFormData={form.updateFormData}
            aiGeneratedFields={form.aiGeneratedFields}
            surveyQuestions={form.surveyQuestions}
            setSurveyQuestions={form.setSurveyQuestions}
            handleNext={form.handleNext}
            handlePrevious={form.handlePrevious}
            handleSubmit={submit.handleSubmit}
            isSubmitting={submit.isSubmitting}
            isSavingDraft={drafts.isSavingDraft}
            handleSaveDraft={drafts.handleSaveDraft}
            isEditingDraft={drafts.isEditingDraft}
            setIsAIModalOpen={setIsAIModalOpen}
            handleUseTemplate={template.handleUseTemplate}
            selectedTheme={form.selectedTheme}
            setSelectedTheme={form.setSelectedTheme}
            gradientColors={form.gradientColors}
            setGradientColors={form.setGradientColors}
            gradientDirection={form.gradientDirection}
            setGradientDirection={form.setGradientDirection}
            hexText={form.hexText}
            setHexText={form.setHexText}
            themes={themes}
            previewImage={form.previewImage}
            handleImageChange={handleImageChange}
            handleRemoveImage={form.handleRemoveImage}
            setIsHelpOpen={setIsHelpOpen}
            hasExplainerVideo={form.hasExplainerVideo}
            setHasExplainerVideo={form.setHasExplainerVideo}
            explainerVideo={form.explainerVideo}
            setExplainerVideo={form.setExplainerVideo}
            error={drafts.error}
          />

          <PhonePreview
            selectedTheme={form.selectedTheme}
            themes={themes}
            previewImage={form.previewImage}
            formData={form.formData}
            surveyQuestions={form.surveyQuestions}
            currentStep={form.currentStep}
            gradientColors={form.gradientColors}
            gradientDirection={form.gradientDirection}
            hexText={form.hexText}
            hasExplainerVideo={form.hasExplainerVideo}
            explainerVideo={form.explainerVideo}
          />
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Shout. All rights reserved.
      </div>
      
      <LoadingModal
        isOpen={submit.loadingModal.isOpen}
        status={submit.loadingModal.status}
        error={submit.loadingModal.error}
        campaignId={submit.loadingModal.campaignId}
        campaignName={submit.loadingModal.campaignName}
        message={submit.loadingModal.message}
        videoUploadError={submit.loadingModal.videoUploadError}
        videoUploadWarning={submit.loadingModal.videoUploadWarning}
        onClose={() => submit.setLoadingModal({ ...submit.loadingModal, isOpen: false })}
      />

      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        aiPrompt={ai.aiPrompt}
        setAiPrompt={ai.setAiPrompt}
        handleAIGenerate={ai.handleAIGenerate}
        isGenerating={ai.isGenerating}
        aiError={ai.aiError}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <CampaignTemplateModal
        isOpen={template.isTemplateModalOpen}
        onClose={() => template.setIsTemplateModalOpen(false)}
        onSelectTemplate={template.handleSelectTemplate}
      />
    </div>
  );
}