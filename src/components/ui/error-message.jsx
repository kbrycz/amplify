import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 max-w-[800px]">
      <AlertCircle className="h-5 w-5" />
      {message}
    </div>
  );
}