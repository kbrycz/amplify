import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Plus, BarChart3, Users, Calendar, Star, Clock, MoreVertical, Play, Pause, Archive, Edit, Trash2 } from 'lucide-react';
import { Dropdown } from '../components/ui/Dropdown';
import { DropdownItem } from '../components/ui/DropdownItem';
import { ConfirmationModal } from '../components/ui/confirmation-modal';

const campaigns = [
  {
    id: 1,
    name: "Boys and Girls Club",
    status: "Active",
    description: "Annual fundraising campaign for local youth programs",
    responses: 1234,
    audience: 5000,
    lastUpdated: "2024-03-15",
  },
  {
    id: 2,
    name: "Local Food Bank Drive",
    status: "Draft",
    description: "Supporting families in need through food donations",
    responses: 0,
    audience: 2500,
    lastUpdated: "2024-03-14",
  },
  {
    id: 3,
    name: "City Park Cleanup",
    status: "Scheduled",
    description: "Community initiative to beautify our local parks",
    responses: 0,
    audience: 1000,
    lastUpdated: "2024-03-13",
  }
];

function CampaignRow({ campaign }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const navigate = useNavigate();

  const statusColors = {
    Active: "bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20",
    Draft: "bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-500/20",
    Scheduled: "bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20"
  };

  const handleDelete = async () => {
    try {
      // TODO: Implement delete functionality
      console.log('Deleting campaign:', campaign.id);
      setIsDeleteModalOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleToggleDropdown = (e) => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    setDropdownPosition({
      top: rect.bottom + scrollTop,
      right: window.innerWidth - rect.right,
    });
    setIsOpen(true);
  };

  return (
    <div 
      onClick={() => navigate(`/app/campaigns/${campaign.id}`)}
      className="group relative flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 ease-in-out cursor-pointer
        hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50/50
        dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="truncate text-base font-medium text-gray-900 dark:text-white">
            {campaign.name}
          </h3>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColors[campaign.status]}`}>
            {campaign.status}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
          {campaign.description}
        </p>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <Users className="h-4 w-4" />
            <span className="tabular-nums font-medium">{campaign.responses.toLocaleString()}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Responses</div>
        </div>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <BarChart3 className="h-4 w-4" />
            <span className="tabular-nums font-medium">{campaign.audience.toLocaleString()}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Audience</div>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <Clock className="h-4 w-4" />
            <span className="tabular-nums font-medium">{new Date(campaign.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Last Update</div>
        </div>

        <div className="relative">
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDropdown(e);
            }}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isOpen && (
            <div
              className="fixed inset-0 z-50"
              onClick={() => setIsOpen(false)}
            />
          )}

          {isOpen && (
            <div
              className="fixed z-50"
              style={{
                top: dropdownPosition.top,
                right: dropdownPosition.right,
              }}
            >
              <div className="w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="p-1">
                  <DropdownItem
                    tag={Link}
                    to={`/app/campaigns/${campaign.id}`}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Campaign
                  </DropdownItem>
                  
                  {campaign.status === 'Active' ? (
                    <DropdownItem
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      onClick={() => console.log('Pause')}
                    >
                      <Pause className="h-4 w-4" />
                      Pause Campaign
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      onClick={() => console.log('Start')}
                    >
                      <Play className="h-4 w-4" />
                      Start Campaign
                    </DropdownItem>
                  )}

                  <DropdownItem
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    onClick={() => console.log('Archive')}
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </DropdownItem>
                </div>

                <div className="border-t border-gray-200 p-1 dark:border-gray-800">
                  <DropdownItem
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownItem>
                </div>
              </div>
            </div>
          )}

          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Campaign"
            message={`Are you sure you want to delete "${campaign.name}"? This action cannot be undone and will permanently remove all associated data.`}
            confirmText="delete campaign"
            confirmButtonText="Delete Campaign"
          />
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
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-[80%]">Create and manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => navigate('/app/campaigns/new')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:scale-105 dark:hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <CampaignRow key={campaign.id} campaign={campaign} />
        )).reverse()}
      </div>

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Amplify. All rights reserved.
      </div>
    </div>
  );
}