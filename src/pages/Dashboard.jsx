// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { ScaleIn } from '../components/ui/scale-in';
import {
  Inbox,
  CheckCircle,
  Clock,
  CreditCard,
  Film,
  FolderOpen,
  Users,
  Star,
  ChevronRight,
  Plus,
  Video,
  BarChart3,
  FileText,
  Pencil,
  Calendar
} from 'lucide-react';
import { MetricCard } from '../components/ui/metric-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { RecentCampaignSkeleton, MetricCardSkeleton } from '../components/ui/skeleton';
import RecentActivity from '../components/RecentActivity';
import { get } from '../lib/api';

// Mock data for charts (if needed)
const responseData = [
  { date: 'Mar 13', responses: 65 },
  { date: 'Mar 14', responses: 78 },
  { date: 'Mar 15', responses: 85 },
  { date: 'Mar 16', responses: 91 },
  { date: 'Mar 17', responses: 98 },
  { date: 'Mar 18', responses: 120 },
  { date: 'Mar 19', responses: 145 },
];

/**
 * Converts Firestore timestamps or date-like objects into a JS Date.
 * Returns null if it fails.
 */
function parseDate(val) {
  if (!val) return null;

  // Firestore Timestamp object
  if (typeof val.toDate === 'function') {
    return val.toDate();
  }

  // Firestore timestamp-like object (e.g. { _seconds, _nanoseconds } or { seconds, nanoseconds })
  // or older format with underscore
  if (typeof val === 'object' && (('seconds' in val) || ('_seconds' in val))) {
    const seconds = val.seconds ?? val._seconds;
    return new Date(seconds * 1000);
  }

  // Attempt to parse as a standard date string
  const date = new Date(val);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Otherwise, fail
  return null;
}

/**
 * Returns a relative time string like "3 days ago", "2 hours ago", etc.
 */
function timeAgo(date) {
  if (!date) return 'N/A';

  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 0) return 'N/A'; // future date?

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    recentCampaigns: [],
    campaigns: 0,
    drafts: 0,
    videos: 0,
    users: 0,
    unread: 0,
    collected: 0,
    waiting: 0
  });

  // Add a function to refresh user data
  const refreshUserData = async () => {
    try {
      if (auth.currentUser) {
        await fetchUserProfile(auth.currentUser);
        console.log('User profile refreshed on dashboard mount');
      }
    } catch (err) {
      console.error('Error refreshing user profile:', err);
    }
  };

  const fetchRecentCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await get('/campaign/campaigns/recent');
      
      if (data && data.length > 0) {
        // Counts are now included in the campaign data from the API
        const campaignsWithCounts = data.map(campaign => ({
          ...campaign,
          responseCount: campaign.responsesCount || 0,
          aiVideosCount: campaign.aiVideoCount || 0
        }));
        
        setMetrics(prev => ({
          ...prev,
          recentCampaigns: campaignsWithCounts
        }));
      }
    } catch (err) {
      console.warn('Campaign fetch warning:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Refresh user data when component mounts
    refreshUserData();
    
    // Simulate loading metrics with random values
    setMetrics(prev => ({
      ...prev,
      videos: Math.floor(Math.random() * 1000),
      users: Math.floor(Math.random() * 5000),
      unread: Math.floor(Math.random() * 100),
      collected: Math.floor(Math.random() * 2000),
      waiting: Math.floor(Math.random() * 200)
    }));

    fetchCampaignCount();
    fetchDraftCount();
    fetchRecentCampaigns();
  }, []);

  const fetchDraftCount = async () => {
    try {
      const data = await get('/draftCampaign/drafts/count');
      setMetrics(prev => ({
        ...prev,
        drafts: data.count
      }));
    } catch (err) {
      console.error('Error fetching draft count:', err);
    }
  };

  const fetchCampaignCount = async () => {
    try {
      const data = await get('/campaign/campaigns/count');
      setMetrics(prev => ({
        ...prev,
        campaigns: data.count
      }));
    } catch (err) {
      console.error('Error fetching campaign count:', err);
    }
  };

  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user?.metadata?.creationTime) {
      const signupTime = new Date(user.metadata.creationTime).getTime();
      const now = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000;
      setIsNewUser(now - signupTime < fiveMinutes);
    }
  }, [user]);

  const firstName = user?.firstName || user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {isNewUser ? `Welcome, ${firstName}!` : `Welcome back, ${firstName}!`}
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Here's what's happening with your campaigns today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/app/campaigns')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Manage Campaigns
          </button>
          <button
            onClick={() => navigate('/app/campaigns/new')}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:scale-105 dark:hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Your Credits"
              value={user?.credits || 0}
              icon={CreditCard}
              onClick={() => console.log('Credits clicked')}
            />
            <MetricCard
              title="Total Campaigns"
              value={metrics.campaigns}
              icon={FolderOpen}
              onClick={() => navigate('/app/campaigns')}
            />
            <MetricCard
              title="Videos Generated"
              value={metrics.videos}
              icon={Film}
              onClick={() => console.log('Videos clicked')}
            />
            <MetricCard
              title="Active Users"
              value={metrics.users}
              icon={Users}
              onClick={() => console.log('Users clicked')}
            />
            {metrics.drafts > 0 && (
              <MetricCard
                title="Campaign Drafts"
                value={metrics.drafts}
                icon={FileText}
                onClick={() => navigate('/app/campaigns/new')}
              />
            )}
          </>
        )}
      </div>

      {/* Recent Campaigns or Empty State */}
      <div className="mt-10">
        {isLoading ? (
          <RecentCampaignSkeleton />
        ) : metrics.campaigns > 0 && metrics.recentCampaigns.length > 0 ? (
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
                  className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all campaigns
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recentCampaigns.map((campaign) => {
                  const modifiedDate = parseDate(campaign.dateModified || campaign.createdAt);
                  const lastUpdateStr = timeAgo(modifiedDate);
                  
                  return (
                    <div 
                      key={campaign.id}
                      onClick={() => navigate(`/app/campaigns/${campaign.id}`)}
                      className="group flex flex-col sm:flex-row sm:items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer hover:border-gray-300 hover:shadow-lg hover:scale-[1.01]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {campaign.name || 'Untitled Campaign'}
                          </h3>
                        </div>
                        
                        {campaign.title && (
                          <div className="mt-1.5 flex items-center gap-2 max-w-md">
                            <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Title</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{campaign.title}</span>
                          </div>
                        )}
                        
                        <div className="mt-1.5 flex items-start gap-2">
                          <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Description</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{campaign.description || 'No description provided'}</span>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            <Clock className="h-4 w-4" />
                            <span>{lastUpdateStr}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            <Inbox className="h-4 w-4" />
                            <span>{campaign.responseCount || 0} responses</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
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
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-50 dark:from-indigo-900/20 dark:via-gray-900 dark:to-gray-900" />
            <div className="relative">
              <div className="mx-auto max-w-xl text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                    <Video className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Create Your First Campaign
                </h2>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                  Start collecting authentic video stories from your community. Create a campaign to
                  engage with your audience and gather meaningful responses.
                </p>

                <button
                  onClick={() => navigate('/app/campaigns/new')}
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-indigo-500 hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  Create Campaign
                </button>

                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                      <Video className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View our guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10">
        <RecentActivity />
      </div>

      <div className="mt-20 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}