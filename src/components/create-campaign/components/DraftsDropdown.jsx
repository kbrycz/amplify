import React from 'react';
import { FileText, ChevronDown, Trash2, Check, X, Info, Shield } from 'lucide-react';

export function DraftsDropdown({ 
  isOpen, 
  drafts, 
  handleLoadDraft, 
  handleDeleteDraft, 
  setSelectedDraftId,
  isDeletingDraft,
  selectedDraftId,
  setIsEditingDraft
}) {
  if (!isOpen) return null;

  const handleDraftClick = (draftId) => {
    if (selectedDraftId === draftId) {
      // If clicking the same draft, unselect it
      setSelectedDraftId(null);
      setIsEditingDraft(false);
    } else {
      // Load the new draft
      handleLoadDraft(draftId);
    }
  };

  // Format date to a readable format
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if user can delete a draft based on their permission
  const canDeleteDraft = (draft) => {
    return draft.userPermission === 'admin';
  };

  // Check if user can edit a draft based on their permission
  const canEditDraft = (draft) => {
    return draft.userPermission === 'admin' || draft.userPermission === 'read/write';
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-lg border border-gray-200 shadow-lg z-10 dark:bg-gray-900 dark:border-gray-800">
      <div className="space-y-1">
        {drafts.slice().reverse().map((draft, index) => (
          <div
            key={draft.id}
            className="flex items-center gap-2 relative"
          >
            <button
              className={`flex-1 flex items-start gap-3 p-2 text-sm text-left rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedDraftId === draft.id && !isDeletingDraft
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300'
              } ${!canEditDraft(draft) ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={() => canEditDraft(draft) && handleDraftClick(draft.id)}
              disabled={!canEditDraft(draft)}
              title={!canEditDraft(draft) ? "You don't have permission to edit this draft" : ""}
            >
              <div className="mt-0.5">
                {selectedDraftId === draft.id && !isDeletingDraft ? (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{draft.name || 'Untitled Draft'}</div>
                {draft.title && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Title: {draft.title}
                  </div>
                )}
                <div className="flex items-center justify-between mt-0.5">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last modified: {formatDate(draft.dateModified)}
                  </div>
                  {draft.userPermission && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                      <Shield className="w-3 h-3" />
                      <span>{draft.userPermission}</span>
                    </div>
                  )}
                </div>
                {draft.createdByName && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Created by: {draft.createdByName}
                  </div>
                )}
              </div>
            </button>
            <button
              onClick={() => {
                setSelectedDraftId(draft.id);
                handleDeleteDraft(draft.id);
              }}
              className={`p-2 text-gray-500 hover:text-red-500 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-800 ${
                (isDeletingDraft && selectedDraftId === draft.id) ? 'opacity-50 cursor-not-allowed' : 
                !canDeleteDraft(draft) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isDeletingDraft || !canDeleteDraft(draft)}
              title={!canDeleteDraft(draft) ? "Only admins can delete drafts" : "Delete draft"}
            >
              {isDeletingDraft && selectedDraftId === draft.id ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}