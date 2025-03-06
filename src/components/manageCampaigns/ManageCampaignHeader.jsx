import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, X, ChevronRight } from 'lucide-react';

export default function ManageCampaignHeader({ 
  isEditMode, 
  onToggleEdit, 
  onNewCampaign,
  hasCampaigns 
}) {
  return (
    <div className="mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Manage Campaigns
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create and manage your marketing campaigns
        </p>
      </div>
      {hasCampaigns && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleEdit}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
          >
            {isEditMode ? (
              <>
                <X className="h-4 w-4" />
                Done Editing
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                Edit Campaigns
              </>
            )}
          </button>
          <button
            onClick={onNewCampaign}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      )}
    </div>
  );
}