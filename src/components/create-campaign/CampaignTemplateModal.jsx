import React, { useState, useEffect } from 'react';
import { X, FileText, Check, Loader2, Clock, FolderX } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';

export function CampaignTemplateModal({ isOpen, onClose, onSelectTemplate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCampaigns();
    }
  }, [isOpen]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
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

  const handleConfirmSelection = async () => {
    if (!selectedCampaignId) return;
    
    try {
      setIsLoading(true);
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${selectedCampaignId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign details');
      }

      const campaignData = await response.json();
      onSelectTemplate(campaignData);
      onClose();
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      setError('Failed to load campaign details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Format date to a readable format
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    // Parse the timestamp
    let date;
    if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'object' && (('seconds' in timestamp) || ('_seconds' in timestamp))) {
      const seconds = timestamp.seconds ?? timestamp._seconds;
      date = new Date(seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    // Return relative time
    return timeAgo(date);
  };

  // Returns a relative time string like "3 days ago", "2 hours ago", etc.
  const timeAgo = (date) => {
    if (!date || isNaN(date.getTime())) return 'N/A';

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 0) return 'N/A'; // future date?

    const intervals = [
      { label: 'year', secs: 31536000 },
      { label: 'month', secs: 2592000 },
      { label: 'week', secs: 604800 },
      { label: 'day', secs: 86400 },
      { label: 'hour', secs: 3600 },
      { label: 'minute', secs: 60 },
      { label: 'second', secs: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.secs);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] sm:w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-900 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Use Campaign as Template</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading campaigns...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          {!isLoading && !error && campaigns.length === 0 && (
            <div className="py-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-gray-100 p-3 mb-3 dark:bg-gray-800">
                  <FolderX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">No campaigns found</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  You don't have any campaigns yet to use as templates.
                </p>
              </div>
            </div>
          )}
          
          {!isLoading && !error && campaigns.length > 0 && (
            <>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Select a campaign to use as a template. This will copy all settings except the campaign name.
              </p>
            </>
          )}
        </div>
        
        {/* Scrollable container with visual indicators */}
        {!isLoading && !error && campaigns.length > 0 && (
          <div className="relative flex-1 min-h-0 px-6">
            {/* Scroll shadow indicators */}
            <div className="absolute top-0 left-6 right-10 h-4 bg-gradient-to-b from-white to-transparent dark:from-gray-900 z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-6 right-10 h-4 bg-gradient-to-t from-white to-transparent dark:from-gray-900 z-10 pointer-events-none"></div>
            
            {/* Scrollable content with lighter scrollbar */}
            <div className="overflow-y-auto max-h-[50vh] pr-4 space-y-3 py-3 
              scrollbar-thin 
              scrollbar-thumb-indigo-200 hover:scrollbar-thumb-indigo-300 
              dark:scrollbar-thumb-indigo-900/40 dark:hover:scrollbar-thumb-indigo-800/60 
              scrollbar-track-transparent">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`flex items-center gap-3 rounded-md p-3 cursor-pointer transition-colors border shadow-sm ${
                    selectedCampaignId === campaign.id
                      ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleSelectCampaign(campaign.id)}
                >
                  <div className="flex-shrink-0">
                    {selectedCampaignId === campaign.id ? (
                      <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {campaign.title || 'Untitled Campaign'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {campaign.name || 'No internal name'}
                    </p>
                    {campaign.dateModified && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>{formatDate(campaign.dateModified)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-6 pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedCampaignId || isLoading}
            className={`rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-600 ${
              (!selectedCampaignId || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Loading...
              </>
            ) : (
              'Use as Template'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 