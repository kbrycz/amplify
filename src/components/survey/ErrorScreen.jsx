import React from 'react';
import { X } from 'lucide-react';

export function ErrorScreen({ error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="rounded-full bg-red-100 p-3 mx-auto w-fit dark:bg-red-900/50">
          <X className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Survey Not Found</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    </div>
  );
}