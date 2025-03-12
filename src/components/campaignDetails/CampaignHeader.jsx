import React from 'react';
import { ArrowLeft, Settings, Share2, Shield } from 'lucide-react';

export default function CampaignHeader({ campaign, navigate, openShareModal, userPermission }) {
  // Helper function to display permission in a user-friendly way
  const formatPermission = (permission) => {
    if (!permission) return 'No Access';
    
    switch(permission) {
      case 'admin':
        return 'Admin (Full Access)';
      case 'read/write':
        return 'Editor (Read/Write)';
      case 'readonly':
        return 'Viewer (Read Only)';
      default:
        return permission;
    }
  };

  return (
    <>
      <button
        onClick={() => navigate('/app/campaigns')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaigns
      </button>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{campaign.name}</h1>
          {userPermission && (
            <div className="mt-1 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Your access: <span className="text-indigo-600 dark:text-indigo-400">{formatPermission(userPermission)}</span>
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate(`/app/campaigns/${campaign.id}/settings`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button 
            onClick={openShareModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </>
  );
}