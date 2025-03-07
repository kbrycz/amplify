import React from 'react';
import { Plus } from 'lucide-react';

export default function DashboardHeader({ firstName, isNewUser, onManageCampaigns, onNewCampaign }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {isNewUser ? `Welcome, ${firstName}!` : `Welcome back, ${firstName}!`}
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Here's an overview of your account and campaign metrics.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onManageCampaigns}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Manage Campaigns
        </button>
        <button
          onClick={onNewCampaign}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:scale-105 dark:hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>
    </div>
  );
}