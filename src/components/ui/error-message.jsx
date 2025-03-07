import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }) {
  return (
    <div className="my-8 flex items-center gap-3 rounded-lg bg-red-50 px-6 py-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 max-w-[800px] shadow-sm">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}