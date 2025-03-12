import React from 'react';
import { campaignQuestions } from '../../components/survey/campaignQuestions';
import { Tag, FileText, Type, AlignLeft } from 'lucide-react';

export default function CampaignInfo({ campaign }) {
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

  return (
    <div className="my-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
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
      </div>
    </div>
  );
}