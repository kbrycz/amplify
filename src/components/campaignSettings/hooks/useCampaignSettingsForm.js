import { useState, useEffect } from 'react';
import { SERVER_URL, auth } from '../../../lib/firebase';

export const useCampaignSettingsForm = (campaignId, currentNamespaceId) => {
  // Form state
  const [formData, setFormData] = useState({
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
  
  const [surveyQuestions, setSurveyQuestions] = useState([]);
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
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch campaign data
  useEffect(() => {
    if (campaignId && currentNamespaceId) {
      fetchCampaign();
    } else if (!currentNamespaceId) {
      setError('No namespace selected. Please select a namespace to view campaign settings.');
      setIsLoading(false);
    }
  }, [campaignId, currentNamespaceId]);

  const fetchCampaign = async () => {
    try {
      setIsLoading(true);
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaigns/${campaignId}?namespaceId=${currentNamespaceId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 && errorData.error && errorData.error.includes('Forbidden')) {
          throw new Error('Forbidden: Campaign does not belong to this namespace');
        } else if (response.status === 404) {
          throw new Error('Campaign not found');
        }
        throw new Error(errorData.error || 'Failed to fetch campaign');
      }
      
      const data = await response.json();
      
      // Update form data
      setFormData({
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        category: data.category || '',
        subcategory: data.subcategory || '',
        businessName: data.businessName || '',
        website: data.website || '',
        email: data.email || '',
        phone: data.phone || ''
      });
      
      // Update theme data
      setSelectedTheme(data.theme || 'sunset');
      setPreviewImage(data.previewImage);
      setHasExplainerVideo(Boolean(data.hasExplainerVideo));
      setExplainerVideo(data.explainerVideo || null);
      
      // Update survey questions
      setSurveyQuestions(
        data.surveyQuestions?.map((q, i) => ({ id: i + 1, question: q })) || []
      );
      
      // Set gradient colors and direction if available
      if (data.customColors) {
        try {
          const customColors = typeof data.customColors === 'string' 
            ? JSON.parse(data.customColors) 
            : data.customColors;
            
          if (customColors.gradientColors) {
            setGradientColors(customColors.gradientColors);
          }
          if (customColors.gradientDirection) {
            setGradientDirection(customColors.gradientDirection);
          }
          if (customColors.hexText) {
            setHexText(customColors.hexText);
          }
        } catch (e) {
          console.error('Error parsing custom colors:', e);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
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

  const handleNext = () => {
    if (currentStep < 4) { // 4 is the last step index
      setCurrentStep(currentStep + 1);
      setShowPreview(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowPreview(true);
    }
  };

  return {
    formData,
    updateFormData,
    surveyQuestions,
    setSurveyQuestions,
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
    isLoading,
    setIsLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    handleInputChange,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleImageChange,
    handleRemoveImage,
    handleNext,
    handlePrevious,
    fetchCampaign
  };
}; 