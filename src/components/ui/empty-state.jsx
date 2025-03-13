import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = Video,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  primaryAction,
  secondaryAction
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 mt-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-white to-white opacity-50 dark:from-primary-900/20 dark:via-gray-900 dark:to-gray-900" />
      
      <div className="relative">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary-100 p-2.5 dark:bg-primary-900/50">
              <Icon className="h-6 w-6 text-primary-text-600 dark:text-primary-text-400" />
            </div>
          </div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          
          {primaryAction && (
            <div className="mt-6">
              <button
              onClick={primaryAction.onClick}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500"
              >
              {primaryAction.icon}
              {primaryAction.label}
              </button>
            </div>
          )}
          
          {secondaryAction && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{secondaryAction.text}</span>
              <Link
                to={secondaryAction.href}
                className="font-medium text-primary-text-600 hover:text-primary-500 dark:text-primary-text-400 dark:hover:text-primary-300"
              >
                {secondaryAction.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}