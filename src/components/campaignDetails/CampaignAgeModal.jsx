import React from 'react';
import { X, Calendar, Clock, User, RefreshCw } from 'lucide-react';

export default function CampaignAgeModal({ campaign, onClose, currentNamespaceId }) {
  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const seconds = timestamp._seconds || timestamp.seconds;
    if (!seconds) return 'N/A';
    
    const date = new Date(seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Helper function to get creator/updater name
  const getPersonName = (nameField) => {
    if (!nameField) return 'Unknown';
    return nameField;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Campaign Timeline
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Details about when this campaign was created and last updated.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary-100 p-1.5 dark:bg-primary-900/50">
                <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Created</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(campaign.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/50">
                <RefreshCw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(campaign.dateModified)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 dark:bg-green-900/50">
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Created By</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getPersonName(campaign.createdByName)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/50">
                <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Last Updated By</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getPersonName(campaign.lastUpdatedByName)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 