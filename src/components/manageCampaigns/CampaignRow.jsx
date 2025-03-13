import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pencil, Trash2, ChevronRight, Clock, Users, Video, Sparkles, AlertCircle, Shield
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { EditCampaignModal } from './edit-campaign-modal';
import { NumberTicker } from '../../components/ui/number-ticker';
import { useNamespace } from '../../context/NamespaceContext';

/**
 * Helper function to parse a Firestore timestamp or date-like object.
 */
function parseDate(val) {
  if (!val) return null;
  if (typeof val.toDate === 'function') {
    return val.toDate();
  }
  if (typeof val === 'object' && (('seconds' in val) || ('_seconds' in val))) {
    const seconds = val.seconds ?? val._seconds;
    return new Date(seconds * 1000);
  }
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Helper function to convert a date to a relative time string.
 */
function timeAgo(date) {
  if (!date) return 'N/A';
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 0) return 'N/A';
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

/**
 * Helper function to check if user has edit permission
 */
function canEdit(userPermission) {
  return userPermission === 'admin' || userPermission === 'read/write';
}

/**
 * Helper function to check if user has delete permission
 */
function canDelete(userPermission) {
  return userPermission === 'admin';
}

export default function CampaignRow({ campaign, onDelete, onUpdate, isEditMode, currentNamespaceId }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get user permission from context
  const { userPermission } = useNamespace();

  const responseCount = campaign.responsesCount || 0;
  const aiVideosCount = campaign.aiVideoCount || 0;

  const statusColors = {
    Active: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20",
    Draft: "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-500/20",
    Scheduled: "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/20 dark:bg-primary-900/30 dark:text-primary-400 dark:ring-primary-500/20"
  };

  const handleDelete = async () => {
    try {
      if (!canDelete(userPermission)) {
        setError("You don't have permission to delete campaigns");
        setIsDeleteModalOpen(false);
        return;
      }
      
      await onDelete(campaign.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError(error.message || "Failed to delete campaign");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (!canEdit(userPermission)) {
        throw new Error("You don't have permission to edit campaigns");
      }
      
      const updatedCampaign = await onUpdate(campaign.id, formData);
      setIsEditModalOpen(false);
      return updatedCampaign;
    } catch (err) {
      setError(err.message || "Failed to update campaign");
      throw new Error('Failed to update campaign: ' + err.message);
    }
  };

  const dateModified = parseDate(campaign.dateModified);
  const lastUpdateStr = dateModified ? timeAgo(dateModified) : 'N/A';

  return (
    <div 
      onClick={() => !isEditMode && navigate(`/app/campaigns/${campaign.id}`)}
      className={`group relative rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out
        ${!isEditMode ? 'cursor-pointer hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50/50' : ''}
        dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/50`}
    >
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-2 text-sm flex items-center justify-center rounded-t-lg">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 p-4 pb-3 lg:pb-4">
        <div className="self-center">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate max-w-[250px]">
              {campaign.name}
            </h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status]}`}>
              {campaign.status}
            </span>
          </div>
          {campaign.title && (
            <div className="mt-1.5 flex items-center gap-2 max-w-md">
              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                Title
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{campaign.title}</span>
            </div>
          )}
          <div className="mt-1.5 mb-1 flex items-start gap-2">
            <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
              Description
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{campaign.description || 'No description provided'}</span>
          </div>
        </div>
        <div className="hidden lg:flex flex-col justify-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-primary-text-600 dark:group-hover:text-primary-400'}`}>
            <Users className="h-4 w-4 shrink-0" />
            <NumberTicker value={responseCount} className="font-medium" />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Responses</div>
        </div>
        <div className="hidden lg:flex flex-col justify-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-primary-text-600 dark:group-hover:text-primary-400'}`}>
            <Sparkles className="h-4 w-4 shrink-0" />
            <NumberTicker value={aiVideosCount} className="font-medium" />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">AI Videos</div>
        </div>
        <div className="hidden lg:flex flex-col justify-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-primary-text-600 dark:group-hover:text-primary-400'}`}>
            <Clock className="h-4 w-4 shrink-0" />
            <span className="tabular-nums font-medium">{lastUpdateStr}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Last Update</div>
        </div>
        <div className="hidden lg:flex items-center justify-end self-center">
          {isEditMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canEdit(userPermission)) {
                    setIsEditModalOpen(true);
                  } else {
                    setError("You don't have permission to edit campaigns");
                  }
                }}
                disabled={!canEdit(userPermission)}
                className={`rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                  ${canEdit(userPermission) 
                    ? 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800' 
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                title={canEdit(userPermission) ? "Edit campaign" : "You don't have permission to edit"}
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canDelete(userPermission)) {
                    setIsDeleteModalOpen(true);
                  } else {
                    setError("You don't have permission to delete campaigns");
                  }
                }}
                disabled={!canDelete(userPermission)}
                className={`rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600
                  ${canDelete(userPermission) 
                    ? 'text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50' 
                    : 'text-red-200 dark:text-red-900 cursor-not-allowed'}`}
                title={canDelete(userPermission) ? "Delete campaign" : "You don't have permission to delete"}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 dark:text-gray-600 dark:group-hover:text-primary-400" />
          )}
        </div>
      </div>
      <div className="lg:hidden grid grid-cols-3 gap-4 px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
        {isEditMode && (
          <div className="col-span-3 flex justify-end mb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canEdit(userPermission)) {
                    setIsEditModalOpen(true);
                  } else {
                    setError("You don't have permission to edit campaigns");
                  }
                }}
                disabled={!canEdit(userPermission)}
                className={`rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                  ${canEdit(userPermission) 
                    ? 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800' 
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                title={canEdit(userPermission) ? "Edit campaign" : "You don't have permission to edit"}
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canDelete(userPermission)) {
                    setIsDeleteModalOpen(true);
                  } else {
                    setError("You don't have permission to delete campaigns");
                  }
                }}
                disabled={!canDelete(userPermission)}
                className={`rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600
                  ${canDelete(userPermission) 
                    ? 'text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50' 
                    : 'text-red-200 dark:text-red-900 cursor-not-allowed'}`}
                title={canDelete(userPermission) ? "Delete campaign" : "You don't have permission to delete"}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-primary-text-600 dark:group-hover:text-primary-400'}`}>
            <Users className="h-4 w-4 shrink-0" />
            <NumberTicker value={responseCount} className="font-medium" />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Responses</div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-primary-text-600 dark:group-hover:text-primary-400'}`}>
            <Sparkles className="h-4 w-4 shrink-0" />
            <NumberTicker value={aiVideosCount} className="font-medium" />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">AI Videos</div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-primary-text-600 dark:group-hover:text-primary-400'}`}>
            <Clock className="h-4 w-4 shrink-0" />
            <span className="tabular-nums font-medium">{lastUpdateStr}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Last Update</div>
        </div>
      </div>
      
      {/* Display user permission badge */}
      <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
        <Shield className="h-3 w-3" />
        {userPermission || 'viewer'}
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
  );
}