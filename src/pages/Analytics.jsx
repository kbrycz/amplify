import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { MetricCard } from '../components/ui/metric-card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Video, Users, Clock, TrendingUp, Zap, Award, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data for charts
const responseData = [
  { date: 'Jan 1', responses: 65, rate: 75 },
  { date: 'Jan 8', responses: 78, rate: 78 },
  { date: 'Jan 15', responses: 85, rate: 82 },
  { date: 'Jan 22', responses: 91, rate: 85 },
  { date: 'Jan 29', responses: 98, rate: 88 },
  { date: 'Feb 5', responses: 120, rate: 92 },
  { date: 'Feb 12', responses: 145, rate: 95 },
  { date: 'Feb 19', responses: 168, rate: 94 },
  { date: 'Feb 26', responses: 185, rate: 96 },
  { date: 'Mar 5', responses: 215, rate: 97 },
  { date: 'Mar 12', responses: 245, rate: 98 },
  { date: 'Mar 19', responses: 278, rate: 98 },
];

const engagementData = [
  { date: 'Jan 1', views: 120, completions: 95 },
  { date: 'Jan 8', views: 145, completions: 115 },
  { date: 'Jan 15', views: 168, completions: 132 },
  { date: 'Jan 22', views: 185, completions: 148 },
  { date: 'Jan 29', views: 215, completions: 172 },
  { date: 'Feb 5', views: 245, completions: 198 },
  { date: 'Feb 12', views: 278, completions: 225 },
  { date: 'Feb 19', views: 312, completions: 255 },
  { date: 'Feb 26', views: 345, completions: 285 },
  { date: 'Mar 5', views: 385, completions: 320 },
  { date: 'Mar 12', views: 425, completions: 355 },
  { date: 'Mar 19', views: 468, completions: 392 },
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
            <span>{entry.value}{entry.name === 'Success Rate' ? '%' : ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [metrics, setMetrics] = useState({
    videos: 0,
    users: 0,
    responseTime: 0
  });

  useEffect(() => {
    // Simulate loading metrics with random values
    setMetrics({
      videos: Math.floor(Math.random() * 1000),
      users: Math.floor(Math.random() * 5000),
      responseTime: Math.floor(Math.random() * 120)
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics Overview</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Track your campaign performance and engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Videos Created"
          value={metrics.videos}
          icon={Video}
          onClick={() => console.log('Videos clicked')}
        />
        <MetricCard
          title="Active Users"
          value={metrics.users}
          icon={Users}
          onClick={() => console.log('Users clicked')}
        />
        <MetricCard
          title="Avg. Response Time"
          value={metrics.responseTime}
          icon={Clock}
          onClick={() => console.log('Response Time clicked')}
        />
      </div>

      {/* Response Trends */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Response Growth</CardTitle>
                <CardDescription>Total responses collected over time</CardDescription>
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
                <AreaChart data={responseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                <CardTitle>Success Rate</CardTitle>
                <CardDescription>Percentage of successful response submissions</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                <Zap className="mr-1 h-3 w-3" />
                98% Success
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Success Rate"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Engagement Overview</CardTitle>
              <CardDescription>Campaign views vs. completed responses</CardDescription>
            </div>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-500/20">
              <Award className="mr-1 h-3 w-3" />
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
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Amplify. All rights reserved.
      </div>
    </div>
  );
}