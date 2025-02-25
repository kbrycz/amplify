import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, CheckCircle, Clock, CreditCard, Film, FolderOpen } from 'lucide-react';
import { MetricCard } from '../components/ui/metric-card';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Campaign Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Track and manage your campaign responses</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/campaigns/new')}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Create Campaign
            </button>
            <button
              onClick={() => navigate('/campaigns')}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Manage Campaigns
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Account Overview</h2>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your account status at a glance</p>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Unused Credits"
          value={2500}
          icon={CreditCard}
          onClick={() => console.log('Credits clicked')}
        />
        <MetricCard
          title="Total Campaigns"
          value={15}
          icon={FolderOpen}
          onClick={() => console.log('Campaigns clicked')}
        />
        <MetricCard
          title="Videos Generated"
          value={347}
          icon={Film}
          onClick={() => console.log('Videos clicked')}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Your Recent Campaign</h2>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Boys and Girls Club</p>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Responses Unread"
          value={42}
          icon={Inbox}
          onClick={() => console.log('Responses Unread clicked')}
        />
        <MetricCard
          title="Responses Collected"
          value={1234}
          icon={CheckCircle}
          onClick={() => console.log('Responses Collected clicked')}
        />
        <MetricCard
          title="Responses Waiting"
          value={89}
          icon={Clock}
          onClick={() => console.log('Responses Waiting clicked')}
        />
      </div>
    </div>
  );
}