import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Zap } from 'lucide-react';

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
          <p key={index} className="flex items-center gap-2 text-sm font-semibold" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CampaignCharts() {
  return (
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
                <XAxis dataKey="date" className="text-xs text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor' }}/>
                <YAxis className="text-xs text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor' }}/>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="responses" name="Responses" stroke="#6366f1" strokeWidth={2} fill="url(#responseGradient)" />
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
            <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20 dark:bg-primary-900/30 dark:text-primary-400 dark:ring-primary-500/20">
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
                <XAxis dataKey="date" className="text-xs text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor' }}/>
                <YAxis className="text-xs text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor' }}/>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" name="Views" stroke="#8b5cf6" strokeWidth={2} fill="url(#viewsGradient)" />
                <Area type="monotone" dataKey="completions" name="Completions" stroke="#06b6d4" strokeWidth={2} fill="url(#completionsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}