import { useState, useEffect } from 'react';
import { useToast } from '../components/ui/toast-notification';
import { useNavigate } from 'react-router-dom';
import { useNamespace } from '../context/NamespaceContext';
import { useFormCache } from './useFormCache';
import { CATEGORIES } from '../lib/categoryEnums';

export const useSettingsForm = (campaignData) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentNamespace, userPermission } = useNamespace();
  
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
  
  // Populate form with campaign data when available
  useEffect(() => {
    if (campaignData) {
      // Update form data with campaign data
      updateFormData({
        name: campaignData.name || '',
        title: campaignData.title || '',
        description: campaignData.description || '',
        category: campaignData.category || '',
        subcategory: campaignData.subcategory || '',
        businessName: campaignData.businessName || '',
        website: campaignData.website || '',
        email: campaignData.email || '',
        phone: campaignData.phone || ''
      });
      
      // Set survey questions
      if (campaignData.surveyQuestions && campaignData.surveyQuestions.length > 0) {
        setSurveyQuestions(campaignData.surveyQuestions.map((q, index) => ({
          id: index + 1,
          question: typeof q === 'string' ? q : q.question || ''
        })));
      }
      
      // Set theme
      if (campaignData.theme) {
        setSelectedTheme(campaignData.theme);
      }
      
      // Set gradient colors if available
      if (campaignData.gradientColors) {
        setGradientColors(campaignData.gradientColors);
      }
      
      // Set gradient direction if available
      if (campaignData.gradientDirection) {
        setGradientDirection(campaignData.gradientDirection);
      }
      
      // Set text color if available
      if (campaignData.textColor) {
        setHexText(campaignData.textColor);
      }
      
      // Set preview image if available
      if (campaignData.imageUrl) {
        setPreviewImage(campaignData.imageUrl);
      }
      
      // Set explainer video if available
      if (campaignData.videoUrl) {
        setHasExplainerVideo(true);
        setExplainerVideo(campaignData.videoUrl);
      }
    }
  }, [campaignData, updateFormData]);
  
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
        if (setError) {
          setError({
            type: 'error',
            message: 'Image size should be less than 5MB'
          });
          setTimeout(() => setError(null), 3000);
        }
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
      // Skip category and subcategory steps in settings flow
      if (currentStep === 0) {
        // Skip directly to design step (step 3)
        setCurrentStep(3);
        setShowPreview(true);
        return;
      }
      
      // Normal case - go to next step
      setCurrentStep(currentStep + 1);
      // Always show preview
      setShowPreview(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // If going back from design step (step 3), go directly to internal name (step 0)
      if (currentStep === 3) {
        setCurrentStep(0);
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
    if (campaignData) {
      // Reset to original campaign data
      updateFormData({
        name: campaignData.name || '',
        title: campaignData.title || '',
        description: campaignData.description || '',
        category: campaignData.category || '',
        subcategory: campaignData.subcategory || '',
        businessName: campaignData.businessName || '',
        website: campaignData.website || '',
        email: campaignData.email || '',
        phone: campaignData.phone || ''
      });
      
      // Reset survey questions
      if (campaignData.surveyQuestions && campaignData.surveyQuestions.length > 0) {
        setSurveyQuestions(campaignData.surveyQuestions.map((q, index) => ({
          id: index + 1,
          question: typeof q === 'string' ? q : q.question || ''
        })));
      } else {
        setSurveyQuestions([]);
      }
      
      // Reset theme
      if (campaignData.theme) {
        setSelectedTheme(campaignData.theme);
      } else {
        setSelectedTheme('sunset');
      }
      
      // Reset gradient colors
      if (campaignData.gradientColors) {
        setGradientColors(campaignData.gradientColors);
      } else {
        setGradientColors({
          from: '#1a365d',
          via: '#3182ce',
          to: '#2c5282'
        });
      }
      
      // Reset gradient direction
      if (campaignData.gradientDirection) {
        setGradientDirection(campaignData.gradientDirection);
      } else {
        setGradientDirection('br');
      }
      
      // Reset text color
      if (campaignData.textColor) {
        setHexText(campaignData.textColor);
      } else {
        setHexText('#ffffff');
      }
      
      // Reset preview image
      if (campaignData.imageUrl) {
        setPreviewImage(campaignData.imageUrl);
      } else {
        setPreviewImage(null);
      }
      
      // Reset explainer video
      if (campaignData.videoUrl) {
        setHasExplainerVideo(true);
        setExplainerVideo(campaignData.videoUrl);
      } else {
        setHasExplainerVideo(false);
        setExplainerVideo(null);
      }
    } else {
      // If no campaign data, reset to initial state
      updateFormData(initialFormData);
      setSurveyQuestions([]);
      setPreviewImage(null);
      setCurrentStep(0);
      setAiGeneratedFields({});
    }
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
    resetForm,
    currentNamespace,
    userPermission
  };
}; 