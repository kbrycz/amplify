import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardContent } from '../components/ui/card';
import { FileText, ChevronDown, Plus, Upload, X, Save } from 'lucide-react';
import { TemplateSuccessModal } from '../components/shared/templates/template-success-modal';
import { DraftsDropdown } from '../components/create-template/DraftsDropdown';
import { LoadingModal } from '../components/shared/templates/loading-modal';
import { SuccessMessage } from '../components/ui/success-message';
import { ErrorMessage } from '../components/ui/error-message';
import { useFormCache } from '../hooks/useFormCache';
import { PhonePreview } from '../components/shared/templates/PhonePreview';
import { InternalName } from '../components/shared/templates/InternalName';
import { Captions } from '../components/shared/templates/Captions';
import { Outro } from '../components/shared/templates/Outro';
import { StepNavigation } from '../components/shared/templates/StepNavigation';
import { TemplateModal } from '../components/videoPolisher/TemplateModal';

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
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPhonePreviewLoading, setIsPhonePreviewLoading] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
        response = await fetch(`${SERVER_URL}/draftTemplates/drafts/${selectedDraftId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          },
          body: JSON.stringify(draftData)
        });
      } else {
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
      await fetchDrafts();
      setSelectedDraftId(savedDraft.id);
      setIsEditingDraft(true);
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
      let additionalData = {};
      try {
        additionalData = JSON.parse(draft.additionalData || '{}');
      } catch (e) {
        console.warn('Could not parse additional data', e);
      }
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
      if (selectedDraftId === draftId) {
        setIsEditingDraft(false);
        setSelectedDraftId(null);
      }
      await fetchDrafts();
      setIsDraftsOpen(false);
      setDeleteMessage({
        type: 'success',
        message: 'Draft deleted successfully!'
      });
      setTimeout(() => setDeleteMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting draft:', err);
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

  function isStepValid() {
    switch (currentStep) {
      case 0:
        return Boolean(formData.name?.trim());
      case 1:
        return true;
      case 2:
        return true;
      default:
        return false;
    }
  }

  function handleNext(e) {
    e.preventDefault();
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
      setLoadingModal({ isOpen: false, status: 'success', error: null });
      setSuccessModal({ isOpen: true, templateName: formData.name, templateId: createdTemplate.id });
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

  // Reset video loading state when step changes
  useEffect(() => {
    if (currentStep === 1) {
      setIsVideoLoading(true);
    }
  }, [currentStep]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (draftsRef.current && !draftsRef.current.contains(event.target)) {
        setIsDraftsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [draftsRef]);

  const handleSelectTemplate = (templateData) => {
    setSelectedTemplate(templateData);
    
    // Update form data and settings based on the template
    if (templateData.name) {
      setFormData(prev => ({ ...prev, name: templateData.name }));
    }
    
    // Apply caption settings
    if (templateData.captionType) {
      setSelectedCaptionStyle({
        style: templateData.captionType || 'standard',
        position: templateData.captionPosition || 'bottom'
      });
    }
    
    // Apply outro settings
    if (templateData.outroTheme) {
      setSelectedOutroTheme(templateData.outroTheme);
    } else if (templateData.outtroBackgroundColors && templateData.outtroBackgroundColors !== 'none') {
      if (Object.keys(themes).includes(templateData.outtroBackgroundColors)) {
        setSelectedOutroTheme(templateData.outtroBackgroundColors);
      } else {
        setSelectedOutroTheme('custom');
        setCustomOutroColor(templateData.outtroBackgroundColors);
      }
    }
    
    // Apply font color
    if (templateData.outtroFontColor) {
      setOutroTextColor(templateData.outtroFontColor);
    }
    
    // Apply theme
    if (templateData.theme) {
      setSelectedTheme(templateData.theme);
    }
    
    // Apply outro text
    if (templateData.outroText) {
      setOutroText(templateData.outroText);
    }
    
    // Set outro visibility
    if (templateData.showOutro !== undefined) {
      setShowOutro(templateData.showOutro);
    } else if (templateData.outroTheme || (templateData.outtroBackgroundColors && templateData.outtroBackgroundColors !== 'none')) {
      setShowOutro(true);
    } else {
      setShowOutro(false);
    }
    
    // Apply logo if available
    if (templateData.image) {
      setOutroLogo(templateData.image);
    }
    
    // Apply additional data if available
    if (templateData.additionalData) {
      try {
        const additionalData = JSON.parse(templateData.additionalData);
        
        // Apply any additional settings from additionalData
        if (additionalData.outroText && !templateData.outroText) {
          setOutroText(additionalData.outroText);
        }
        
        if (additionalData.outroLogo && !templateData.image) {
          setOutroLogo(additionalData.outroLogo);
        }
      } catch (e) {
        console.error('Error parsing template additional data', e);
      }
    }
    
    // Show success message
    setError({
      type: 'success',
      message: 'Template applied successfully!'
    });
    setTimeout(() => setError(null), 3000);
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create Template</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create a reusable template for your videos. Templates can be applied to any video in your library.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsDraftsOpen(!isDraftsOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FileText className="h-4 w-4" />
              Drafts
              <ChevronDown className={`h-4 w-4 transition-transform ${isDraftsOpen ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {isSavingDraft ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Draft
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4">
          <div
            className="absolute inset-y-0 left-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Drafts Section */}
        <div className="relative max-w-[800px] mt-4" ref={draftsRef}>
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
        {error && error.type === 'error' && <ErrorMessage message={error.message} />}
        {deleteMessage && deleteMessage.type === 'success' && <SuccessMessage message={deleteMessage.message} />}
        {deleteMessage && deleteMessage.type === 'error' && <ErrorMessage message={deleteMessage.message} />}
        <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start ${!showPreview ? 'w-full' : ''}`}>
          <Card className="w-full">
            <CardContent>
              <form onSubmit={(e) => {
                if (currentStep !== steps.length - 1) {
                  e.preventDefault();
                  handleNext(e);
                } else {
                  handleSubmit(e);
                }
              }} className="space-y-8">
                {currentStep === 0 && (
                  <>
                    <InternalName formData={formData} handleInputChange={handleInputChange} />
                    
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <FileText className="h-4 w-4" />
                        {selectedTemplate ? 'Change Template' : 'Use Template'}
                      </button>
                      {selectedTemplate ? (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              selectedTemplate.theme ? themes[selectedTemplate.theme]?.background : 
                              (selectedTemplate.outroTheme ? themes[selectedTemplate.outroTheme]?.background : 'bg-blue-500')
                            }`}>
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{selectedTemplate.name || 'Unnamed Template'}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedTemplate.captionType && (
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    {selectedTemplate.captionType} captions {selectedTemplate.captionPosition && `(${selectedTemplate.captionPosition})`}
                                  </span>
                                )}
                                {selectedTemplate.theme && (
                                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                    {themes[selectedTemplate.theme]?.name || selectedTemplate.theme} theme
                                  </span>
                                )}
                                {selectedTemplate.outroTheme && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    {themes[selectedTemplate.outroTheme]?.name || selectedTemplate.outroTheme} outro
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Select a template to use its caption and outro settings.
                        </p>
                      )}
                    </div>
                  </>
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
                {saveDraftSuccess && <SuccessMessage message={saveDraftSuccess} />}
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
              videoUrl={previewImage}
              isVideoLoading={isVideoLoading}
              setIsVideoLoading={setIsVideoLoading}
              isPhonePreviewLoading={isPhonePreviewLoading}
              setIsPhonePreviewLoading={setIsPhonePreviewLoading}
            />
          )}
        </div>
      </div>

      {/* Template Modal */}
      <TemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Loading Modal */}
      <LoadingModal
        isOpen={loadingModal.isOpen}
        status={loadingModal.status}
        error={loadingModal.error}
        onClose={() => setLoadingModal({ ...loadingModal, isOpen: false })}
        entityName={formData.name}
        entityType="template"
      />

      {/* Success Modal */}
      <TemplateSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        templateName={successModal.templateName}
        templateId={successModal.templateId}
      />
    </div>
  );
}