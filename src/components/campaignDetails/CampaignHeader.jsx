import React from 'react';
import { ArrowLeft, Settings, Share2 } from 'lucide-react';

export default function CampaignHeader({ campaign, navigate, openShareModal }) {
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{campaign.name}</h1>
        
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