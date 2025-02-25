import React from 'react';

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}