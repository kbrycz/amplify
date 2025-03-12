import React, { useRef } from 'react';
import { FileText, ChevronDown, X } from 'lucide-react';
import { DraftsDropdown } from '../DraftsDropdown';

export const DraftSection = ({ 
  drafts, 
  isLoadingDrafts, 
  isDraftsOpen, 
  setIsDraftsOpen, 
  handleLoadDraft, 
  handleDeleteDraft, 
  selectedDraftId, 
  setSelectedDraftId, 
  setIsEditingDraft, 
  isDeletingDraft, 
  deleteMessage 
}) => {
  const draftsRef = useRef(null);

  return (
    <div className={`relative max-w-[800px] mt-4`} ref={draftsRef}>
      {isLoadingDrafts ? (
        <div className="w-full flex items-center gap-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400">
          <div className="animate-pulse flex items-center gap-2 w-full">
            <div className="h-4 w-4 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="h-4 w-24 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="ml-auto flex items-center gap-2">
              <div className="h-4 w-16 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-4 w-4 bg-gray-300 rounded dark:bg-gray-700" />
            </div>
          </div>
        </div>
      ) : drafts.length > 0 ? (
        <button
          onClick={() => setIsDraftsOpen(!isDraftsOpen)}
          className="w-full flex items-center gap-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <FileText className="w-4 h-4" />
          <span className="font-medium">{drafts.length} draft{drafts.length !== 1 ? 's' : ''}</span>
          <span className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <span>Click to view</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDraftsOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>
      ) : (
        <div className="w-full flex items-center gap-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          <span className="font-medium">No drafts yet</span>
          <span className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            Save a draft to see it here
          </span>
        </div>
      )}

      {/* Drafts Dropdown */}
      <DraftsDropdown
        isOpen={isDraftsOpen}
        drafts={drafts}
        handleLoadDraft={handleLoadDraft}
        handleDeleteDraft={handleDeleteDraft}
        setSelectedDraftId={setSelectedDraftId}
        selectedDraftId={selectedDraftId}
        setIsEditingDraft={setIsEditingDraft}
        isDeletingDraft={isDeletingDraft}
      />

      {/* Delete message display */}
      {deleteMessage && (
        <div role="alert" className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          deleteMessage.type === 'success'
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400'
        }`}>
          {deleteMessage.type === 'success' ? (
            <svg className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <X className="h-4 w-4" />
          )}
          {deleteMessage.message}
        </div>
      )}
    </div>
  );
}; 