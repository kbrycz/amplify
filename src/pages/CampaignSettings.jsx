import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { PhonePreview } from '../components/create-campaign/preview/PhonePreview';
import CampaignSettingsHeader from '../components/campaignSettings/CampaignSettingsHeader';
import CampaignSettingsForm from '../components/campaignSettings/CampaignSettingsForm';
import { useNamespace } from '../context/NamespaceContext';

export default function CampaignSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get the current namespace from context
  const { currentNamespace, namespaces, userPermission } = useNamespace();
  
  // Find the current namespace ID
  const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
  const currentNamespaceId = currentNamespaceObj?.id;
  
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Add missing state variables for gradient and text colors
  const [gradientColors, setGradientColors] = useState({
    from: '#4F46E5',
    via: '#7C3AED',
    to: '#DB2777'
  });
  const [gradientDirection, setGradientDirection] = useState('br');
  const [hexText, setHexText] = useState('#FFFFFF');

  useEffect(() => {
    if (currentNamespaceId) {
      fetchCampaign();
    } else {
      setError('No namespace selected. Please select a namespace to view campaign settings.');
      setIsLoading(false);
    }
  }, [id, currentNamespaceId]);

  const fetchCampaign = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      console.log(`Fetching campaign settings for ID: ${id} with namespace: ${currentNamespaceId}`);
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${id}?namespaceId=${currentNamespaceId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        if (response.status === 403 && errorData.error && errorData.error.includes('Forbidden')) {
          throw new Error('Forbidden: Campaign does not belong to this namespace');
        } else if (response.status === 404) {
          throw new Error('Campaign not found');
        }
        throw new Error(errorData.error || 'Failed to fetch campaign');
      }
      const data = await response.json();
      setCampaign(data);
      setSelectedTheme(data.theme || 'sunset');
      setSurveyQuestions(
        data.surveyQuestions?.map((q, i) => ({ id: i + 1, question: q })) || []
      );
      setPreviewImage(data.previewImage);
      
      // Set gradient colors and direction if available in the campaign data
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

  const handleAddQuestion = () => {
    setSurveyQuestions([
      ...surveyQuestions,
      { id: surveyQuestions.length + 1, question: '' }
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    setSurveyQuestions(surveyQuestions.filter(q => q.id !== questionId));
  };

  const handleQuestionChange = (questionId, value) => {
    setSurveyQuestions(
      surveyQuestions.map(q =>
        q.id === questionId ? { ...q, question: value } : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage('');
      
      // Prepare the survey questions in the format expected by the API
      const formattedQuestions = surveyQuestions.map(q => q.question);
      
      // Prepare the custom colors data
      const customColors = {
        gradientColors,
        gradientDirection,
        hexText
      };
      
      // Prepare the update data
      const updateData = {
        name: campaign.name,
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        subcategory: campaign.subcategory,
        theme: selectedTheme,
        surveyQuestions: formattedQuestions,
        customColors: JSON.stringify(customColors)
      };
      
      // Send the update request
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${id}?namespaceId=${currentNamespaceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update campaign');
      }
      
      // Update was successful
      setSuccessMessage('Campaign settings saved successfully');
      
      // Refresh the campaign data
      fetchCampaign();
    } catch (err) {
      console.error('Error saving campaign settings:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const idToken = await auth.currentUser.getIdToken();
      // Immediately navigate away—don't wait for the response.
      navigate('/app/campaigns');
      await fetch(`${SERVER_URL}/campaign/campaigns/${id}?namespaceId=${currentNamespaceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error deleting campaign:', err);
      // Already navigated away—no need to set error state.
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading campaign settings..." />;
  }

  // Create a unified error/not found component with better styling
  if (error || !campaign) {
    const isForbiddenError = error && (error.includes('Forbidden') || error.includes('does not belong to this namespace'));
    const isNotFoundError = !campaign || error?.includes('not found');
    
    let title, message;
    
    if (isForbiddenError) {
      title = "Campaign Not Available";
      message = "This campaign is not available in your current namespace. It may belong to a different namespace or workspace.";
    } else if (isNotFoundError) {
      title = "Campaign Not Found";
      message = "The campaign you're looking for doesn't exist or has been deleted.";
    } else {
      title = "Something Went Wrong";
      message = "We encountered an error while trying to load this campaign. Please try again later.";
    }
    
    return (
      <div className="p-6 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="rounded-full bg-amber-100 p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6 dark:bg-amber-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {message}
            </p>
            
            {error && !isForbiddenError && !isNotFoundError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-left text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
                <p className="font-medium mb-1">Error details:</p>
                <p>{error}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/app/campaigns')}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                View All Campaigns
              </button>
              <button
                onClick={() => navigate('/app/campaigns/new')}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Create New Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CampaignSettingsHeader
        id={id}
        campaignName={campaign?.name}
        navigate={navigate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-6 items-start">
        <CampaignSettingsForm
          campaign={campaign}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
          isDeleting={isDeleting}
          successMessage={successMessage}
          error={error}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          surveyQuestions={surveyQuestions}
          handleAddQuestion={handleAddQuestion}
          handleRemoveQuestion={handleRemoveQuestion}
          handleQuestionChange={handleQuestionChange}
          setIsHelpOpen={setIsHelpOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          currentNamespace={currentNamespace}
          userPermission={userPermission}
        />
        <PhonePreview
          selectedTheme={selectedTheme}
          previewImage={previewImage}
          formData={campaign}
          surveyQuestions={surveyQuestions}
          currentStep={3}
          gradientColors={gradientColors}
          gradientDirection={gradientDirection}
          hexText={hexText}
          themes={[]} // Pass an empty array or fetch themes if available
        />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign?.name}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmButtonText="Delete Campaign"
      />

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}