import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { MetricCard } from '../components/ui/metric-card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Video, Users, Clock, TrendingUp, Zap, Award, Play, Pause, Settings, Share2 } from 'lucide-react';

// Mock data for the specific campaign
const campaignData = {
  id: 1,
  name: "Boys and Girls Club",
  status: "Active",
  description: "Annual fundraising campaign for local youth programs",
  responses: 1234,
  audience: 5000,
  lastUpdated: "2024-03-15",
  completionRate: 92,
  avgResponseTime: "2:15",
  engagement: 87,
};

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
  const campaign = campaignData; // In a real app, fetch campaign data based on id

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{campaign.name}</h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
              Recent Campaign
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{campaign.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">
            <Pause className="h-4 w-4" />
            Pause Campaign
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid gap-6 grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Responses"
          value={1234}
          icon={Video}
          onClick={() => console.log('Responses clicked')}
        />
        <MetricCard
          title="Target Audience"
          value={5000}
          icon={Users}
          onClick={() => console.log('Audience clicked')}
        />
        <MetricCard
          title="Completion Rate"
          value={92}
          icon={Award}
          onClick={() => console.log('Completion Rate clicked')}
        />
        <MetricCard
          title="Avg Response Time"
          value={87}
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
        &copy; 2025 Amplify. All rights reserved.
      </div>
    </div>
  );
}