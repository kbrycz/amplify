import React, { useState, useEffect } from 'react';
import { X, FileText, Check, Loader2, Clock, FolderX, User } from 'lucide-react';
import { SERVER_URL, auth } from '../../../lib/firebase';
import { useNamespace } from '../../../context/NamespaceContext';

export function CampaignTemplateModal({ isOpen, onClose, onSelectTemplate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  
  // Get the current namespace from context
  const { namespaces, currentNamespace } = useNamespace();
  
  // Find the current namespace ID
  const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
  const currentNamespaceId = currentNamespaceObj?.id;

  useEffect(() => {
    if (isOpen) {
      fetchCampaigns();
    }
  }, [isOpen, currentNamespaceId]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    
    if (!currentNamespaceId) {
      setError('No namespace selected. Please select a namespace to view templates.');
      setIsLoading(false);
      return;
    }
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns?namespaceId=${currentNamespaceId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaignId(campaignId);
  };

  const handleUseTemplate = () => {
    if (!selectedCampaignId) return;
    
    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
    if (selectedCampaign) {
      onSelectTemplate(selectedCampaign);
      onClose();
    }
  };

  // Format date to a readable format
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      // Handle Firestore timestamps
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return new Date(timestamp.toDate()).toLocaleDateString();
      }
      
      // Handle regular dates or timestamps
      return new Date(timestamp).toLocaleDateString();
    } catch (err) {
      return 'Unknown date';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Use Campaign as Template</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary-text-600 dark:text-primary-text-400" />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading campaigns...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <FolderX className="h-10 w-10 text-red-500 dark:text-red-400" />
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={fetchCampaigns}
                className="mt-3 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                Try Again
              </button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <FolderX className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No campaigns found in this namespace.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a campaign to use as a template for your new campaign. This will copy the design, questions, and other settings.
              </p>
              
              {campaigns.map(campaign => (
                <div 
                  key={campaign.id}
                  onClick={() => handleSelectCampaign(campaign.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCampaignId === campaign.id 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700' 
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <FileText className="h-5 w-5 text-primary-text-600 dark:text-primary-text-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{campaign.description}</p>
                      </div>
                    </div>
                    {selectedCampaignId === campaign.id && (
                      <Check className="h-5 w-5 text-primary-text-600 dark:text-primary-text-400" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {formatDate(campaign.dateModified)}
                      </span>
                    </div>
                    {campaign.createdByName && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3 mr-1" />
                        <span>Created by: {campaign.createdByName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUseTemplate}
            disabled={!selectedCampaignId || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
} 