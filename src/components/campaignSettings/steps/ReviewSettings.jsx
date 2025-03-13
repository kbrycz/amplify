import React from 'react';
import { Building, Info, Shield, Users } from 'lucide-react';

export const ReviewSettings = ({
  formData,
  surveyQuestions,
  previewImage,
  selectedTheme,
  themes,
  hasExplainerVideo,
  explainerVideo,
  currentNamespace,
  userPermission,
  setIsDeleteModalOpen
}) => {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Campaign Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Review your campaign settings before updating.
        </p>
      </div>

      <div className="space-y-6">
        {/* Namespace Information */}
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200 dark:bg-primary-900/20 dark:border-primary-900/50">
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-primary-100 dark:bg-primary-900/50">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300">
                Namespace Information
              </h3>
              <p className="mt-1 text-sm text-primary-700 dark:text-primary-400">
                This campaign belongs to the <strong>{currentNamespace}</strong> namespace.
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span className="text-xs text-primary-700 dark:text-primary-400">
                  Your permission: {formatPermission(userPermission)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Basic Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Internal Name</p>
              <p className="text-sm text-gray-900 dark:text-white">{formData.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Campaign Title</p>
              <p className="text-sm text-gray-900 dark:text-white">{formData.title || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Campaign Description</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formData.description || 'Not set'}
              </p>
            </div>
            {previewImage && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Campaign Image</p>
                <img
                  src={previewImage}
                  alt="Campaign preview"
                  className="rounded-lg border border-gray-200 dark:border-gray-800 object-cover w-full max-h-[150px]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Design Settings */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Design Settings
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Theme</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {themes[selectedTheme]?.name || selectedTheme}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Theme Preview</p>
              <div
                className="w-full h-16 rounded-md"
                style={{
                  background: themes[selectedTheme]?.gradient
                    ? `linear-gradient(to ${themes[selectedTheme]?.direction || 'right'}, ${themes[selectedTheme]?.colors.join(', ')})`
                    : themes[selectedTheme]?.colors[0]
                }}
              />
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Campaign Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Survey Questions</p>
              {surveyQuestions.length > 0 ? (
                <ul className="mt-1 space-y-2">
                  {surveyQuestions.map((q, index) => (
                    <li key={q.id} className="text-sm text-gray-900 dark:text-white">
                      {index + 1}. {q.question || 'Empty question'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-900 dark:text-white">No survey questions</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Explainer Video</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {hasExplainerVideo
                  ? typeof explainerVideo === 'string'
                    ? explainerVideo || 'Video URL not set'
                    : explainerVideo
                    ? 'Video file uploaded'
                    : 'No video selected'
                  : 'Disabled'}
              </p>
            </div>
          </div>
        </div>

        {/* Response Settings */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Response Settings
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Business Name</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formData.businessName || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formData.website || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contact Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{formData.email || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contact Phone</p>
                <p className="text-sm text-gray-900 dark:text-white">{formData.phone || 'Not set'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Response Notifications</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formData.notificationsEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Ready to update your campaign settings?
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
              Click the "Update Campaign" button below to save your changes. If you need to make any adjustments, use the "Previous" button to go back to the relevant section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 