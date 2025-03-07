import React from 'react';
import { CheckCircle } from 'lucide-react';

export function SuccessMessage({ message }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400 max-w-[800px]">
      <CheckCircle className="h-5 w-5" />
      {message}
    </div>
  );
}