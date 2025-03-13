import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Check } from 'lucide-react';

export default function ManageTemplateHeader({
  isEditMode,
  onToggleEdit,
  onNewTemplate,
  hasTemplates,
  currentNamespace
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Manage Templates
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View, edit, and manage your video templates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasTemplates && (
            <button
              onClick={onToggleEdit}
              className={`inline-flex items-center gap-1.5 rounded-lg border ${
                isEditMode
                  ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } px-4 py-2 text-sm font-medium`}
            >
              {isEditMode ? (
                <>
                  <Check className="h-4 w-4" />
                  Done
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit
                </>
              )}
            </button>
          )}
          <button
            onClick={onNewTemplate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>
      </div>
    </div>
  );
} 