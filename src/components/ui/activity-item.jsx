import React from 'react';

export function ActivityItem({ icon: Icon, color, title, description, time }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          {time}
        </p>
      </div>
    </div>
  );
}