import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    try {
      const data = await get('/campaign/campaigns/recent');
      if (data && data.length > 0) {
        // Include counts from API if available.
        const campaignsWithCounts = data.map((campaign) => ({
          ...campaign,
          responseCount: campaign.responsesCount || 0,
          aiVideosCount: campaign.aiVideoCount || 0,
        }));
        setMetrics((prev) => ({
          ...prev,
          recentCampaigns: campaignsWithCounts,
        }));
      }
    } catch (err) {
      console.warn('Campaign fetch warning:', err.message);
    }
  };

  const fetchDraftCount = async () => {
    try {
      const data = await get('/draftCampaign/drafts/count');
      setMetrics((prev) => ({
        ...prev,
        drafts: data.count,
      }));
    } catch (err) {
      console.error('Error fetching draft count:', err);
    }
  };

  const fetchCampaignCount = async () => {
    try {
      const data = await get('/campaign/campaigns/count');
      setMetrics((prev) => ({
        ...prev,
        campaigns: data.count,
      }));
    } catch (err) {
      console.error('Error fetching campaign count:', err);
    }
  };

  const fetchResponseCounts = async () => {
    try {
      // This is a placeholder - in a real app, you would fetch this data from your API
      setMetrics((prev) => ({
        ...prev,
        unread: Math.floor(Math.random() * 100),
        collected: Math.floor(Math.random() * 2000),
      }));
    } catch (err) {
      console.error('Error fetching response counts:', err);
    }
  };

  const fetchTemplatesCount = async () => {
    try {
      // This is a placeholder - in a real app, you would fetch this data from your API
      setMetrics((prev) => ({
        ...prev,
        templates: 15, // Mock value for templates
      }));
    } catch (err) {
      console.error('Error fetching templates count:', err);
    }
  };

  useEffect(() => {
    // Refresh user data and fetch metrics on mount.
    refreshUserData();
    
    // Set loading state
    setIsLoading(true);
    
    // Fetch all required metrics
    Promise.all([
      fetchCampaignCount(),
      fetchDraftCount(),
      fetchResponseCounts(),
      fetchRecentCampaigns(),
      fetchTemplatesCount(),
    ]).then(() => {
      // Simulate additional metric values for demo purposes
      setMetrics((prev) => ({
        ...prev,
        videos: Math.floor(Math.random() * 1000),
        users: Math.floor(Math.random() * 5000),
        waiting: Math.floor(Math.random() * 200),
      }));
      
      // Set loading to false when all data is fetched
      setIsLoading(false);
    }).catch(err => {
      console.error('Error fetching dashboard data:', err);
      setIsLoading(false);
    });
  }, []);

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