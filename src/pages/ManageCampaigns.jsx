import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Plus, X, Pencil } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { EditCampaignModal } from '../components/ui/edit-campaign-modal';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import ManageCampaignHeader from '../components/manageCampaigns/ManageCampaignHeader';
import CampaignList from '../components/manageCampaigns/CampaignList';

export default function ManageCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete campaign');
      }
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setSuccessMessage('Campaign deleted successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Failed to delete campaign: ' + err.message);
    }
  };

  const handleUpdate = async (campaignId, formData) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update campaign');
      }
      const updatedCampaign = await response.json();
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((c) => (c.id === campaignId ? { ...c, ...updatedCampaign } : c))
      );
      setSuccessMessage('Campaign updated successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return updatedCampaign;
    } catch (err) {
      console.error('Error updating campaign:', err);
      throw err;
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {successMessage}
        </div>
      )}

      <ManageCampaignHeader
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
        onNewCampaign={() => navigate('/app/campaigns/new')}
        hasCampaigns={!isLoading && campaigns.length > 0}
      />

      {isLoading ? (
        <LoadingSpinner message="Loading campaigns..." />
      ) : error ? (
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
      ) : campaigns.length === 0 ? (
        // Render the empty state (same as in CampaignList)
        <CampaignList
          isLoading={isLoading}
          campaigns={campaigns}
          isEditMode={isEditMode}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onCampaignClick={(id) => navigate(`/app/campaigns/${id}`)}
          onNewCampaign={() => navigate('/app/campaigns/new')}
        />
      ) : (
        <CampaignList
          isLoading={isLoading}
          campaigns={campaigns}
          isEditMode={isEditMode}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onCampaignClick={(id) => navigate(`/app/campaigns/${id}`)}
          onNewCampaign={() => navigate('/app/campaigns/new')}
        />
      )}

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}