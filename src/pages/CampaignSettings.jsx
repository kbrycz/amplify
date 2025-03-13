import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSettingsForm } from '../hooks/useSettingsForm';
import { SettingsFormContainer } from '../components/campaignSettings/components/SettingsFormContainer';
import { PageHeader } from '../components/ui/page-header';
import { Loader2 } from 'lucide-react';
import { useToast } from '../components/ui/toast-notification';
import { useNamespace } from '../context/NamespaceContext';

export default function CampaignSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentNamespace, userPermission } = useNamespace();
  const [campaignData, setCampaignData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get campaign ID from URL
  const getCampaignId = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('id');
  };

  const campaignId = getCampaignId();

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!campaignId) {
        setIsLoading(false);
        setError('Campaign ID is required');
        return;
      }

      try {
        const response = await fetch(`/api/campaigns/${campaignId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaign data');
        }
        
        const data = await response.json();
        setCampaignData(data);
      } catch (err) {
        console.error('Error fetching campaign data:', err);
        setError(err.message || 'An error occurred while fetching campaign data');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load campaign data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentNamespace) {
      fetchCampaignData();
    }
  }, [campaignId, currentNamespace, toast]);

  // Initialize form with campaign data
  const settingsForm = useSettingsForm(campaignData);

  // Check if user has permission to edit
  const canEdit = userPermission === 'admin' || userPermission === 'read/write';

  // Redirect if no permission
  useEffect(() => {
    if (!isLoading && !canEdit) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to edit this campaign',
        variant: 'destructive',
      });
      navigate('/campaigns');
    }
  }, [isLoading, canEdit, navigate, toast]);

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
        />
      </div>
    </div>
  );
}