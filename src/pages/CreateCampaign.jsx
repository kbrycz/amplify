import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { CATEGORIES, SUBCATEGORIES, isValidCategory, isValidSubcategory } from '../lib/categoryEnums';
import { themes as sharedThemes } from '../components/survey/themes';
import { Card, CardContent } from '../components/ui/card'; 
import { FileText, ChevronDown, Plus, Upload, X, Save, Sparkles } from 'lucide-react';
import { AIModal } from '../components/create-campaign/AIModal';
import { DraftsDropdown } from '../components/create-campaign/DraftsDropdown';
import { HelpModal } from '../components/create-campaign/HelpModal';
import { LoadingModal } from '../components/create-campaign/loading-modal';
import { useFormCache } from '../hooks/useFormCache';
import { PhonePreview } from '../components/create-campaign/PhonePreview';
import { InternalName } from '../components/create-campaign/steps/InternalName';
import { StepNavigation } from '../components/create-campaign/StepNavigation';
import { BasicInfo } from '../components/create-campaign/steps/BasicInfo';
import { DesignPage } from '../components/create-campaign/steps/DesignPage';
import { CampaignDetails } from '../components/create-campaign/steps/CampaignDetails';
import { ReviewCampaign } from '../components/create-campaign/steps/ReviewCampaign';
import { CampaignTemplateModal } from '../components/create-campaign/CampaignTemplateModal';
import { CategorySelection } from '../components/create-campaign/steps/CategorySelection';
import { SubcategorySelection } from '../components/create-campaign/steps/SubcategorySelection';

// Extend the shared themes with the custom theme option
const themes = {
  ...sharedThemes,
  // Add custom theme which is specific to the campaign creation flow
  custom: {
    background: '', // Will be set dynamically
    text: 'text-white',
    subtext: 'text-white/80',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Custom Theme'
  }
};

const steps = [
  { name: 'Internal Name' },
  { name: 'Category' },
  { name: 'Template' },
  { name: 'Design' },
  { name: 'Campaign Info' },
  { name: 'Campaign Details' },
  { name: 'Review' }
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, status: 'loading', error: null, campaignId: null, campaignName: '' });
  // Custom colors state
  const [gradientColors, setGradientColors] = useState({
    from: '#1a365d',
    via: '#3182ce',
    to: '#2c5282'
  });
  const [gradientDirection, setGradientDirection] = useState('br'); // br = bottom-right
  const [hexText, setHexText] = useState('#ffffff');
  
  const initialFormData = {
    name: '',
    title: '',
    description: '',
    category: '',
    subcategory: '',
    businessName: '',
    website: '',
    email: '',
    phone: ''
  };
  // Rename setFormData to updateFormData to avoid shadowing issues
  const [formData, updateFormData, clearFormCache] = useFormCache(initialFormData);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const draftsRef = useRef(null);
  
  // Track which fields were AI-generated
  const [aiGeneratedFields, setAiGeneratedFields] = useState({});
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  // Explainer video state
  const [hasExplainerVideo, setHasExplainerVideo] = useState(false);
  const [explainerVideo, setExplainerVideo] = useState(null);

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
      
      // Get custom colors if the theme is 'custom'
      const customColors = selectedTheme === 'custom' ? {
        gradientColors,
        gradientDirection,
        textColor: hexText
      } : null;
      
      // Validate category and subcategory
      const category = formData.category;
      let subcategory = formData.subcategory;
      
      if (category && !isValidCategory(category)) {
        console.warn(`Invalid category: ${category}, defaulting to null`);
        category = null;
      }
      
      // If subcategory is provided, validate it
      if (subcategory && category && !isValidSubcategory(category, subcategory)) {
        console.warn(`Invalid subcategory ${subcategory} for category ${category}, defaulting to null`);
        subcategory = null;
      }
      
      const draftData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        category: category,
        theme: selectedTheme,
        customColors: customColors,
        campaignImage: previewImage,
        subcategory: subcategory,
        surveyQuestions: surveyQuestions.map(q => q.question),
        hasExplainerVideo: hasExplainerVideo,
        explainerVideo: explainerVideo
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
      
      // Load the draft data, including any legacy business fields that might exist
      // but won't be included in future submissions
      updateFormData({
        name: draft.name || '',
        title: draft.title || '',
        description: draft.description || '',
        category: draft.category || '',
        subcategory: draft.subcategory || '',
        // Keep these fields for backward compatibility with existing drafts
        businessName: draft.businessName || '',
        website: draft.website || '',
        email: draft.email || '',
        phone: draft.phone || ''
      });
      
      setSelectedTheme(draft.theme || 'sunset');
      
      // Load custom colors if available
      if (draft.customColors) {
        setGradientColors(draft.customColors.gradientColors || {
          from: '#1a365d',
          via: '#3182ce',
          to: '#2c5282'
        });
        setGradientDirection(draft.customColors.gradientDirection || 'br');
        setHexText(draft.customColors.textColor || '#ffffff');
      }
      
      // Load campaign image if available
      if (draft.campaignImage) {
        setPreviewImage(draft.campaignImage);
      }
      
      // Load explainer video if available
      if (draft.hasExplainerVideo) {
        setHasExplainerVideo(true);
        setExplainerVideo(draft.explainerVideo || null);
      } else {
        setHasExplainerVideo(false);
        setExplainerVideo(null);
      }
      
      setSurveyQuestions(draft.surveyQuestions.map((question, index) => ({
        id: index + 1,
        question
      })));
      setIsDraftsOpen(false);
      
      // Clear AI indicators when loading a draft
      setAiGeneratedFields({});
      
      // Set the current step based on the loaded data
      // If we have a category and subcategory, go to the design step
      if (draft.category && (draft.category === CATEGORIES.OTHER || draft.subcategory)) {
        setCurrentStep(3); // Design step
      } else if (draft.category) {
        setCurrentStep(2); // Template step
      } else {
        setCurrentStep(1); // Category step
      }
    } catch (err) {
      console.error('Error loading draft:', err);
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteDraft = async (draftId) => {
    if (!draftId) return;
    
    setIsDeletingDraft(true);
    setDeleteMessage(null);

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
      
      setDeleteMessage({
        type: 'success',
        message: 'Draft deleted successfully!'
      });
      setTimeout(() => setDeleteMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting draft:', err);
      setDeleteMessage({
        type: 'error',
        message: err.message || 'Error deleting draft'
      });
    } finally {
      setIsDeletingDraft(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // When user edits a field, remove it from AI generated fields
    if (aiGeneratedFields[id]) {
      setAiGeneratedFields(prev => ({
        ...prev,
        [id]: false
      }));
    }
    
    updateFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddQuestion = () => {
    // Limit to a maximum of 3 questions
    if (surveyQuestions.length >= 3) {
      return;
    }
    
    setSurveyQuestions([
      ...surveyQuestions,
      { id: surveyQuestions.length + 1, question: '' }
    ]);
  };

  const handleRemoveQuestion = (id) => {
    setSurveyQuestions(surveyQuestions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id, value) => {
    // Check if this question was AI generated
    const questionIndex = surveyQuestions.findIndex(q => q.id === id);
    const fieldName = `question_${questionIndex}`;
    
    // When user edits a question, remove it from AI generated fields
    if (aiGeneratedFields[fieldName]) {
      setAiGeneratedFields(prev => ({
        ...prev,
        [fieldName]: false
      }));
    }
    
    setSurveyQuestions(
      surveyQuestions.map(q => q.id === id ? { ...q, question: value } : q)
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError({
          type: 'error',
          message: 'Image size should be less than 5MB'
        });
        setTimeout(() => setError(null), 3000);
        return;
      }
      
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
      case 0: // Internal Name: always valid since we want to allow saving drafts
        return Boolean(formData.name?.trim());
      case 1: // Category: require a category selection
        return Boolean(formData.category);
      case 2: // Template: require a subcategory selection (or skip if category is 'other')
        return formData.category === 'other' || Boolean(formData.subcategory);
      case 3: // Design: always valid since theme has a default value
        return true; // Theme selection is always valid since it has a default value
      case 4: // Basic Info: require title and description
        return Boolean(formData.title?.trim() && formData.description?.trim());
      case 5: // Campaign Details: require category (and subcategory if political) and at least one non-empty survey question
        return Boolean(
          formData.category &&
          (formData.category === 'political' ? formData.subcategory?.trim() : true) &&
          surveyQuestions?.length > 0 &&
          surveyQuestions.every(q => q.question.trim())
        );
      case 6: // Review: always valid since it's the last step
        return true;
      default:
        return false;
    }
  };

  const handleNext = (e) => {
    // Prevent form submission if an event is passed
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (currentStep < steps.length - 1) {
      // If on category step (step 1) and no category selected, set to 'other' and skip template step
      if (currentStep === 1 && !formData.category) {
        updateFormData(prev => ({
          ...prev,
          category: CATEGORIES.OTHER
        }));
        setCurrentStep(currentStep + 2); // Skip to design step
        setShowPreview(true);
        return;
      }
      
      // If moving from category step (step 1) to subcategory step (step 2),
      // ensure subcategory is explicitly set to null for proper button text
      if (currentStep === 1 && formData.category !== CATEGORIES.OTHER) {
        updateFormData(prev => ({
          ...prev,
          subcategory: null
        }));
      }
      
      // If on template step (step 2) and no subcategory selected, set to 'custom'
      if (currentStep === 2 && !formData.subcategory) {
        updateFormData(prev => ({
          ...prev,
          subcategory: 'custom',
          // Initialize empty survey questions if none exist
          surveyQuestions: prev.surveyQuestions?.length > 0 ? prev.surveyQuestions : [
            { id: 1, question: '' }
          ]
        }));
      }
      
      setCurrentStep(currentStep + 1);
      // Always show preview
      setShowPreview(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // If going back to category selection from design step (step 3) and category is 'other',
      // it means the user skipped the subcategory step, so go back directly to step 1
      if (currentStep === 3 && formData.category === CATEGORIES.OTHER) {
        // Reset category to null to ensure the button shows "Continue without template"
        updateFormData(prev => ({
          ...prev,
          category: null
        }));
        setCurrentStep(1); // Go directly to category selection
      } 
      // If going back to step 2 (subcategory) from step 3 (design) and category is not 'other'
      // but subcategory is 'custom', it means the user clicked "Continue without example questions" on step 2
      else if (currentStep === 3 && formData.subcategory === 'custom') {
        // Reset subcategory to null to ensure the button shows "Continue without example questions"
        updateFormData(prev => ({
          ...prev,
          subcategory: null
        }));
        setCurrentStep(2); // Go to subcategory selection
      }
      // Normal case - go back one step
      else {
        setCurrentStep(currentStep - 1);
      }
      
      // Always show preview
      setShowPreview(true);
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

      // Update form data with AI generated content
      updateFormData({
        ...formData,
        title: data.campaignData.title || data.campaignData.name,
        description: data.campaignData.description,
        category: data.campaignData.category,
        subcategory: data.campaignData.subcategory,
        businessName: data.campaignData.businessName,
        website: data.campaignData.website,
        email: data.campaignData.email,
        phone: data.campaignData.phone,
      });

      // Set which fields were AI generated - only mark fields that actually have values
      const newAiGeneratedFields = {};
      
      // Only mark fields as AI-generated if they actually contain content
      if (data.campaignData.title || data.campaignData.name) newAiGeneratedFields.title = true;
      if (data.campaignData.description) newAiGeneratedFields.description = true;
      if (data.campaignData.category) newAiGeneratedFields.category = true;
      if (data.campaignData.subcategory) newAiGeneratedFields.subcategory = true;
      
      // For business fields, only mark as AI-generated if they contain content
      if (data.campaignData.businessName) newAiGeneratedFields.businessName = true;
      if (data.campaignData.website) newAiGeneratedFields.website = true;
      if (data.campaignData.email) newAiGeneratedFields.email = true;
      if (data.campaignData.phone) newAiGeneratedFields.phone = true;

      // Update survey questions from AI
      const newQuestions = data.campaignData.surveyQuestions.map((question, index) => ({
        id: index + 1,
        question,
      }));
      
      setSurveyQuestions(newQuestions);
      
      // Mark questions as AI generated
      data.campaignData.surveyQuestions.forEach((question, index) => {
        if (question.trim()) newAiGeneratedFields[`question_${index}`] = true;
      });
      
      setAiGeneratedFields(newAiGeneratedFields);
      setIsAIModalOpen(false);
      setAiPrompt('');
      
      // Move to the Design step after AI generation (now step 3 instead of 1)
      setCurrentStep(3);
    } catch (error) {
      console.error('Fetch error:', error);
      setAiError('Failed to connect to server. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only allow form submission from the last step (Review)
    if (currentStep !== steps.length - 1) {
      console.log("Form submission prevented: Not on the last step");
      return;
    }
    
    setLoadingModal({ isOpen: true, status: 'loading', error: null });

    // Validate required fields
    const requiredFields = {
      'Campaign Name': formData.name,
      'Campaign Title': formData.title,
      'Campaign Description': formData.description,
      'Campaign Category': formData.category
    };
    
    // Add subcategory validation if category is political
    if (formData.category === CATEGORIES.POLITICAL) {
      requiredFields['Representative Level'] = formData.subcategory;
    }
    
    // Check for empty required fields
    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || !value.trim())
      .map(([field]) => field);
    
    // Validate survey questions
    const hasValidQuestions = surveyQuestions.length > 0 && 
      surveyQuestions.every(q => q.question && q.question.trim());
    
    if (emptyFields.length > 0 || !hasValidQuestions) {
      let errorMessage = 'Please fill in the following required fields: ';
      
      if (emptyFields.length > 0) {
        errorMessage += emptyFields.join(', ');
      }
      
      if (!hasValidQuestions) {
        errorMessage += emptyFields.length > 0 ? ', and add at least one valid survey question' : 'Add at least one valid survey question';
      }
      
      setLoadingModal({ isOpen: true, status: 'error', error: errorMessage });
      return;
    }
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      
      // Get custom colors if the theme is 'custom'
      const customColors = selectedTheme === 'custom' ? {
        gradientColors,
        gradientDirection,
        textColor: hexText
      } : null;
      
      // Validate category and subcategory
      const category = formData.category;
      let subcategory = formData.subcategory;
      
      if (!isValidCategory(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      // If subcategory is provided, validate it
      if (subcategory && !isValidSubcategory(category, subcategory)) {
        console.warn(`Invalid subcategory ${subcategory} for category ${category}, defaulting to null`);
        subcategory = null;
      }
      
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          title: formData.title,
          description: formData.description,
          category: category,
          theme: selectedTheme,
          customColors: customColors,
          campaignImage: previewImage,
          subcategory: subcategory,
          surveyQuestions: surveyQuestions.map(q => q.question),
          hasExplainerVideo: hasExplainerVideo,
          explainerVideo: explainerVideo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create campaign. Please try again.');
      }

      // Clear form cache after successful submission
      clearFormCache();

      const campaign = await response.json();
      setLoadingModal({ 
        isOpen: true, 
        status: 'success', 
        error: null,
        campaignId: campaign.id,
        campaignName: formData.title
      });
      
      // Reset form state
      updateFormData({
        name: '',
        title: '',
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
      setCurrentStep(0);
      setAiGeneratedFields({});
    } catch (err) {
      console.error('Error creating campaign:', err);
      setLoadingModal({ isOpen: true, status: 'error', error: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // New function to handle using a campaign as template
  const handleUseTemplate = () => {
    setIsTemplateModalOpen(true);
  };

  // New function to handle template selection
  const handleSelectTemplate = (campaignData) => {
    // Keep the current name (or empty string) but copy everything else
    const currentName = formData.name;
    
    updateFormData({
      name: currentName, // Keep the current name
      title: campaignData.title || '',
      description: campaignData.description || '',
      category: campaignData.category || '',
      subcategory: campaignData.subcategory || '',
      businessName: campaignData.businessName || '',
      website: campaignData.website || '',
      email: campaignData.email || '',
      phone: campaignData.phone || ''
    });
    
    // Set theme if available
    if (campaignData.theme) {
      setSelectedTheme(campaignData.theme);
    }
    
    // Set custom colors if available
    if (campaignData.customColors) {
      setGradientColors(campaignData.customColors.gradientColors || {
        from: '#1a365d',
        via: '#3182ce',
        to: '#2c5282'
      });
      setGradientDirection(campaignData.customColors.gradientDirection || 'br');
      setHexText(campaignData.customColors.textColor || '#ffffff');
    }
    
    // Set campaign image if available
    if (campaignData.campaignImage) {
      setPreviewImage(campaignData.campaignImage);
    }
    
    // Set survey questions if available
    if (campaignData.surveyQuestions && Array.isArray(campaignData.surveyQuestions)) {
      setSurveyQuestions(campaignData.surveyQuestions.map((question, index) => ({
        id: index + 1,
        question
      })));
    }
    
    // Set the current step to the design step (now step 3)
    setCurrentStep(3);
    
    // Show success message
    setError({
      type: 'success',
      message: 'Campaign template applied successfully! Please enter a new name for this campaign.'
    });
    setTimeout(() => setError(null), 3000);
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
            selectedDraftId={selectedDraftId}
            setIsEditingDraft={setIsEditingDraft}
            isDeletingDraft={isDeletingDraft}
          />

          {/* Delete message display */}
          {deleteMessage && (
            <div role="alert" className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              deleteMessage.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400'
            }`}>
              {deleteMessage.type === 'success' ? (
                <svg className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <X className="h-4 w-4" />
              )}
              {deleteMessage.message}
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start ${!showPreview ? 'w-full' : ''}`}>
          <Card className="w-full">
            <CardContent>
              <form onSubmit={(e) => {
                // Only allow form submission from the last step (Review)
                if (currentStep !== steps.length - 1) {
                  e.preventDefault();
                  return;
                }
                handleSubmit(e);
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
                    handleAddQuestion={handleAddQuestion}
                    handleRemoveQuestion={handleRemoveQuestion}
                    handleQuestionChange={handleQuestionChange}
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
                    onUseTemplate={handleUseTemplate}
                  />
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
            currentStep={currentStep}
            gradientColors={gradientColors}
            gradientDirection={gradientDirection}
            hexText={hexText}
            hasExplainerVideo={hasExplainerVideo}
            explainerVideo={explainerVideo}
          />
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Shout. All rights reserved.
      </div>
      
      <LoadingModal
        isOpen={loadingModal.isOpen}
        status={loadingModal.status}
        error={loadingModal.error}
        campaignId={loadingModal.campaignId}
        campaignName={loadingModal.campaignName}
        onClose={() => setLoadingModal({ ...loadingModal, isOpen: false })}
      />

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

      <CampaignTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}