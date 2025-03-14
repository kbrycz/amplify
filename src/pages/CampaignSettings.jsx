import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSettingsForm } from '../hooks/useSettingsForm';
import { SettingsFormContainer } from '../components/campaignSettings/components/SettingsFormContainer';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/ui/toast-notification';
import { useNamespace } from '../context/NamespaceContext';
import { get } from '../lib/api'; // Import the get function from your API utilities
import { PhonePreview } from '../components/create-campaign/preview/PhonePreview';
import { themes } from '../components/create-campaign/utils/campaignThemes';
import { Button } from '../components/ui/button';

// Map the original step indices to the new ones (skipping category and subcategory)
const mapStepIndex = (originalIndex) => {
  // Original steps: 0=Internal, 1=Category, 2=Subcategory, 3=Design, 4=BasicInfo, 5=Details, 6=Review
  // New steps: 0=Internal, 1=Design, 2=BasicInfo, 3=Details, 4=Review
  const mapping = {
    0: 0, // Internal Name -> Internal Name
    1: 1, // Category -> Design (skip)
    2: 1, // Subcategory -> Design (skip)
    3: 1, // Design -> Design
    4: 2, // BasicInfo -> BasicInfo
    5: 3, // Details -> Details
    6: 4  // Review -> Review
  };
  return mapping[originalIndex] || 0;
};

// Total number of steps in the settings flow (reduced by 2 for category and subcategory)
const TOTAL_STEPS = 5;

export default function CampaignSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get campaign ID from URL path parameter
  const { addToast } = useToast();
  const { currentNamespace, namespaces } = useNamespace();
  const [campaignData, setCampaignData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchAttempted, setFetchAttempted] = useState(false); // Track if we've attempted to fetch

  const campaignId = id; // Use the ID from URL path parameter
  
  // Get the current namespace ID
  const getCurrentNamespaceId = () => {
    if (!namespaces || namespaces.length === 0) return null;
    const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
    return currentNamespaceObj?.id || null;
  };
  
  const namespaceId = getCurrentNamespaceId();

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!campaignId) {
        setIsLoading(false);
        setError('Campaign ID is required');
        return;
      }
      
      if (!namespaceId) {
        setIsLoading(false);
        setError('Namespace ID is required');
        return;
      }

      // Prevent multiple fetch attempts
      if (fetchAttempted) return;
      setFetchAttempted(true);

      try {
        // Use the get utility function instead of fetch directly
        // Include namespaceId as a query parameter
        const data = await get(`/campaign/campaigns/${campaignId}?namespaceId=${namespaceId}`);
        
        if (data) {
          setCampaignData(data);
        } else {
          throw new Error('Campaign not found');
        }
      } catch (err) {
        console.error('Error fetching campaign data:', err);
        setError(err.message || 'An error occurred while fetching campaign data');
        addToast(err.message || 'Failed to load campaign data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentNamespace && namespaceId && !fetchAttempted) {
      fetchCampaignData();
    }
  }, [campaignId, currentNamespace, namespaceId, addToast, fetchAttempted]);

  // Initialize form with campaign data
  const settingsForm = useSettingsForm(campaignData);

  // Check if user has permission to edit - for UI purposes only
  const canEdit = campaignData?.userPermission === 'admin' || campaignData?.userPermission === 'read/write';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading campaign data...</p>
      </div>
    );
  }

  if (error || !campaignData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Error</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error || 'Campaign not found'}</p>
        <button
          onClick={() => navigate('/app/campaigns')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  // Map the current step to the new step index for progress calculation
  const mappedStep = mapStepIndex(settingsForm.currentStep);
  const progressPercentage = ((mappedStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => navigate(`/app/campaigns/${campaignId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Campaign
            </Button>
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Campaign</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            Update your campaign settings and customize your survey questions.
          </p>
          
          <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4">
            <div
              className="absolute inset-y-0 left-0 bg-primary-600 dark:bg-primary-400 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-6 items-start">
          <SettingsFormContainer
            {...settingsForm}
            campaignId={campaignId}
            namespaceId={namespaceId}
            readOnly={!canEdit}
          />

          {settingsForm.showPreview && (
            <PhonePreview
              selectedTheme={settingsForm.selectedTheme}
              themes={themes}
              previewImage={settingsForm.previewImage}
              formData={settingsForm.formData}
              surveyQuestions={settingsForm.surveyQuestions}
              currentStep={settingsForm.currentStep}
              gradientColors={settingsForm.gradientColors}
              gradientDirection={settingsForm.gradientDirection}
              hexText={settingsForm.hexText}
              hasExplainerVideo={settingsForm.hasExplainerVideo}
              explainerVideo={settingsForm.explainerVideo}
            />
          )}
        </div>
      </div>
    </div>
  );
}