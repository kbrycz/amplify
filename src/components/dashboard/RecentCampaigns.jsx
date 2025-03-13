import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Inbox, Video, Plus, BarChart3, Users } from 'lucide-react';
import { RecentCampaignSkeleton } from '../ui/skeleton';

// Helper functions for date parsing and relative time.
function parseDate(val) {
  if (!val) return null;
  if (typeof val.toDate === 'function') {
    return val.toDate();
  }
  if (typeof val === 'object' && (('seconds' in val) || ('_seconds' in val))) {
    const seconds = val.seconds ?? val._seconds;
    return new Date(seconds * 1000);
  }
  const date = new Date(val);
  if (!isNaN(date.getTime())) {
    return date;
  }
  return null;
}

function timeAgo(date) {
  if (!date) return 'N/A';
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 0) return 'N/A';
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
}

export default function RecentCampaigns({
  isLoading,
  totalCampaigns,
  recentCampaigns,
  onViewAllCampaigns,
  onCampaignClick,
  onNewCampaign,
}) {
  // Add debugging logs
  console.log('RecentCampaigns props:', { 
    isLoading, 
    totalCampaigns, 
    recentCampaignsLength: recentCampaigns?.length,
    recentCampaigns
  });

  if (isLoading) {
    return <RecentCampaignSkeleton />;
  }

  // Check if we have recent campaigns to display, regardless of totalCampaigns count
  if (recentCampaigns && recentCampaigns.length > 0) {
    console.log('Rendering campaigns list with', recentCampaigns.length, 'campaigns');
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">Recent Campaigns</CardTitle>
              <CardDescription className="mt-2">
                Your most recently updated campaigns
              </CardDescription>
            </div>
            <Link
              to="/app/campaigns"
              onClick={onViewAllCampaigns}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all campaigns
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => {
              const modifiedDate = parseDate(campaign.dateModified || campaign.createdAt);
              const lastUpdateStr = timeAgo(modifiedDate);
              return (
                <div
                  key={campaign.id}
                  onClick={() => onCampaignClick(campaign.id)}
                  className="group flex flex-col sm:flex-row sm:items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer hover:border-gray-300 hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {campaign.name || 'Untitled Campaign'}
                      </h3>
                    </div>
                    {campaign.title && (
                      <div className="mt-1.5 flex items-center gap-2 max-w-md">
                        <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                          Title
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {campaign.title}
                        </span>
                      </div>
                    )}
                    <div className="mt-1.5 flex items-start gap-2">
                      <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                        Description
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {campaign.description || 'No description provided'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        <Clock className="h-4 w-4" />
                        <span>{lastUpdateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        <Inbox className="h-4 w-4" />
                        <span>{campaign.responseCount || 0} responses</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        <Video className="h-4 w-4" />
                        <span>{campaign.aiVideosCount || 0} AI videos</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  } else {
    console.log('Rendering empty state, no campaigns to display');
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-white to-white opacity-50 dark:from-primary-900/20 dark:via-gray-900 dark:to-gray-900" />
        <div className="relative">
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900/50">
                <Video className="h-8 w-8 text-primary-text-600 dark:text-primary-text-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Create Your First Campaign
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              Start collecting authentic video stories from your community. Create a campaign to engage with your audience and gather meaningful responses.
            </p>
            <button
              onClick={onNewCampaign}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-primary-500 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Create Campaign
            </button>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
                  <Video className="h-6 w-6 text-primary-text-600 dark:text-primary-text-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Record Stories</h3>
                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                  Capture authentic video testimonials
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Track Analytics</h3>
                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                  Monitor engagement and insights
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Collaborate</h3>
                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                  Work together with your team
                </p>
              </div>
            </div>
            <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Need help getting started?</span>
              <Link
                to="/app/support"
                className="font-medium text-primary-text-600 hover:text-primary-500 dark:text-primary-text-400 dark:hover:text-primary-300"
              >
                View our guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}