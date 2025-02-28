import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Upload, Plus, FileText, ChevronDown, Sparkles, X } from 'lucide-react';
import { SuccessModal } from '../components/ui/success-modal';
import { AIModal } from '../components/create-campaign/AIModal';
import { DraftsDropdown } from '../components/create-campaign/DraftsDropdown';
import { HelpModal } from '../components/create-campaign/HelpModal';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { PhonePreview } from '../components/create-campaign/PhonePreview';
import { SurveyQuestions } from '../components/create-campaign/SurveyQuestions';
import { Undo2, Redo2 } from 'lucide-react';

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

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
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
    name: '',
    description: '',
    category: '',
    businessName: '',
    website: '',
    email: '',
    phone: ''
  };
  const { state: formData, setState: setFormData, undo, redo, canUndo, canRedo } = useUndoRedo(initialFormData);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const draftsRef = useRef(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  // Fetch drafts from the server
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

  // Handle saving a draft
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
        ...formData,
        theme: selectedTheme,
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

      await fetchDrafts(); // Refresh drafts list
      
      // Show success message in green
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

  // Handle loading a draft
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
        name: draft.name || '',
        description: draft.description || '',
        category: draft.category || '',
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

  // Handle deleting a draft
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

      await fetchDrafts(); // Refresh drafts list
      setIsDraftsOpen(false);
      setSelectedDraftId(null);
      
      // Show success message
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate required fields
    if (!formData.name || !formData.description || !formData.category || surveyQuestions.length === 0) {
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
          surveyQuestions: surveyQuestions.map(q => q.question)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create campaign');
      }

      const campaign = await response.json();
      // Reset form data
      setFormData({
        name: '',
        description: '',
        category: '',
        theme: selectedTheme,
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

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Campaign</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Set up your campaign details and customize your survey questions.
          </p>
        </div>

        <div className="relative max-w-[800px]" ref={draftsRef}>
          {!isLoadingDrafts && drafts.length > 0 && (
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
          )}

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

        <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-4">
          <Card className="w-full">
            <CardHeader>
              <div>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-left transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-800 dark:group-hover:bg-gray-700">
                    <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Try our AI Campaign Creator
                  </span>
                  <div className="ml-auto">
                    <div className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      New
                    </div>
                  </div>
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  {/* Campaign Details */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="flex-1">
                      <Label htmlFor="name">Campaign Name *</Label>
                      <Input
                        id="name"
                        name="campaign-title"
                        placeholder="Enter campaign name"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="off"
                        data-form-type="other"
                        required
                      />
                    </div>
                    <div className="w-[200px]">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        id="theme"
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                      >
                        {Object.entries(themes).map(([key, theme]) => (
                          <option key={key} value={key}>{theme.name}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label>Campaign Image</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full min-h-[160px]">
                        <label className="relative flex items-center justify-center w-full h-full border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                          <div className="flex flex-col items-center justify-center p-6">
                            {previewImage ? (
                              <div className="relative w-40 h-40 group">
                                <img
                                  src={previewImage}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Campaign Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign's purpose and goals"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Campaign Category *</Label>
                    <Select 
                      id="category" 
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="political">Political Campaign</option>
                      <option value="social">Social Media Influencer</option>
                      <option value="nonprofit">Non-Profit Organization</option>
                      <option value="business">Business Marketing</option>
                      <option value="education">Educational Institution</option>
                    </Select>
                  </div>
                </div>

                {/* Survey Questions */}
                <SurveyQuestions
                  surveyQuestions={surveyQuestions}
                  handleAddQuestion={handleAddQuestion}
                  handleRemoveQuestion={handleRemoveQuestion}
                  handleQuestionChange={handleQuestionChange}
                  setIsHelpOpen={setIsHelpOpen}
                />

                {/* Business Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optional - Fill in if you want to display your business details</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Business Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@business.com"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div role="alert" className={`mb-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
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
                    {error.message}
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <div className="flex items-center gap-2 mr-auto">
                    <button
                      type="button"
                      onClick={undo}
                      disabled={!canUndo}
                      className={`rounded-lg p-2 transition-colors ${
                        canUndo
                          ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                      } border border-gray-200 dark:border-gray-800`}
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo2 className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={redo}
                      disabled={!canRedo}
                      className={`rounded-lg p-2 transition-colors ${
                        canRedo
                          ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                      } border border-gray-200 dark:border-gray-800`}
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo2 className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={isSubmitting || !formData.name.trim() || isSavingDraft} 
                    className={`rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium ${
                      !formData.name.trim() 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                    } dark:border-gray-800 dark:bg-gray-900`}
                    onClick={handleSaveDraft}
                  >
                    {isSavingDraft ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isEditingDraft ? 'Updating...' : 'Saving...'}
                      </span>
                    ) : (
                      isEditingDraft ? 'Update Draft' : 'Save as Draft'
                    )}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      'Create Campaign'
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          <PhonePreview
            selectedTheme={selectedTheme}
            themes={themes}
            previewImage={previewImage}
            formData={formData}
            surveyQuestions={surveyQuestions}
          />
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Amplify. All rights reserved.
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
        onClose={() => setSuccessModal({ isOpen: false, campaignId: null, campaignName: '' })}
        campaignId={successModal.campaignId}
        campaignName={successModal.campaignName}
      />
    </div>
  );
}