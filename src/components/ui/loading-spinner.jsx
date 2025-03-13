import React from 'react';

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-600 dark:border-t-primary-400 animate-spin" />
        </div>
        <p className="text-base font-medium text-gray-900 dark:text-white">
          {message}
        </p>
      </div>
    </div>
  );
}