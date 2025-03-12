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

  const handleCardClick = (type) => {
    switch (type) {
      case 'creditsUsed':
        setModalInfo({
          title: 'Credits Used',
          content: 'You have used ' + (planCredits - (user?.credits || 0)) + ' credits out of ' + 
                  (user?.plan?.credits || 100) + ' total in your plan.'
        });
        setShowModal(true);
        break;
      case 'totalCampaigns':
        setModalInfo({
          title: 'Total Campaigns',
          content: 'You have created ' + (metrics.campaigns || 0) + ' campaigns out of ' + (user?.plan?.campaigns || 10) + ' total in your plan.'
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
          content: 'Your campaigns have reached a total of ' + (metrics.users || 0) + ' unique users. This represents the total number of people who have viewed your campaigns.'
        });
        setShowModal(true);
        break;
      case 'videosGenerated':
        setModalInfo({
          title: 'Videos Generated',
          content: 'You have generated a total of ' + (metrics.videos || 0) + ' AI videos from your responses. Each video uses 1 credit from your account.'
        });
        setShowModal(true);
        break;
      case 'unreadResponses':
        setModalInfo({
          title: 'Unread Responses',
          content: 'You have ' + (metrics.unread || 0) + ' unread responses across all your campaigns.'
        });
        setShowModal(true);
        break;
      case 'totalResponses':
        setModalInfo({
          title: 'Total Responses',
          content: 'You have collected a total of ' + (metrics.collected || 0) + ' responses across all your campaigns.'
        });
        setShowModal(true);
        break;
      case 'totalTemplates':
        setModalInfo({
          title: 'Total Templates',
          content: 'You have access to ' + (metrics.templates || 15) + ' templates that you can use to create new campaigns quickly.'
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
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your account and campaign statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Format the account age to display properly
  const formattedAccountAge = calculateAccountAge();
  
  // Calculate plan values
  const planCredits = user?.plan?.credits || 100;
  const planCampaigns = user?.plan?.campaigns || 10;
  const creditsRemaining = user?.credits || 0;
  const creditsUsed = planCredits - creditsRemaining;
  const campaignsUsed = metrics.campaigns || 0;
  
  // Get templates count from metrics
  const templates = metrics.templates || 15;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your account and campaign statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Responses */}
            <MetricCard
              title="Total Responses"
              value={metrics.collected || 0}
              icon={BarChart3}
              description="Total responses collected"
              onClick={() => handleCardClick('totalResponses')}
            />
            
            {/* Total Templates */}
            <MetricCard
              title="Total Templates"
              value={templates}
              icon={FileText}
              description="Available campaign templates"
              onClick={() => handleCardClick('totalTemplates')}
            />
            
            {/* Videos Generated */}
            <MetricCard
              title="Videos Generated"
              value={(metrics.videos || 0).toLocaleString()}
              icon={Film}
              description="AI videos created"
              onClick={() => handleCardClick('videosGenerated')}
            />
            
            {/* Credits Used */}
            <MetricCard
              title="Credits Used"
              value={`${creditsUsed}/${planCredits}`}
              icon={CreditCard}
              description="Credits used out of plan total"
              onClick={() => handleCardClick('creditsUsed')}
            />
            
            {/* Total Campaigns */}
            <MetricCard
              title="Total Campaigns"
              value={`${campaignsUsed}/${planCampaigns}`}
              icon={FolderOpen}
              description="Campaigns created out of plan total"
              onClick={() => handleCardClick('totalCampaigns')}
            />
            
            {/* Account Age */}
            <MetricCard
              title="Account Age"
              value={formattedAccountAge}
              icon={Clock}
              description="Time since account creation"
              onClick={() => handleCardClick('accountAge')}
            />
          </div>
        </CardContent>
      </Card>
      
      {showModal && (
        <InfoModal
          title={modalInfo.title}
          content={modalInfo.content}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}