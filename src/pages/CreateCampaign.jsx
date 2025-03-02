import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardContent } from '../components/ui/card'; 
import { FileText, ChevronDown, Plus, Upload, X, Save } from 'lucide-react';
import { SuccessModal } from '../components/ui/success-modal';
import { AIModal } from '../components/create-campaign/AIModal';
import { DraftsDropdown } from '../components/create-campaign/DraftsDropdown';
import { HelpModal } from '../components/create-campaign/HelpModal';
import { useFormCache } from '../hooks/useFormCache';
import { PhonePreview } from '../components/create-campaign/PhonePreview';
import { StepProgress } from '../components/create-campaign/StepProgress';
import { InternalName } from '../components/create-campaign/steps/InternalName';
import { StepNavigation } from '../components/create-campaign/StepNavigation';
import { BasicInfo } from '../components/create-campaign/steps/BasicInfo';
import { DesignPage } from '../components/create-campaign/steps/DesignPage';
import { CampaignDetails } from '../components/create-campaign/steps/CampaignDetails';
import { BusinessInfo } from '../components/create-campaign/steps/BusinessInfo';

// Theme configuration
const themes = {
  midnight: {
    background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    text: 'text-white',
    subtext: 'text-blue-200',
    border: 'border-blue-900/50',
    input: 'bg-blue-950/50',
    name: 'Midnight Blue'
  },
  sunset: {
    background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    text: 'text-white',
    subtext: 'text-orange-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Sunset Vibes'
  },
  nature: {
    background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    text: 'text-white',
    subtext: 'emerald-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Nature Fresh'
  }
};

const steps = [
  { name: 'Internal Name' },
  { name: 'Design' },
  { name: 'Campaign Info' },
  { name: 'Campaign Details' },
  { name: 'Business Info' }
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState({ isOpen: false, campaignId: null, campaignName: '' });
  const [drafts, setDrafts] = useState([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const initialFormData = {
    internalName: '',
    name: '',
    description: '',
    category: '',
    subcategory: '',
    businessName: '',
    website: '',
    email: '',
    phone: ''
  };
  const [formData, setFormData, clearFormCache] = useFormCache(initialFormData);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const draftsRef = useRef(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/draftCampaign/drafts`, {
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

    setIsSavingDraft(true);

    try {
      const idToken = await auth.currentUser.getIdToken();
      const draftData = {
        internalName: formData.internalName,
        ...formData,
        theme: selectedTheme,
        subcategory: formData.category === 'political' ? formData.subcategory : null,
        surveyQuestions: surveyQuestions.map(q => q.question)
      };

      const response = await fetch(isEditingDraft 
        ? `${SERVER_URL}/draftCampaign/drafts/${selectedDraftId}`
        : `${SERVER_URL}/draftCampaign/drafts`, {
        method: isEditingDraft ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(draftData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save draft');
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
      setError({
        type: 'error',
        message: `Failed to save draft: ${err.message}`
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleLoadDraft = async (draftId) => {
    try {
      setSelectedDraftId(draftId);
      setIsEditingDraft(true);
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/draftCampaign/drafts/${draftId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load draft');
      }

      const draft = await response.json();
      setFormData({
        internalName: draft.internalName || '',
        name: draft.name || '',
        description: draft.description || '',
        category: draft.category || '',
        subcategory: draft.subcategory || '',
        businessName: draft.businessName || '',
        website: draft.website || '',
        email: draft.email || '',
        phone: draft.phone || ''
      });
      setSelectedTheme(draft.theme || 'sunset');
      setSurveyQuestions(draft.surveyQuestions.map((question, index) => ({
        id: index + 1,
        question
      })));
      setIsDraftsOpen(false);
    } catch (err) {
      console.error('Error loading draft:', err);
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteDraft = async (draftId) => {
    if (!draftId) return;
    
    setIsDeletingDraft(true);
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/draftCampaign/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete draft');
      }

      await fetchDrafts();
      setIsDraftsOpen(false);
      setSelectedDraftId(null);
      
      setError('Draft deleted successfully!');
      const alert = document.querySelector('[role="alert"]');
      if (alert) {
        alert.classList.add('bg-green-50', 'text-green-700', 'dark:bg-green-900/30', 'dark:text-green-400');
        const svg = alert.querySelector('svg');
        if (svg) {
          svg.classList.add('text-green-600', 'dark:text-green-400');
        }
      }
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Error deleting draft:', err);
      setError(err.message);
    } finally {
      setIsDeletingDraft(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddQuestion = () => {
    setSurveyQuestions([
      ...surveyQuestions,
      { id: surveyQuestions.length + 1, question: '' }
    ]);
  };

  const handleRemoveQuestion = (id) => {
    setSurveyQuestions(surveyQuestions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id, value) => {
    setSurveyQuestions(
      surveyQuestions.map(q => q.id === id ? { ...q, question: value } : q)
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
  };

  // Updated validation for each step
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return Boolean(formData.name.trim() && formData.description.trim());
      case 1:
        return Boolean(
          formData.category &&
          (formData.category === 'political' ? formData.subcategory?.trim() : true) &&
          surveyQuestions.length > 0 &&
          surveyQuestions.every(q => q.question.trim())
        );
      case 2:
        return Boolean(formData.businessName.trim() && formData.email.trim());
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Show preview starting from step 2 (Campaign Info)
      setShowPreview(currentStep + 1 >= 2);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Hide preview when going back before step 2
      setShowPreview(currentStep - 1 >= 2);
    }
  };

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

      setFormData({
        name: data.campaignData.name,
        description: data.campaignData.description,
        category: data.campaignData.category,
        subcategory: data.campaignData.subcategory,
        businessName: data.campaignData.businessName,
        website: data.campaignData.website,
        email: data.campaignData.email,
        phone: data.campaignData.phone,
      });

      setSurveyQuestions(
        data.campaignData.surveyQuestions.map((question, index) => ({
          id: index + 1,
          question,
        }))
      );

      setIsAIModalOpen(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Fetch error:', error);
      setAiError('Failed to connect to server. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setCurrentStep(0); // Reset to first step before submitting

    // Updated required check including business info fields
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      surveyQuestions.length === 0 ||
      !formData.businessName.trim() ||
      !formData.email.trim()
    ) {
      setError('Please fill in all required fields and add at least one question');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          theme: selectedTheme,
          subcategory: formData.category === 'political' ? formData.subcategory : null,
          surveyQuestions: surveyQuestions.map(q => q.question)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create campaign');
      }

      // Clear form cache after successful submission
      clearFormCache();

      const campaign = await response.json();
      setFormData({
        internalName: '',
        name: '',
        description: '',
        category: '',
        theme: selectedTheme,
        subcategory: '',
        businessName: '',
        website: '',
        email: '',
        phone: ''
      });
      setSurveyQuestions([]);
      setPreviewImage(null);

      setSuccessModal({
        isOpen: true,
        campaignId: campaign.id,
        campaignName: formData.name
      });
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`relative ${currentStep < 2 ? 'w-full' : 'max-w-[800px]'} mt-4`} ref={draftsRef}>
          {isLoadingDrafts ? (
            <div className="w-full flex items-center gap-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400">
              <div className="animate-pulse flex items-center gap-2 w-full">
                <div className="h-4 w-4 bg-gray-300 rounded dark:bg-gray-700" />
                <div className="h-4 w-24 bg-gray-300 rounded dark:bg-gray-700" />
                <div className="ml-auto flex items-center gap-2">
                  <div className="h-4 w-16 bg-gray-300 rounded dark:bg-gray-700" />
                  <div className="h-4 w-4 bg-gray-300 rounded dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ) : drafts.length > 0 ? (
            <button
              onClick={() => setIsDraftsOpen(!isDraftsOpen)}
              className="w-full flex items-center gap-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">{drafts.length} draft{drafts.length !== 1 ? 's' : ''}</span>
              <span className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <span>Click to view</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDraftsOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
          ) : (
            <div className="w-full flex items-center gap-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400">
              <FileText className="w-4 h-4" />
              <span className="font-medium">No drafts yet</span>
              <span className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <span>Save a draft to see it here</span>
                <X className="w-4 h-4" />
              </span>
            </div>
          )}

          {/* Drafts Dropdown */}
          <DraftsDropdown
            isOpen={isDraftsOpen}
            drafts={drafts}
            handleLoadDraft={handleLoadDraft}
            handleDeleteDraft={handleDeleteDraft}
            setSelectedDraftId={setSelectedDraftId}
            selectedDraftId={selectedDraftId}
            setIsEditingDraft={setIsEditingDraft}
            isDeletingDraft={isDeletingDraft}
          />
        </div>

        <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start ${!showPreview ? 'w-full' : ''}`}>
          <Card className="w-full">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {currentStep === 0 && (
                  <InternalName
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setIsAIModalOpen={setIsAIModalOpen}
                  />
                )}

                {currentStep === 2 && (
                  <BasicInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                    previewImage={previewImage}
                    handleImageChange={handleImageChange}
                    handleRemoveImage={handleRemoveImage}
                  />
                )}

                {currentStep === 1 && (
                  <DesignPage
                    selectedTheme={selectedTheme}
                    setSelectedTheme={setSelectedTheme}
                  />
                )}

                {currentStep === 3 && (
                  <CampaignDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    surveyQuestions={surveyQuestions}
                    handleAddQuestion={handleAddQuestion}
                    handleRemoveQuestion={handleRemoveQuestion}
                    handleQuestionChange={handleQuestionChange}
                    setIsHelpOpen={setIsHelpOpen}
                  />
                )}

                {currentStep === 4 && (
                  <BusinessInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}

                <div className="mt-8">
                  {error && (
                    <div role="alert" className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      error.type === 'success'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                    }`}>
                      {error.type === 'success' ? (
                        <svg className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      {error.message || error}
                    </div>
                  )}

                  <StepNavigation
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    isSubmitting={isSubmitting}
                    isSavingDraft={isSavingDraft}
                    handleSaveDraft={handleSaveDraft}
                    isEditingDraft={isEditingDraft}
                    formData={formData}
                    surveyQuestions={surveyQuestions}
                    setIsAIModalOpen={setIsAIModalOpen}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {showPreview && <PhonePreview
            selectedTheme={selectedTheme}
            themes={themes}
            previewImage={previewImage}
            formData={formData}
            surveyQuestions={surveyQuestions}
            currentStep={currentStep}
          />}
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Shout. All rights reserved.
      </div>

      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        handleAIGenerate={handleAIGenerate}
        isGenerating={isGenerating}
        aiError={aiError}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => {
          setSuccessModal({ isOpen: false, campaignId: null, campaignName: '' });
          setCurrentStep(0); // Reset to first step when modal is closed
          setFormData({
            internalName: '',
            name: '',
            description: '',
            category: '',
            subcategory: '',
            businessName: '',
            website: '',
            email: '',
            phone: ''
          });
          setSurveyQuestions([]);
          setPreviewImage(null);
        }}
        campaignId={successModal.campaignId}
        campaignName={successModal.campaignName}
      />
    </div>
  );
}