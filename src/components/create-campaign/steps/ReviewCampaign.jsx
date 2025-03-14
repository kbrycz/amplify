import React from 'react';
import { Video, Image, Building, Users, Info, Shield } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Label } from '../../ui/label';

export function ReviewCampaign({ 
  formData, 
  surveyQuestions, 
  selectedTheme, 
  previewImage,
  hasExplainerVideo,
  explainerVideo,
  themes,
  className = '',
  currentNamespace,
  userPermission,
  isUpdateMode = false,
  submitButtonText = 'Create Campaign'
}) {
  // Get theme name for display
  const getThemeName = () => {
    if (selectedTheme === 'custom') {
      return 'Custom Theme';
    }
    return themes[selectedTheme]?.name || selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    if (!category) return 'None';
    
    // Map category IDs to readable names
    const categoryMap = {
      'political': 'Political Campaigns',
      'government': 'Government Offices & Legislatures',
      'trade': 'Trade & Professional Associations',
      'advocacy': 'Advocacy Groups',
      'religious': 'Religious Organizations',
      'education': 'Educational Institutions',
      'other': 'Other'
    };
    
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  // Format subcategory name for display
  const formatSubcategoryName = (category, subcategory) => {
    if (!subcategory) return 'None';
    if (subcategory === 'custom') return 'Custom';
    
    // Map subcategory IDs to readable names based on category
    const subcategoryMaps = {
      'political': {
        'voter_testimonials': 'Voter & Supporter Testimonials',
        'call_to_action': 'Call-to-Action Videos',
        'endorsements': 'Endorsement Videos',
        'issue_advocacy': 'Issue Advocacy',
        'success_stories': 'Success Stories'
      },
      // Add mappings for other categories as needed
    };
    
    return subcategoryMaps[category]?.[subcategory] || 
           subcategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Helper function to display permission in a user-friendly way
  const formatPermission = (permission) => {
    if (!permission) return 'No Access';
    
    switch(permission) {
      case 'admin':
        return 'Admin (Full Access)';
      case 'read/write':
        return 'Editor (Read/Write)';
      case 'readonly':
        return 'Viewer (Read Only)';
      default:
        return permission;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {isUpdateMode ? "Review Your Campaign Updates" : "Review Your Campaign"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isUpdateMode 
            ? "Please review all information before updating your campaign."
            : "Please review all information before creating your campaign."}
        </p>
      </div>

      {/* Namespace Information */}
      {currentNamespace && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Namespace</h4>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary-text-600 dark:text-primary-text-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{currentNamespace}</span>
              </div>
              {userPermission && (
                <div className="flex items-center gap-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/50 rounded-md">
                  <Shield className="h-3.5 w-3.5 text-primary-text-600 dark:text-primary-text-400" />
                  <span className="text-xs font-medium text-primary-700 dark:text-primary-300">{formatPermission(userPermission)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Campaign Information */}
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Campaign Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Internal Name</span>
                <span className="text-sm text-gray-900 dark:text-white">{formData.name || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Campaign Title</span>
                <span className="text-sm text-gray-900 dark:text-white">{formData.title || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Campaign Description</span>
                <span className="text-sm text-gray-900 dark:text-white">{formData.description || 'Not provided'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Category</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatCategoryName(formData.category)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Subcategory</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formData.subcategory ? formatSubcategoryName(formData.category, formData.subcategory) : 'None'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Theme</span>
                <span className="text-sm text-gray-900 dark:text-white">{getThemeName()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-6"></div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Media</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Campaign Image</span>
              {previewImage ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img 
                    src={previewImage} 
                    alt="Campaign" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Image className="h-4 w-4" />
                  <span>No image provided</span>
                </div>
              )}
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Explainer Video</span>
              {hasExplainerVideo && explainerVideo ? (
                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <video 
                    src={explainerVideo} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Video className="h-4 w-4" />
                  <span>{hasExplainerVideo ? 'Video not uploaded' : 'Explainer video disabled'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Survey Questions */}
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-6"></div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Survey Questions</h4>
          {surveyQuestions && surveyQuestions.length > 0 ? (
            <div className="space-y-4">
              {surveyQuestions.map((q, index) => (
                <div key={q.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Question {index + 1}</span>
                  <span className="text-sm text-gray-900 dark:text-white">{q.question || 'Empty question'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">No survey questions added</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 