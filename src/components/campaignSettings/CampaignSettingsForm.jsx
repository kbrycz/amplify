import React from 'react';
import BasicSettingsCard from './BasicSettingsCard';
import DesignCard from './DesignCard';
import CampaignDetailsCard from './CampaignDetailsCard';
import ResponseSettingsCard from './ResponseSettingsCard';
import { Save, Trash2 } from 'lucide-react';

export default function CampaignSettingsForm({
  campaign,
  handleSubmit,
  isSaving,
  isDeleting,
  successMessage,
  error,
  selectedTheme,
  setSelectedTheme,
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen,
  setIsDeleteModalOpen,
  currentNamespace,
  userPermission,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicSettingsCard campaign={campaign} />
      <DesignCard
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
      />
      <CampaignDetailsCard
        campaign={campaign}
        surveyQuestions={surveyQuestions}
        handleAddQuestion={handleAddQuestion}
        handleRemoveQuestion={handleRemoveQuestion}
        handleQuestionChange={handleQuestionChange}
        setIsHelpOpen={setIsHelpOpen}
      />
      <ResponseSettingsCard campaign={campaign} />

      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Campaign
            </>
          )}
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}