import { useState } from 'react';
import { CATEGORIES } from '../../../lib/categoryEnums';
import { useFormCache } from '../../../hooks/useFormCache';

export const useCampaignForm = () => {
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
  
  // Form state
  const [formData, updateFormData, clearFormCache] = useFormCache(initialFormData);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [aiGeneratedFields, setAiGeneratedFields] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [hasExplainerVideo, setHasExplainerVideo] = useState(false);
  const [explainerVideo, setExplainerVideo] = useState(null);
  
  // Theme state
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [gradientColors, setGradientColors] = useState({
    from: '#1a365d',
    via: '#3182ce',
    to: '#2c5282'
  });
  const [gradientDirection, setGradientDirection] = useState('br'); // br = bottom-right
  const [hexText, setHexText] = useState('#ffffff');
  
  // Step navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  
  // Input handlers
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

  const handleImageChange = (e, setError) => {
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

  const handleNext = (e) => {
    // Prevent form submission if an event is passed
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (currentStep < 6) { // 6 is the last step index
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

  const resetForm = () => {
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
  };

  return {
    formData,
    updateFormData,
    clearFormCache,
    surveyQuestions,
    setSurveyQuestions,
    aiGeneratedFields,
    setAiGeneratedFields,
    previewImage,
    setPreviewImage,
    hasExplainerVideo,
    setHasExplainerVideo,
    explainerVideo,
    setExplainerVideo,
    selectedTheme,
    setSelectedTheme,
    gradientColors,
    setGradientColors,
    gradientDirection,
    setGradientDirection,
    hexText,
    setHexText,
    currentStep,
    setCurrentStep,
    showPreview,
    setShowPreview,
    handleInputChange,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleImageChange,
    handleRemoveImage,
    handleNext,
    handlePrevious,
    resetForm
  };
}; 