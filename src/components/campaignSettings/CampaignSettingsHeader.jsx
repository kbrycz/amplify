import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function CampaignSettingsHeader({ id, campaignName, navigate }) {
  return (
    <>
      <button
        onClick={() => navigate(`/app/campaigns/${id}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </button>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Campaign Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure settings for {campaignName}
        </p>
      </div>
    </>
  );
}