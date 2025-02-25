import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Plus, BarChart3, Users, Calendar, Star, Clock } from 'lucide-react';

const campaigns = [
  {
    id: 1,
    name: "Boys and Girls Club",
    status: "Active",
    description: "Annual fundraising campaign for local youth programs",
    responses: 1234,
    audience: 5000,
    lastUpdated: "2024-03-15",
    image: "/images/stock.jpg"
  },
  {
    id: 2,
    name: "Local Food Bank Drive",
    status: "Draft",
    description: "Supporting families in need through food donations",
    responses: 0,
    audience: 2500,
    lastUpdated: "2024-03-14",
    image: "/images/stock.jpg"
  },
  {
    id: 3,
    name: "City Park Cleanup",
    status: "Scheduled",
    description: "Community initiative to beautify our local parks",
    responses: 0,
    audience: 1000,
    lastUpdated: "2024-03-13",
    image: "/images/stock.jpg"
  }
];

function CampaignCard({ campaign }) {
  const statusColors = {
    Active: "bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20",
    Draft: "bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-500/20",
    Scheduled: "bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20"
  };

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      <div className="aspect-[3/2] w-full overflow-hidden rounded-t-xl">
        <img
          src={campaign.image}
          alt={campaign.name}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusColors[campaign.status]}`}>
            {campaign.status}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{campaign.description}</p>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{campaign.responses.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Responses</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{campaign.audience.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Audience</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Clock className="h-5 w-5" />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {new Date(campaign.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Update</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageCampaigns() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Campaigns</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Create and manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:scale-105 dark:hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}