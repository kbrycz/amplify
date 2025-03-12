import React from 'react';
import { Plus, Edit2 } from 'lucide-react';

export default function ManageNamespaceHeader({ onNewNamespace, hasNamespaces, isEditMode, onToggleEditMode }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Manage Namespaces
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Namespaces allow you to organize your content and control access for different teams or projects. 
            Each namespace can have its own members with different permission levels.
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 flex space-x-3">
          {isEditMode ? (
            <button
              onClick={onToggleEditMode}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          ) : (
            <button
              onClick={onToggleEditMode}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Namespaces
            </button>
          )}
          <button
            onClick={onNewNamespace}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Namespace
          </button>
        </div>
      </div>
    </div>
  );
} 