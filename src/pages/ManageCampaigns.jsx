import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Plus, Users, Clock, Trash2, Pencil, X, Video, Sparkles } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { EditCampaignModal } from '../components/ui/edit-campaign-modal';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { NumberTicker } from '../components/ui/number-ticker';

/**
 * Converts Firestore timestamps or date-like objects into a JS Date.
 * Returns null if it fails.
 */
function parseDate(val) {
  if (!val) return null;

  // Firestore Timestamp object
  if (typeof val.toDate === 'function') {
    return val.toDate();
  }

  // Firestore timestamp-like object (e.g. { _seconds, _nanoseconds } or { seconds, nanoseconds })
  // or older format with underscore
  if (typeof val === 'object' && (('seconds' in val) || ('_seconds' in val))) {
    const seconds = val.seconds ?? val._seconds;
    return new Date(seconds * 1000);
  }

  // Attempt to parse as a standard date string
  const date = new Date(val);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Otherwise, fail
  return null;
}

/**
 * Returns a relative time string like "3 days ago", "2 hours ago", etc.
 */
function timeAgo(date) {
  if (!date) return 'N/A';

  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 0) return 'N/A'; // future date?

  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
    { label: 'second', secs: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.secs);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

function CampaignRow({ campaign, onDelete, onUpdate, isEditMode }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [aiVideosCount, setAiVideosCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResponseCount();
    fetchAiVideosCount();
  }, [campaign.id]);

  const fetchAiVideosCount = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoProcessor/ai-videos/campaign/${campaign.id}/count`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI videos count');
      }

      const data = await response.json();
      setAiVideosCount(data.count);
    } catch (err) {
      console.error('Error fetching AI videos count:', err);
    }
  };

  const fetchResponseCount = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/videos/${campaign.id}/count`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response count');
      }

      const data = await response.json();
      setResponseCount(data.count);
    } catch (err) {
      console.error('Error fetching response count:', err);
    }
  };

  const statusColors = {
    Active: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20",
    Draft: "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-500/20",
    Scheduled: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20"
  };

  const handleDelete = async () => {
    try {
      await onDelete(campaign.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const updatedCampaign = await onUpdate(campaign.id, formData);
      setIsEditModalOpen(false);
      return updatedCampaign;
    } catch (err) {
      throw new Error('Failed to update campaign: ' + err.message);
    }
  };

  // Parse and display relative time
  const dateModified = parseDate(campaign.dateModified);
  const lastUpdateStr = dateModified ? timeAgo(dateModified) : 'N/A';

  return (
    <div 
      onClick={() => !isEditMode && navigate(`/app/campaigns/${campaign.id}`)}
      className={`group relative flex flex-col sm:flex-row items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 ease-in-out
        ${!isEditMode ? 'cursor-pointer hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50/50' : ''}
        dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/50`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="truncate text-base font-medium text-gray-900 dark:text-white">
            {campaign.name}
          </h3>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status]}`}>
            {campaign.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {campaign.description || 'No description provided'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto shrink-0">
        {isEditMode && (
          <div className="flex items-center gap-2 order-first sm:order-last sm:ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="block w-32">
          <div
            className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${
              !isEditMode ? 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400' : ''
            } transition-colors`}
          >
            <Users className="h-4 w-4" />
            <NumberTicker value={responseCount} className="font-medium" />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Responses</div>
        </div>

        <div className="block w-32">
          <div
            className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${
              !isEditMode ? 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400' : ''
            } transition-colors`}
          >
            <Sparkles className="h-4 w-4" />
            <NumberTicker value={aiVideosCount} className="font-medium" />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">AI Videos</div>
        </div>

        <div className="block w-40">
          <div
            className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${
              !isEditMode ? 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400' : ''
            } transition-colors`}
          >
            <Clock className="h-4 w-4" />
            <span className="tabular-nums font-medium">{lastUpdateStr}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Last Update</div>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Campaign"
          message={`Are you sure you want to delete "${campaign.name}"? This action cannot be undone and will permanently remove all associated data.`}
          confirmText="delete campaign"
          confirmButtonText="Delete Campaign"
        />

        <EditCampaignModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          campaign={campaign}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default function ManageCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();

      // Just pass them through as-is; we parse dateModified in the row component
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete campaign');
      }

      // Remove the campaign from the local state
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setSuccessMessage('Campaign deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Failed to delete campaign: ' + err.message);
    }
  };

  const handleUpdate = async (campaignId, formData) => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update campaign');
      }

      const updatedCampaign = await response.json();

      // Update the campaign in local state
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((c) => (c.id === campaignId ? { ...c, ...updatedCampaign } : c))
      );

      // Show success message
      setSuccessMessage('Campaign updated successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      return updatedCampaign;
    } catch (err) {
      console.error('Error updating campaign:', err);
      throw err;
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {successMessage}
        </div>
      )}

      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Campaigns</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create and manage your marketing campaigns
          </p>
        </div>
        {!isLoading && campaigns.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                isEditMode
                  ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600'
              }`}
            >
              {isEditMode ? (
                <>
                  <X className="h-4 w-4" />
                  Done Editing
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                  Edit Campaigns
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/app/campaigns/new')}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading campaigns..." />
      ) : error ? (
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
      ) : campaigns.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-50 dark:from-indigo-900/20 dark:via-gray-900 dark:to-gray-900" />
          <div className="relative">
            <div className="mx-auto max-w-xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                  <Video className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Create Your First Campaign
              </h2>
              <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                Start collecting authentic video stories from your community. Create a campaign to
                engage with your audience and gather meaningful responses.
              </p>

              <button
                onClick={() => navigate('/app/campaigns/new')}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-indigo-500 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                Create Campaign
              </button>

              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                    <Video className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Record Stories</h3>
                  <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                    Capture authentic video testimonials
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Track Analytics</h3>
                  <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                    Monitor engagement and insights
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Collaborate</h3>
                  <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                    Work together with your team
                  </p>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Need help getting started?</span>
                <Link
                  to="/app/support"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View our guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}