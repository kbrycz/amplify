import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSettingsForm } from '../hooks/useSettingsForm';
import { SettingsFormContainer } from '../components/campaignSettings/components/SettingsFormContainer';
import { PageHeader } from '../components/ui/page-header';
import { Loader2 } from 'lucide-react';
import { useToast } from '../components/ui/toast-notification';
import { useNamespace } from '../context/NamespaceContext';
import { get } from '../lib/api'; // Import the get function from your API utilities

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
          onClick={() => navigate('/campaigns')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Campaign Settings"
        description="Update your campaign settings"
        backHref="/campaigns"
        backLabel="Back to Campaigns"
      />

      <div className="mt-8">
        <SettingsFormContainer
          {...settingsForm}
          campaignId={campaignId}
          namespaceId={namespaceId}
          readOnly={!canEdit}
        />
      </div>
    </div>
  );
}