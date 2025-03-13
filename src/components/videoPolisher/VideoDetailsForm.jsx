import React from 'react';
import { Save, Sparkles } from 'lucide-react';
import VideoInfoCard from './VideoInfoCard';
import TemplateSelectionCard from './TemplateSelectionCard';

export default function VideoDetailsForm({
  video,
  handleSubmit,
  handleInputChange,
  isProcessing,
  successMessage,
  error,
  selectedTemplate,
  setSelectedTemplate,
  onOpenTemplateModal
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VideoInfoCard 
        video={video}
        handleInputChange={handleInputChange}
      />
      
      <TemplateSelectionCard
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        onOpenTemplateModal={onOpenTemplateModal}
      />

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

      <div className="flex justify-end items-center">
        <button
          type="submit"
          disabled={isProcessing}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isProcessing ? (
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
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Use 1 Credit to Transform Video
            </>
          )}
        </button>
      </div>
    </form>
  );
} 