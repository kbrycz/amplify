import { useState, useEffect } from 'react';
import { useToast } from '../components/ui/toast-notification';
import { useNavigate } from 'react-router-dom';
import { useNamespace } from '../context/NamespaceContext';

export const useSettingsForm = (campaignData) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentNamespace, userPermission } = useNamespace();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    businessName: '',
    website: '',
    email: '',
    phone: '',
    notificationsEnabled: false,
  });
  
  // Campaign details state
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('primary');
  const [hasExplainerVideo, setHasExplainerVideo] = useState(false);
  const [explainerVideo, setExplainerVideo] = useState(null);
  
  // Theme customization state
  const [gradientColors, setGradientColors] = useState({
    from: '#3b82f6',
    via: '#1d4ed8',
    to: '#1e40af'
  });
  const [gradientDirection, setGradientDirection] = useState('right');
  const [hexText, setHexText] = useState('#ffffff');
  
  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [error, setError] = useState(null);
  
  // Available themes
  const themes = {
    primary: {
      name: 'primary',
      colors: ['#3b82f6', '#1d4ed8', '#1e40af'],
      gradient: true,
      direction: 'right'
    },
    green: {
      name: 'Green',
      colors: ['#10b981', '#059669', '#047857'],
      gradient: true,
      direction: 'right'
    },
    purple: {
      name: 'Purple',
      colors: ['#8b5cf6', '#7c3aed', '#6d28d9'],
      gradient: true,
      direction: 'right'
    },
    orange: {
      name: 'Orange',
      colors: ['#f97316', '#ea580c', '#c2410c'],
      gradient: true,
      direction: 'right'
    },
    red: {
      name: 'Red',
      colors: ['#ef4444', '#dc2626', '#b91c1c'],
      gradient: true,
      direction: 'right'
    },
    gray: {
      name: 'Gray',
      colors: ['#6b7280', '#4b5563', '#374151'],
      gradient: true,
      direction: 'right'
    },
    custom: {
      name: 'Custom',
      colors: ['#3b82f6', '#8b5cf6', '#ef4444'],
      gradient: true,
      direction: 'right'
    }
  };

  // Initialize form with campaign data if available
  useEffect(() => {
    if (campaignData) {
      // Set basic form data
      setFormData({
        name: campaignData.name || '',
        title: campaignData.title || '',
        description: campaignData.description || '',
        businessName: campaignData.businessName || '',
        website: campaignData.website || '',
        email: campaignData.email || '',
        phone: campaignData.phone || '',
        notificationsEnabled: campaignData.notificationsEnabled || false,
      });
      
      // Set survey questions
      if (campaignData.surveyQuestions && campaignData.surveyQuestions.length > 0) {
        setSurveyQuestions(
          campaignData.surveyQuestions.map(q => ({
            id: q.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
            question: q.question || ''
          }))
        );
      }
      
      // Set preview image
      if (campaignData.imageUrl) {
        setPreviewImage(campaignData.imageUrl);
      }
      
      // Set theme
      if (campaignData.theme) {
        setSelectedTheme(campaignData.theme);
        
        // If custom theme, update theme colors and direction
        if (campaignData.theme === 'custom' && campaignData.themeColors) {
          themes.custom.colors = campaignData.themeColors;
          themes.custom.direction = campaignData.themeDirection || 'right';
          
          // Set gradient colors
          if (campaignData.themeColors.length >= 3) {
            setGradientColors({
              from: campaignData.themeColors[0],
              via: campaignData.themeColors[1],
              to: campaignData.themeColors[2]
            });
          }
          
          // Set gradient direction
          if (campaignData.themeDirection) {
            setGradientDirection(campaignData.themeDirection);
          }
          
          // Set text color if available
          if (campaignData.textColor) {
            setHexText(campaignData.textColor);
          }
        }
      }
      
      // Set explainer video
      if (campaignData.explainerVideo) {
        setHasExplainerVideo(true);
        setExplainerVideo(campaignData.explainerVideo);
      }
    }
  }, [campaignData]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form data
      if (!formData.name || !formData.title) {
        setError('Campaign name and title are required');
        setCurrentStep(1);
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for API
      const updateData = {
        ...formData,
        theme: selectedTheme,
        themeColors: selectedTheme === 'custom' ? themes.custom.colors : undefined,
        themeDirection: selectedTheme === 'custom' ? themes.custom.direction : undefined,
        surveyQuestions: surveyQuestions.filter(q => q.question && q.question.trim() !== ''),
        hasExplainerVideo,
        explainerVideo: hasExplainerVideo ? explainerVideo : null,
        namespaceId: currentNamespace,
      };
      
      // Add image if available
      if (previewImage && previewImage.startsWith('data:')) {
        updateData.image = previewImage;
      }
      
      // Call API to update campaign
      const response = await fetch(`/api/campaigns/${campaignData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update campaign');
      }
      
      // Show success toast
      toast({
        title: 'Campaign updated',
        description: 'Your campaign has been successfully updated.',
        variant: 'success',
      });
      
      // Redirect to campaigns page
      navigate('/campaigns');
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(err.message || 'An error occurred while updating the campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle campaign deletion
  const handleDelete = async (campaignId) => {
    try {
      // Call API to delete campaign
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete campaign');
      }
      
      // Show success toast
      toast({
        title: 'Campaign deleted',
        description: 'Your campaign has been successfully deleted.',
        variant: 'success',
      });
      
      // Redirect to campaigns page
      navigate('/campaigns');
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError(err.message || 'An error occurred while deleting the campaign');
    }
  };

  return {
    formData,
    setFormData,
    surveyQuestions,
    setSurveyQuestions,
    previewImage,
    setPreviewImage,
    selectedTheme,
    setSelectedTheme,
    themes,
    hasExplainerVideo,
    setHasExplainerVideo,
    explainerVideo,
    setExplainerVideo,
    currentStep,
    setCurrentStep,
    isSubmitting,
    isSavingDraft,
    error,
    setError,
    handleSubmit,
    handleDelete,
    currentNamespace,
    userPermission,
    gradientColors,
    setGradientColors,
    gradientDirection,
    setGradientDirection,
    hexText,
    setHexText
  };
}; 