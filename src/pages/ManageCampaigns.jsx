import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import ManageCampaignHeader from '../components/manageCampaigns/ManageCampaignHeader';
import CampaignList from '../components/manageCampaigns/CampaignList';
import { useNamespace } from '../context/NamespaceContext';

export default function ManageCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get the current namespace from context
  const { currentNamespace, namespaces, userPermission, isLoading: namespacesLoading, fetchUserNamespaces } = useNamespace();
  
  // Find the current namespace ID
  const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
  const currentNamespaceId = currentNamespaceObj?.id;

  // Ensure namespaces are loaded when the component mounts
  useEffect(() => {
    if (namespaces.length === 0 && !namespacesLoading) {
      fetchUserNamespaces();
    }
  }, []);

  // Delay showing errors to prevent flashing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setShowError(true);
      }, 500); // Delay showing error by 500ms
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error]);

  // Mark when initial load is complete
  useEffect(() => {
    if (!namespacesLoading && !isLoading) {
      setInitialLoadComplete(true);
    }
  }, [namespacesLoading, isLoading]);

  useEffect(() => {
    // Only proceed if we're not still loading namespaces
    if (!namespacesLoading) {
      if (currentNamespaceId) {
        fetchCampaigns();
      } else if (namespaces.length > 0) {
        // Only show error if namespaces are loaded but none is selected
        setError('No namespace selected. Please select a namespace to view campaigns.');
        setIsLoading(false);
      } else if (namespaces.length === 0) {
        // If no namespaces exist at all
        setError('No namespaces available. Please create a namespace first.');
        setIsLoading(false);
      }
    }
  }, [currentNamespaceId, namespacesLoading, namespaces]);

  const fetchCampaigns = async () => {
    if (!currentNamespaceId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns?namespaceId=${currentNamespaceId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch campaigns');
      }
      
      const data = await response.json();
      setCampaigns(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${campaignId}?namespaceId=${currentNamespaceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          throw new Error(errorData.error || 'You do not have permission to delete this campaign. Admin access required.');
        } else {
          throw new Error(errorData.error || 'Failed to delete campaign');
        }
      }
      
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setSuccessMessage('Campaign deleted successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleUpdate = async (campaignId, formData) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${campaignId}?namespaceId=${currentNamespaceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403) {
          throw new Error(errorData.error || 'You do not have permission to update this campaign.');
        } else {
          throw new Error(errorData.error || 'Failed to update campaign');
        }
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
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
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
      
      {/* Namespace warning - only show after initial load and with a delay */}
      {!currentNamespaceId && !namespacesLoading && namespaces.length > 0 && initialLoadComplete && showError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400 dark:text-amber-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Namespace Required</h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>Please select a namespace to view and manage campaigns. Campaigns are shared within a namespace.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && showError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {error}
        </div>
      )}

      <ManageCampaignHeader
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
        onNewCampaign={() => navigate('/app/campaigns/new')}
        hasCampaigns={!isLoading && campaigns.length > 0}
        currentNamespace={currentNamespace}
      />

      {namespacesLoading || isLoading ? (
        <LoadingSpinner message={namespacesLoading ? "Loading namespaces..." : "Loading campaigns..."} />
      ) : (
        <CampaignList
          isLoading={isLoading}
          campaigns={campaigns}
          isEditMode={isEditMode}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onCampaignClick={(id) => navigate(`/app/campaigns/${id}`)}
          onNewCampaign={() => navigate('/app/campaigns/new')}
          currentNamespaceId={currentNamespaceId}
        />
      )}

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}