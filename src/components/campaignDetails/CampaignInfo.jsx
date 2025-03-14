import React from 'react';
import { campaignQuestions } from '../../components/survey/campaignQuestions';
import { Tag, FileText, Type, AlignLeft, User, Clock, Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CampaignInfo({ campaign, userPermission }) {
  // Only render if title, description, category, or subcategory exists
  if (!campaign.title && !campaign.description && !campaign.category && !campaign.subcategory) {
    return null;
  }
  
  // Get human-readable category and subcategory names
  const getCategoryName = (categoryKey) => {
    if (!categoryKey) return 'Not specified';
    return campaignQuestions.categories[categoryKey]?.name || categoryKey;
  };
  
  const getSubcategoryName = (categoryKey, subcategoryKey) => {
    if (!categoryKey || !subcategoryKey) return 'Not specified';
    return campaignQuestions.categories[categoryKey]?.subcategories[subcategoryKey]?.name || subcategoryKey;
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const seconds = timestamp._seconds || timestamp.seconds;
    if (!seconds) return 'N/A';
    
    const date = new Date(seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="my-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Information</h3>
          
          {/* Only show settings button if user has edit permissions */}
          {(userPermission === 'admin' || userPermission === 'read/write') && (
            <Link 
              to={`/app/campaigns/${campaign.id}/settings`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:gap-8">
          {campaign.title && (
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Title</h2>
              </div>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{campaign.title}</p>
            </div>
          )}
          
          {campaign.description && (
            <div className="flex-1 mt-3 md:mt-0">
              <div className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Description</h2>
              </div>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{campaign.description}</p>
            </div>
          )}
        </div>
        
        {(campaign.category || campaign.subcategory) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:gap-8">
              {campaign.category && (
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {getCategoryName(campaign.category)}
                  </p>
                </div>
              )}
              
              {campaign.subcategory && (
                <div className="flex-1 mt-3 md:mt-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subcategory</h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {getSubcategoryName(campaign.category, campaign.subcategory)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Creator and Updater Information */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</h2>
              </div>
              <div className="mt-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {campaign.createdByName || 'Unknown'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(campaign.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-3 md:mt-0">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated By</h2>
              </div>
              <div className="mt-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {campaign.lastUpdatedByName || 'Unknown'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(campaign.dateModified)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}