import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Inbox, CheckCircle, Clock, CreditCard, Film, FolderOpen, TrendingUp, Users, Star, ChevronRight, Plus } from 'lucide-react';
import { MetricCard } from '../components/ui/metric-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const responseData = [
  { date: 'Mar 13', responses: 65 },
  { date: 'Mar 14', responses: 78 },
  { date: 'Mar 15', responses: 85 },
  { date: 'Mar 16', responses: 91 },
  { date: 'Mar 17', responses: 98 },
  { date: 'Mar 18', responses: 120 },
  { date: 'Mar 19', responses: 145 },
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check if user signed up in the last 5 minutes
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
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Here's what's happening with your campaigns today.</p>
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
        <MetricCard
          title="Unused Credits"
          value={2500}
          icon={CreditCard}
          onClick={() => console.log('Credits clicked')}
        />
        <MetricCard
          title="Total Campaigns"
          value={15}
          icon={FolderOpen}
          onClick={() => console.log('Campaigns clicked')}
        />
        <MetricCard
          title="Videos Generated"
          value={347}
          icon={Film}
          onClick={() => console.log('Videos clicked')}
        />
        <MetricCard
          title="Active Users"
          value={1234}
          icon={Users}
          onClick={() => console.log('Users clicked')}
        />
      </div>

      {/* Most Recent Campaign */}
      <div className="mt-10">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">Boys and Girls Club</CardTitle>
                </div>
                <CardDescription className="mt-2">Annual fundraising campaign for local youth programs</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                Recent Campaign
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-2">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Inbox className="h-4 w-4" />
                  <span className="font-medium">42</span>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Unread</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">1,234</span>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Collected</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">89</span>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Waiting</div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/app/campaigns/1"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View campaign details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Recent Activity</CardTitle>
                <CardDescription className="mt-2">Latest updates from your campaigns</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New milestone reached
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Boys and Girls Club campaign reached 1,000 responses
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New team member added
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Sarah Johnson joined the Local Food Bank Drive campaign
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    5 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <Film className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New video response
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    A new video response was submitted to City Park Cleanup
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    8 hours ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-20 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Amplify. All rights reserved.
      </div>
    </div>
  );
}