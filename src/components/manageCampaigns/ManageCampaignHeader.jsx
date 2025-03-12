import React from 'react';
import { Pencil, Building, Plus } from 'lucide-react';

export default function ManageCampaignHeader({ 
  isEditMode, 
  onToggleEdit, 
  onNewCampaign,
  hasCampaigns,
  currentNamespace
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Campaigns
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create and manage your marketing campaigns in one place.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          {hasCampaigns && (
            <button
              onClick={onToggleEdit}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors
                ${isEditMode
                  ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <Pencil className="h-4 w-4" />
              {isEditMode ? 'Done Editing' : 'Edit Campaigns'}
            </button>
          )}
          <button
            onClick={onNewCampaign}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}