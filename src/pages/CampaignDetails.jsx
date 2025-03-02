import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { MetricCard } from '../components/ui/metric-card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Video, Users, Clock, TrendingUp, Zap, Award, Play, Pause, Settings, Share2, ExternalLink, Sparkles, ArrowLeft } from 'lucide-react';
import { CampaignDetailsSkeleton } from '../components/ui/skeleton';
import { ShareModal } from '../components/ui/share-modal';

// Mock data for charts
const dailyResponses = [
  { date: 'Mar 13', responses: 65 },
  { date: 'Mar 14', responses: 78 },
  { date: 'Mar 15', responses: 85 },
  { date: 'Mar 16', responses: 91 },
  { date: 'Mar 17', responses: 98 },
  { date: 'Mar 18', responses: 120 },
  { date: 'Mar 19', responses: 145 },
];

const engagementData = [
  { date: 'Mar 13', views: 120, completions: 95 },
  { date: 'Mar 14', views: 145, completions: 115 },
  { date: 'Mar 15', views: 168, completions: 132 },
  { date: 'Mar 16', views: 185, completions: 148 },
  { date: 'Mar 17', views: 215, completions: 172 },
  { date: 'Mar 18', views: 245, completions: 198 },
  { date: 'Mar 19', views: 278, completions: 225 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: entry.color }}
          >
            <span>{entry.name}:</span>
            <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    responses: 0,
    videos: 0,
    audience: Math.floor(Math.random() * 5000) + 1000,
    completionRate: Math.floor(Math.random() * 20) + 80,
    avgResponseTime: Math.floor(Math.random() * 60) + 30
  });

  useEffect(() => {
    fetchCampaignData();
    fetchVideoCount();
    fetchAIVideoCount();
  }, [id]);

  const fetchAIVideoCount = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoProcessor/ai-videos/campaign/${id}/count`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI video count');
      }

      const data = await response.json();
      setMetrics(prev => ({
        ...prev,
        videos: data.count // Set videos count from the count endpoint
      }));
    } catch (err) {
      console.error('Error fetching AI video count:', err);
    }
  };

  const fetchVideoCount = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/videos/${id}/count`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video count');
      }

      const data = await response.json();
      setMetrics(prev => ({
        ...prev,
        responses: data.count // Update responses count with actual video count
      }));
    } catch (err) {
      console.error('Error fetching video count:', err);
    }
  };

  const fetchCampaignData = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }

      const data = await response.json();
      setCampaign(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CampaignDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaign not found</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The campaign you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/app/campaigns')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaigns
      </button>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{campaign.name}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{campaign.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate(`/app/campaigns/${campaign.id}/settings`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"> 
        <MetricCard
          title="Total Responses"
          value={metrics.responses}
          icon={Video}
          onClick={() => navigate(`/app/campaigns/${id}/responses`)}
        />
        <MetricCard
          title="AI Generated Videos"
          value={metrics.videos}
          icon={Sparkles}
          onClick={() => navigate(`/app/campaigns/${id}/ai-videos`)}
        />
        <MetricCard
          title="Target Audience"
          value={metrics.audience}
          icon={Users}
          onClick={() => navigate(`/app/campaigns/${id}/ai-videos`)}
        />
        <MetricCard
          title="Avg Response Time"
          value={metrics.avgResponseTime}
          icon={Clock}
          onClick={() => console.log('Response Time clicked')}
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Responses</CardTitle>
                <CardDescription>Number of responses collected per day</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20">
                <TrendingUp className="mr-1 h-3 w-3" />
                +28%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyResponses} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="date"
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="responses"
                    name="Responses"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#responseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Engagement Overview</CardTitle>
                <CardDescription>Views vs completed responses</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                <Zap className="mr-1 h-3 w-3" />
                High Engagement
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="completionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="date"
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="Views"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#viewsGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    name="Completions"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#completionsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        campaignId={campaign?.id}
        campaignName={campaign?.name}
      />
    </div>
  );
}
