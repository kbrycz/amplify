// CreateTemplate.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardContent } from '../components/ui/card';
import { FileText, ChevronDown, Plus, Upload, X, Save } from 'lucide-react';
import { TemplateSuccessModal } from '../components/templates/template-success-modal';
import { DraftsDropdown } from '../components/create-template/DraftsDropdown';
import { LoadingModal } from '../components/templates/loading-modal';
import { SuccessMessage } from '../components/ui/success-message';
import { ErrorMessage } from '../components/ui/error-message';
import { useFormCache } from '../hooks/useFormCache';
import { PhonePreview } from '../components/create-template/PhonePreview';
import { InternalName } from '../components/create-template/steps/InternalName';
import { Captions } from '../components/create-template/steps/Captions';
import { Outro } from '../components/create-template/steps/Outro';
import { StepNavigation } from '../components/create-template/StepNavigation';

// Theme configuration – should match your campaign themes
const themes = {
  sunset: {
    background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    text: 'text-white',
    subtext: 'text-orange-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Sunset Vibes'
  },
  midnight: {
    background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    text: 'text-white',
    subtext: 'text-blue-200',
    border: 'border-blue-900/50',
    input: 'bg-blue-950/50',
    name: 'Midnight Blue'
  },
  nature: {
    background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    text: 'text-white',
    subtext: 'emerald-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Nature Fresh'
  },
  ocean: {
    background: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600',
    text: 'text-white',
    subtext: 'text-cyan-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Ocean Depths'
  }
};

// Steps for the create-template flow
const steps = [
  { name: 'Internal Name' },
  { name: 'Captions' },
  { name: 'Outro' }
];

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState({ style: 'standard', position: 'bottom' });
  const [selectedOutroTheme, setSelectedOutroTheme] = useState('sunset');
  const [outroLogo, setOutroLogo] = useState(null);
  const [customOutroColor, setCustomOutroColor] = useState('#3B82F6');
  const [outroText, setOutroText] = useState('');
  const [outroTextColor, setOutroTextColor] = useState('#FFFFFF');
  const [showOutro, setShowOutro] = useState(true);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, status: 'loading', error: null });
  const [successModal, setSuccessModal] = useState({ isOpen: false, templateName: '', templateId: null });
  const [saveDraftSuccess, setSaveDraftSuccess] = useState(null);

  // Use cached form state
  const initialFormData = {
    name: '',
    title: '',
    description: '',
    category: '',
    businessName: '',
    website: '',
    email: '',
    phone: ''
  };
  const [formData, setFormData, clearFormCache] = useFormCache(initialFormData, 'template-form');
  const draftsRef = useRef(null);

  // ========= Drafts Handling =========
  useEffect(() => {
    fetchDrafts();
  }, []);

  async function fetchDrafts() {
    setIsLoadingDrafts(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to view drafts');

      const response = await fetch(`${SERVER_URL}/draftTemplates/drafts`, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch drafts');
      
      const draftsData = await response.json();
      setDrafts(draftsData);
    } catch (err) {
      console.error('Error fetching drafts:', err);
      setError({
        type: 'error',
        message: 'Failed to load drafts. Please try again.'
      });
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoadingDrafts(false);
    }
  }

  async function handleSaveDraft() {
    if (!formData.name?.trim()) {
      setError({
        type: 'error',
        message: 'Please enter a template name to save as draft'
      });
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsSavingDraft(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to save a draft');

      const draftData = {
        name: formData.name,
        captionType: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.style : selectedCaptionStyle,
        captionPosition: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.position : 'bottom',
        outtroBackgroundColors: showOutro ? (selectedOutroTheme === 'custom' ? customOutroColor : selectedOutroTheme) : 'none',
        outtroFontColor: showOutro ? outroTextColor : '',
        image: outroLogo,
        // Additional data for our app's functionality
        additionalData: JSON.stringify({
          formData,
          selectedTheme,
          selectedCaptionStyle,
          selectedOutroTheme,
          outroLogo,
          customOutroColor,
          outroText,
          outroTextColor,
          showOutro,
          previewImage
        })
      };

      let response;
      
      if (isEditingDraft && selectedDraftId) {
        // Update existing draft
        response = await fetch(`${SERVER_URL}/draftTemplates/drafts/${selectedDraftId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          },
          body: JSON.stringify(draftData)
        });
      } else {
        // Create new draft
        response = await fetch(`${SERVER_URL}/draftTemplates/drafts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          },
          body: JSON.stringify(draftData)
        });
      }

      if (!response.ok) throw new Error('Failed to save draft');
      
      const savedDraft = await response.json();
      
      // Update drafts list and selected draft ID
      await fetchDrafts();
      setSelectedDraftId(savedDraft.id);
      setIsEditingDraft(true);
      
      // Show success message at the bottom
      setSaveDraftSuccess(isEditingDraft ? 'Draft updated successfully!' : 'Draft saved successfully!');
      setTimeout(() => setSaveDraftSuccess(null), 3000);
      
    } catch (err) {
      console.error('Error saving draft:', err);
      setError({
        type: 'error',
        message: 'Failed to save draft. Please try again.'
      });
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handleLoadDraft(draftId) {
    setIsLoadingDrafts(false);
    setIsDraftsOpen(false);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to load a draft');

      const response = await fetch(`${SERVER_URL}/draftTemplates/drafts/${draftId}`, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to load draft');
      
      const draft = await response.json();
      
      // Parse the additional data
      let additionalData = {};
      try {
        additionalData = JSON.parse(draft.additionalData || '{}');
      } catch (e) {
        console.warn('Could not parse additional data', e);
      }
      
      // Update form state with draft data
      setFormData(additionalData.formData || {
        name: draft.name || '',
        title: '',
        description: '',
        category: '',
        businessName: '',
        website: '',
        email: '',
        phone: ''
      });
      
      setSelectedTheme(additionalData.selectedTheme || 'sunset');
      setSelectedCaptionStyle(additionalData.selectedCaptionStyle || { 
        style: draft.captionType || 'standard', 
        position: draft.captionPosition || 'bottom' 
      });
      setSelectedOutroTheme(additionalData.selectedOutroTheme || draft.outtroBackgroundColors || 'sunset');
      setOutroLogo(additionalData.outroLogo || draft.image || null);
      setCustomOutroColor(additionalData.customOutroColor || '#3B82F6');
      setOutroText(additionalData.outroText || '');
      setOutroTextColor(additionalData.outroTextColor || draft.outtroFontColor || '#FFFFFF');
      setShowOutro(additionalData.showOutro !== undefined ? additionalData.showOutro : true);
      setPreviewImage(additionalData.previewImage || null);
      
      setSelectedDraftId(draftId);
      setIsEditingDraft(true);
      
      // Show success message
      setDeleteMessage({
        type: 'success',
        message: 'Draft loaded successfully!'
      });
      setTimeout(() => setDeleteMessage(null), 3000);
    } catch (err) {
      console.error('Error loading draft:', err);
      setError({
        type: 'error',
        message: 'Failed to load draft. Please try again.'
      });
      setTimeout(() => setError(null), 3000);
    }
  }

  async function handleDeleteDraft(draftId) {
    setIsDeletingDraft(true);
    setSelectedDraftId(draftId);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to delete a draft');

      const response = await fetch(`${SERVER_URL}/draftTemplates/drafts/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete draft');
      
      // If we're currently editing this draft, reset the form
      if (selectedDraftId === draftId) {
        setIsEditingDraft(false);
        setSelectedDraftId(null);
      }
      
      // Refresh drafts list
      await fetchDrafts();
      
      // Always close the dropdown when a draft is deleted
      setIsDraftsOpen(false);
      
      // Show success message at the top
      setDeleteMessage({
        type: 'success',
        message: 'Draft deleted successfully!'
      });
      setTimeout(() => setDeleteMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting draft:', err);
      
      // Always close the dropdown when there's an error
      setIsDraftsOpen(false);
      
      setError({
        type: 'error',
        message: 'Failed to delete draft. Please try again.'
      });
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDeletingDraft(false);
    }
  }

  // ========= Form Input Handlers =========
  function handleInputChange(e) {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }
  function handleSelectChange(id, value) {
    setFormData(prev => ({ ...prev, [id]: value }));
  }
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  }
  function handleRemoveImage() {
    setPreviewImage(null);
  }

  // ========= Navigation & Submission =========
  function isStepValid() {
    switch (currentStep) {
      case 0:
        return Boolean(formData.name?.trim());
      case 1:
        // Caption step is always valid, even with "none" selected
        return true;
      case 2:
        // Outro step is always valid, no required fields
        return true;
      default:
        return false;
    }
  }
  function handleNext(e) {
    e?.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(e);
    }
  }
  function handlePrevious() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Only require the template name to be filled in
    if (!formData.name?.trim()) {
      setError({
        type: 'error',
        message: 'Please enter a template name'
      });
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setLoadingModal({ isOpen: true, status: 'loading', error: null });
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to create a template');
      
      const templateData = {
        name: formData.name,
        captionType: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.style : selectedCaptionStyle,
        captionPosition: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.position : 'bottom',
        outtroBackgroundColors: showOutro ? (selectedOutroTheme === 'custom' ? customOutroColor : selectedOutroTheme) : 'none',
        outtroFontColor: showOutro ? outroTextColor : '',
        image: showOutro ? outroLogo : null,
        // Additional data for our app's functionality
        additionalData: JSON.stringify({
          formData,
          selectedTheme,
          selectedCaptionStyle,
          selectedOutroTheme,
          outroLogo,
          customOutroColor,
          outroText,
          outroTextColor,
          showOutro,
          previewImage
        })
      };
      
      // Create the template
      const response = await fetch(`${SERVER_URL}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(templateData)
      });
      
      if (!response.ok) throw new Error('Failed to create template');
      
      const createdTemplate = await response.json();
      
      // If we were editing a draft, delete it
      if (isEditingDraft && selectedDraftId) {
        try {
          await fetch(`${SERVER_URL}/draftTemplates/drafts/${selectedDraftId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${await user.getIdToken()}` }
          });
        } catch (err) {
          console.warn('Failed to delete draft after template creation', err);
        }
      }
      
      // Show success modal
      setLoadingModal({ isOpen: false, status: 'success', error: null });
      setSuccessModal({ 
        isOpen: true, 
        templateName: formData.name,
        templateId: createdTemplate.id
      });
      
      // Reset form
      clearFormCache();
      setCurrentStep(0);
      setSelectedTheme('sunset');
      setSelectedCaptionStyle({ style: 'standard', position: 'bottom' });
      setSelectedOutroTheme('sunset');
      setOutroLogo(null);
      setCustomOutroColor('#3B82F6');
      setOutroText('');
      setOutroTextColor('#FFFFFF');
      setPreviewImage(null);
      setIsEditingDraft(false);
      setSelectedDraftId(null);
      
    } catch (err) {
      console.error('Error creating template:', err);
      setLoadingModal({ 
        isOpen: true, 
        status: 'error', 
        error: err.message || 'Failed to create template. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ========= Close Drafts Dropdown on Outside Click =========
  useEffect(() => {
    function handleClickOutside(event) {
      if (draftsRef.current && !draftsRef.current.contains(event.target)) {
        setIsDraftsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [draftsRef]);

  // ========= JSX Rendering =========
  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create Template</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Design and save reusable templates for your campaigns
          </p>
          <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4">
            <div
              className="absolute inset-y-0 left-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`relative max-w-[800px] mt-4`} ref={draftsRef}>
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
                Save a draft to see it here
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
            isDeletingDraft={isDeletingDraft}
            selectedDraftId={selectedDraftId}
            setIsEditingDraft={setIsEditingDraft}
          />
        </div>

        {/* Error / Success Messages at the top */}
        {error && error.type === 'error' && (
          <ErrorMessage message={error.message} />
        )}
        {deleteMessage && deleteMessage.type === 'success' && (
          <SuccessMessage message={deleteMessage.message} />
        )}
        {deleteMessage && deleteMessage.type === 'error' && (
          <ErrorMessage message={deleteMessage.message} />
        )}

        {/* Main content area with form and preview */}
        <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start ${!showPreview ? 'w-full' : ''}`}>
          <Card className="w-full">
            <CardContent>
              <form onSubmit={(e) => {
                // Only allow form submission from the last step
                if (currentStep !== steps.length - 1) {
                  e.preventDefault();
                  handleNext(e);
                } else {
                  handleSubmit(e);
                }
              }} className="space-y-8">
                {currentStep === 0 && (
                  <InternalName formData={formData} handleInputChange={handleInputChange} />
                )}
                {currentStep === 1 && (
                  <Captions
                    selectedCaptionStyle={selectedCaptionStyle}
                    setSelectedCaptionStyle={setSelectedCaptionStyle}
                  />
                )}
                {currentStep === 2 && (
                  <Outro
                    selectedOutroTheme={selectedOutroTheme}
                    setSelectedOutroTheme={setSelectedOutroTheme}
                    outroLogo={outroLogo}
                    setOutroLogo={setOutroLogo}
                    handleImageChange={handleImageChange}
                    handleRemoveImage={handleRemoveImage}
                    customOutroColor={customOutroColor}
                    setCustomOutroColor={setCustomOutroColor}
                    outroText={outroText}
                    setOutroText={setOutroText}
                    outroTextColor={outroTextColor}
                    setOutroTextColor={setOutroTextColor}
                    showOutro={showOutro}
                    setShowOutro={setShowOutro}
                  />
                )}

                {/* Success message for saving draft */}
                {saveDraftSuccess && (
                  <SuccessMessage message={saveDraftSuccess} />
                )}

                <div className="mt-8">
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
                    selectedCaptionStyle={selectedCaptionStyle}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview section */}
          {showPreview && (
            <PhonePreview
              selectedTheme={selectedTheme}
              formData={formData}
              currentStep={currentStep}
              themes={themes}
              selectedCaptionStyle={selectedCaptionStyle}
              selectedOutroTheme={selectedOutroTheme}
              outroLogo={outroLogo}
              customOutroColor={customOutroColor}
              outroText={outroText}
              outroTextColor={outroTextColor}
              showOutro={showOutro}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {loadingModal.isOpen && (
        <LoadingModal
          isOpen={loadingModal.isOpen}
          status={loadingModal.status}
          error={loadingModal.error}
          onClose={() => setLoadingModal({ ...loadingModal, isOpen: false })}
          entityName={formData.name}
          entityType="template"
        />
      )}
      <TemplateSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        templateName={successModal.templateName}
        templateId={successModal.templateId}
      />
    </div>
  );
}