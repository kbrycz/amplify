import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { CampaignDetailsSkeleton } from '../components/ui/skeleton';
import { ShareModal } from '../components/ui/share-modal';
import CampaignHeader from '../components/campaignDetails/CampaignHeader';
import CampaignInfo from '../components/campaignDetails/CampaignInfo';
import CampaignMetrics from '../components/campaignDetails/CampaignMetrics';
import CampaignCharts from '../components/campaignDetails/CampaignCharts';

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    responses: 0,
    videos: 0,
    audience: 0,
    avgResponseTime: 0,
  });
  
  useEffect(() => {
    fetchCampaignData();
  }, [id]);
  
  const fetchCampaignData = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }
      
      const data = await response.json();
      setCampaign(data);
      
      // Set metrics using counts included in campaign data (or fallback values)
      setMetrics({
        videos: data.aiVideoCount || 0,
        responses: data.responsesCount || 0,
        audience: data.audience || Math.floor(Math.random() * 5000) + 1000,
        avgResponseTime: data.avgResponseTime || Math.floor(Math.random() * 60) + 30,
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <CampaignDetailsSkeleton />;
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaign not found</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The campaign you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <CampaignHeader
        campaign={campaign}
        navigate={navigate}
        openShareModal={() => setIsShareModalOpen(true)}
      />
      
      <CampaignInfo campaign={campaign} />
      
      <CampaignMetrics metrics={metrics} campaignId={id} navigate={navigate} />
      
      <CampaignCharts />
      
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        campaignId={campaign.id}
        campaignName={campaign.name}
      />
    </div>
  );
}