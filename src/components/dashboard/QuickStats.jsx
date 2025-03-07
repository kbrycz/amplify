import React, { useState } from 'react';
import { MetricCard } from '../ui/metric-card';
import { CreditCard, FolderOpen, Film, Users, FileText, Clock, Bell, Activity, Zap, TrendingUp, BarChart3, Plus, Info } from 'lucide-react';
import { MetricCardSkeleton, ChartSkeleton, Skeleton } from '../ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import InfoModal from './InfoModal';
import { Link } from 'react-router-dom';

// Generate mock data for the last 7 days
const generateLast7DaysData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const label = `${month} ${day}`;
    
    // Generate a random number between 5 and 40 for responses
    const responses = Math.floor(Math.random() * 35) + 5;
    
    data.push({
      day: label,
      responses: responses
    });
  }
  
  return data;
};

// Mock data for the total reach over time chart
const reachOverTimeData = [
  { month: 'Jan', reach: 1200 },
  { month: 'Feb', reach: 1800 },
  { month: 'Mar', reach: 2400 },
  { month: 'Apr', reach: 3100 },
  { month: 'May', reach: 4200 },
  { month: 'Jun', reach: 5000 },
  { month: 'Jul', reach: 6100 },
];

// Generate responses data for the last 7 days
const responsesByDayData = generateLast7DaysData();

// Custom tooltip for the chart
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

// Overlay component for empty states
const EmptyStateOverlay = ({ title, description }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-[2px] rounded-lg z-10 p-6">
    <div className="max-w-md text-center">
      <Info className="h-10 w-10 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

export default function QuickStats({ isLoading, metrics, user, navigate }) {
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: '', content: '' });

  // Calculate account age based on user's createdAt timestamp
  const calculateAccountAge = () => {
    if (!user || !user.createdAt) {
      return "N/A";
    }
    
    // Convert Firebase timestamp to JavaScript Date
    const createdAtSeconds = user.createdAt._seconds || user.createdAt.seconds;
    const createdAt = new Date(createdAtSeconds * 1000);
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffMs = now - createdAt;
    
    // Convert to years, months, days
    const msInYear = 1000 * 60 * 60 * 24 * 365.25;
    const msInMonth = msInYear / 12;
    const msInDay = 1000 * 60 * 60 * 24;
    
    const years = Math.floor(diffMs / msInYear);
    const months = Math.floor((diffMs % msInYear) / msInMonth);
    const days = Math.floor((diffMs % msInMonth) / msInDay);
    
    // Format the string
    let ageString = "";
    if (years > 0) {
      ageString += `${years} ${years === 1 ? 'year' : 'years'}`;
      if (months > 0) {
        ageString += `, ${months} ${months === 1 ? 'month' : 'months'}`;
      }
    } else if (months > 0) {
      ageString += `${months} ${months === 1 ? 'month' : 'months'}`;
      if (days > 0) {
        ageString += `, ${days} ${days === 1 ? 'day' : 'days'}`;
      }
    } else {
      ageString = `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    
    return ageString;
  };

  // Check if user is new (account less than 7 days old)
  const isNewUser = () => {
    if (!user || !user.createdAt) return false;
    
    const createdAtSeconds = user.createdAt._seconds || user.createdAt.seconds;
    const createdAt = new Date(createdAtSeconds * 1000);
    const now = new Date();
    
    // Calculate difference in days
    const diffMs = now - createdAt;
    const msInDay = 1000 * 60 * 60 * 24;
    const days = Math.floor(diffMs / msInDay);
    
    return days < 7;
  };

  // Check if user has no campaigns
  const hasNoCampaigns = () => {
    return metrics.campaigns === 0;
  };

  const handleCardClick = (type) => {
    switch (type) {
      case 'credits':
        setModalInfo({
          title: 'Your Credits',
          content: 'Credits are used to generate AI videos from your responses. You currently have ' + 
                  (user?.credits || 0) + ' credits available. You can purchase more credits in the Settings page.'
        });
        setShowModal(true);
        break;
      case 'accountAge':
        setModalInfo({
          title: 'Account Age',
          content: 'Your account was created ' + calculateAccountAge() + ' ago. Thank you for being a valued member of our community!'
        });
        setShowModal(true);
        break;
      case 'totalReach':
        setModalInfo({
          title: 'Total Reach',
          content: 'Your campaigns have reached a total of ' + metrics.users + ' unique users. This represents the total number of people who have viewed your campaigns.'
        });
        setShowModal(true);
        break;
      case 'videosGenerated':
        setModalInfo({
          title: 'Videos Generated',
          content: 'You have generated a total of ' + metrics.videos + ' AI videos from your responses. Each video uses 1 credit from your account.'
        });
        setShowModal(true);
        break;
      default:
        // For campaign metrics, navigate to campaigns page
        navigate('/app/campaigns');
    }
  };

  if (isLoading) {
    return (
      <div className="mt-10 space-y-10">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>Track your campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </div>
            
            {/* Chart skeleton */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64 mt-1" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
              <ChartSkeleton height={300} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </div>
            
            {/* Chart skeleton */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64 mt-1" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
              <ChartSkeleton height={300} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Format the account age to display properly
  const formattedAccountAge = calculateAccountAge();
  const userIsNew = isNewUser();
  const noCampaigns = hasNoCampaigns();
  
  return (
    <div className="space-y-10">
      {/* Campaigns Section */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Track your campaign performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Unread Responses"
              value={noCampaigns ? 0 : metrics.unread}
              icon={Bell}
              onClick={() => navigate('/app/campaigns')}
            />
            <MetricCard
              title="Total Responses"
              value={noCampaigns ? 0 : metrics.collected}
              icon={Activity}
              onClick={() => navigate('/app/campaigns')}
            />
            <MetricCard
              title="Active Campaigns"
              value={noCampaigns ? 0 : metrics.waiting}
              icon={Zap}
              onClick={() => navigate('/app/campaigns')}
            />
            <MetricCard
              title="Total Campaigns"
              value={metrics.campaigns}
              icon={FolderOpen}
              onClick={() => navigate('/app/campaigns')}
            />
          </div>
          
          {/* New Responses by Day Chart (7 days) */}
          <div className="relative mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">New Responses by Day</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily response collection trends (last 7 days)</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20">
                <TrendingUp className="mr-1 h-3 w-3" />
                +18% this week
              </span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responsesByDayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="day"
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="responses"
                    name="Responses"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {noCampaigns && (
              <EmptyStateOverlay
                title="No Response Data Yet"
                description="Once you create a campaign and start collecting responses, you'll see daily response trends here."
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Your Credits"
              value={user?.credits || 0}
              icon={CreditCard}
              onClick={() => handleCardClick('credits')}
            />
            <MetricCard
              title="Account Age"
              value={formattedAccountAge}
              icon={Clock}
              onClick={() => handleCardClick('accountAge')}
              className="font-normal"
            />
            <MetricCard
              title="Total Reach"
              value={userIsNew || noCampaigns ? 0 : metrics.users}
              icon={Users}
              onClick={() => handleCardClick('totalReach')}
            />
            <MetricCard
              title="Videos Generated"
              value={userIsNew || noCampaigns ? 0 : metrics.videos}
              icon={Film}
              onClick={() => handleCardClick('videosGenerated')}
            />
          </div>
          
          {/* Total Reach Over Time Chart */}
          <div className="relative mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Reach Over Time</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly audience growth</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                <TrendingUp className="mr-1 h-3 w-3" />
                +22% growth
              </span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reachOverTimeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="month"
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
                    dataKey="reach"
                    name="Total Reach"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {(userIsNew || noCampaigns) && (
              <EmptyStateOverlay
                title="No Reach Data Yet"
                description={userIsNew 
                  ? "As your account grows and your campaigns collect responses, you'll see audience reach metrics here." 
                  : "Create your first campaign to start tracking audience reach over time."}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Show drafts card if there are any */}
      {metrics.drafts > 0 && (
        <div className="mt-6">
          <MetricCard
            title="Campaign Drafts"
            value={metrics.drafts}
            icon={FileText}
            onClick={() => navigate('/app/campaigns/new')}
          />
        </div>
      )}

      {/* Info Modal */}
      {showModal && (
        <InfoModal
          title={modalInfo.title}
          content={modalInfo.content}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}