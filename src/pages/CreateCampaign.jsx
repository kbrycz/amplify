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
import { useNamespace } from '../context/NamespaceContext';
import { ReviewCampaign } from '../components/create-campaign/steps/ReviewCampaign';
import { LoadingSpinner } from '../components/ui/loading-spinner';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Get the current namespace from context
  const { namespaces, currentNamespace, isLoading: namespacesLoading, fetchUserNamespaces } = useNamespace();
  
  // Find the current namespace ID and user permission
  const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
  const currentNamespaceId = currentNamespaceObj?.id;
  
  // Get the user's permission for the current namespace
  const userPermission = currentNamespaceObj?.userPermission || null;
  
  // Ensure namespaces are loaded when the component mounts
  useEffect(() => {
    if (namespaces.length === 0 && !namespacesLoading) {
      fetchUserNamespaces();
    }
  }, []);
  
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
    setIsDraftsOpen,
    currentNamespaceId
  );
  
  // Use the AI generation hook
  const ai = useAIGeneration(
    form.formData,
    form.updateFormData,
    form.setSurveyQuestions,
    form.setAiGeneratedFields,
    setIsAIModalOpen,
    form.setCurrentStep,
    currentNamespaceId
  );
  
  // Use the campaign submission hook with namespace ID
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
    form.resetForm,
    currentNamespaceId
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
    drafts.setError,
    currentNamespaceId
  );
  
  // Wrap the handleImageChange to pass setError
  const handleImageChange = (e) => form.handleImageChange(e, drafts.setError);

  // Delay showing errors to prevent flashing
  useEffect(() => {
    if (drafts.error) {
      const timer = setTimeout(() => {
        setShowError(true);
      }, 500); // Delay showing error by 500ms
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [drafts.error]);

  // Mark when initial load is complete
  useEffect(() => {
    if (!namespacesLoading && !drafts.isLoadingDrafts) {
      setInitialLoadComplete(true);
    }
  }, [namespacesLoading, drafts.isLoadingDrafts]);

  // Check for namespace when component mounts or namespace changes
  useEffect(() => {
    // Only proceed if we're not still loading namespaces
    if (!namespacesLoading) {
      if (!currentNamespaceId && namespaces.length > 0) {
        // Only show error if namespaces are loaded but none is selected
        drafts.setError({
          type: 'error',
          message: 'No namespace selected. Please select a namespace to create campaigns.'
        });
      } else if (namespaces.length === 0) {
        // If no namespaces exist at all
        drafts.setError({
          type: 'error',
          message: 'No namespaces available. Please create a namespace first.'
        });
      } else if (currentNamespaceId) {
        // Clear any namespace-related errors
        if (drafts.error && (
          drafts.error.message === 'No namespace selected. Please select a namespace to create campaigns.' ||
          drafts.error.message === 'No namespaces available. Please create a namespace first.'
        )) {
          drafts.setError(null);
        }
      }
    }
  }, [currentNamespaceId, namespacesLoading, namespaces]);

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
              className="absolute inset-y-0 left-0 bg-primary-600 dark:bg-primary-400 transition-all duration-500"
              style={{ width: `${((form.currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Namespace warning - only show after initial load and with a delay */}
        {!currentNamespaceId && !namespacesLoading && namespaces.length > 0 && initialLoadComplete && showError && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/50 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400 dark:text-amber-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Namespace Required</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>Please select a namespace to create and manage campaigns. Campaigns are shared within a namespace.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DraftSection
          drafts={drafts.drafts}
          isLoadingDrafts={namespacesLoading || drafts.isLoadingDrafts}
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

        {drafts.error && drafts.error.type === 'error' && showError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {drafts.error.message}
          </div>
        )}

        {/* Show loading spinner when namespaces are loading */}
        {namespacesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent dark:border-primary-400 dark:border-r-transparent" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading namespaces...</p>
            </div>
          </div>
        ) : (
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
              clearSelectedTemplate={template.clearSelectedTemplate}
              selectedTemplate={template.selectedTemplate}
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
              currentNamespace={currentNamespace}
              userPermission={userPermission}
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
        )}
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