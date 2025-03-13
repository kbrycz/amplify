import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServerStatus } from '../context/ServerStatusContext';
import { useNamespace } from '../context/NamespaceContext';
import { auth } from '../lib/firebase';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import QuickStats from '../components/dashboard/QuickStats';
import RecentCampaigns from '../components/dashboard/RecentCampaigns';
import RecentActivity from '../components/header/RecentActivity';
import { get } from '../lib/api';
import { MetricCardSkeleton, RecentCampaignSkeleton } from '../components/ui/skeleton';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAuth();
  const { checkServerStatus } = useServerStatus();
  const { namespaces, currentNamespace } = useNamespace();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    recentCampaigns: [],
    campaigns: 0,
    drafts: 0,
    videos: 0,
    users: 0,
    unread: 0,
    collected: 0,
    waiting: 0,
    templates: 0,
  });

  // Find the current namespace ID
  const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
  const currentNamespaceId = currentNamespaceObj?.id;

  // Refresh user data on mount.
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
    if (!currentNamespaceId) {
      console.warn('No namespace ID available for fetching recent campaigns');
      return;
    }

    try {
      // Use the correct endpoint format from the server code
      console.log('Fetching recent campaigns with endpoint:', `/campaign/campaigns/recent?namespaceId=${currentNamespaceId}`);
      const data = await get(`/campaign/campaigns/recent?namespaceId=${currentNamespaceId}`);
      console.log('Recent campaigns data:', data); // Add logging to see the data
      
      if (data && Array.isArray(data)) {
        // Include counts from API if available.
        const campaignsWithCounts = data.map((campaign) => ({
          ...campaign,
          responseCount: campaign.responsesCount || 0,
          aiVideosCount: campaign.aiVideoCount || 0,
        }));
        
        console.log('Processed campaigns:', campaignsWithCounts); // Log processed data
        
        setMetrics((prev) => ({
          ...prev,
          recentCampaigns: campaignsWithCounts,
        }));
      } else {
        console.warn('Recent campaigns data is not an array:', data);
      }
    } catch (err) {
      console.error('Campaign fetch error:', err.message);
      // Check if server is down
      checkServerStatus();
    }
  };

  const fetchDashboardData = async () => {
    if (!currentNamespaceId) {
      console.warn('No namespace ID available for fetching dashboard data');
      return;
    }

    try {
      const data = await get(`/dashboard?namespaceId=${currentNamespaceId}`);
      console.log('Dashboard data:', data);
      
      if (data && data.metrics) {
        setMetrics((prev) => ({
          ...prev,
          campaigns: data.metrics.campaigns || 0,
          videos: data.metrics.videos || 0,
          users: data.metrics.users || 0,
          unread: data.metrics.unread || 0,
          collected: data.metrics.collected || 0,
          templates: data.metrics.templates || 0,
          // Keep any other metrics that aren't provided by the dashboard endpoint
          waiting: prev.waiting,
          drafts: prev.drafts,
        }));
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Check if server is down
      checkServerStatus();
      throw err;
    }
  };

  useEffect(() => {
    // Refresh user data on mount to ensure we have the latest profile data
    refreshUserData();
    
    // Set loading state
    setIsLoading(true);
    
    // Only fetch data if we have a namespace ID
    if (currentNamespaceId) {
      console.log('Dashboard: Fetching data for namespace ID:', currentNamespaceId);
      
      // Fetch all required metrics
      Promise.all([
        fetchDashboardData().catch(err => {
          console.error('Dashboard data fetch failed:', err);
          return null;
        }),
        fetchRecentCampaigns().catch(err => {
          console.error('Recent campaigns fetch failed:', err);
          return null;
        }),
      ]).then(() => {
        // Set loading to false when all data is fetched
        setIsLoading(false);
      }).catch(err => {
        console.error('Error fetching dashboard data:', err);
        setIsLoading(false);
      });
    } else {
      console.warn('Dashboard: No namespace ID available, skipping data fetch');
      // If no namespace ID, set loading to false
      setIsLoading(false);
    }
  }, [currentNamespaceId]); // Re-fetch when namespace changes

  // Determine if the user is new (signed up less than 5 minutes ago).
  const [isNewUser, setIsNewUser] = useState(false);
  useEffect(() => {
    if (user?.metadata?.creationTime) {
      const signupTime = new Date(user.metadata.creationTime).getTime();
      const now = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000;
      setIsNewUser(now - signupTime < fiveMinutes);
    }
  }, [user]);

  const firstName =
    user?.firstName ||
    (user?.displayName && user.displayName.split(' ')[0]) ||
    'there';

  return (
    <div className="p-6">
      <DashboardHeader
        firstName={firstName}
        isNewUser={isNewUser}
        onManageCampaigns={() => navigate('/app/campaigns')}
        onNewCampaign={() => navigate('/app/campaigns/new')}
      />

      <div className="mt-10">
        {console.log('Dashboard rendering RecentCampaigns with:', {
          isLoading,
          totalCampaigns: metrics.campaigns,
          recentCampaignsLength: metrics.recentCampaigns?.length,
          recentCampaigns: metrics.recentCampaigns
        })}
        <RecentCampaigns
          isLoading={isLoading}
          totalCampaigns={metrics.campaigns}
          recentCampaigns={metrics.recentCampaigns}
          onViewAllCampaigns={() => navigate('/app/campaigns')}
          onCampaignClick={(id) => navigate(`/app/campaigns/${id}`)}
          onNewCampaign={() => navigate('/app/campaigns/new')}
        />
      </div>

      <div className="mt-10">
        <QuickStats
          isLoading={isLoading}
          metrics={metrics}
          user={user}
          navigate={navigate}
        />
      </div>

      <div className="mt-10">
        <RecentActivity />
      </div>

      <div className="mt-20 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}