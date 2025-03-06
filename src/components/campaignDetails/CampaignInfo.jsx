import React from 'react';

export default function CampaignInfo({ campaign }) {
  // Only render if title or description exists
  if (!campaign.title && !campaign.description) {
    return null;
  }
  
  return (
    <div className="my-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row md:gap-8">
          {campaign.title && (
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Title</h2>
              <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{campaign.title}</p>
            </div>
          )}
          
          {campaign.description && (
            <div className="flex-1 mt-3 md:mt-0">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Description</h2>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{campaign.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}