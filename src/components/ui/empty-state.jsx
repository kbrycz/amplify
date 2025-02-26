import React from 'react';
import { Link } from 'react-router-dom';
import { FeatureGrid } from './feature-grid';

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  features
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-50 dark:from-indigo-900/20 dark:via-gray-900 dark:to-gray-900" />
      
      <div className="relative">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
              <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">{description}</p>
          
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-indigo-500 hover:scale-105"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </button>
          )}
          
          {features && <FeatureGrid features={features} />}
          
          {secondaryAction && (
            <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{secondaryAction.text}</span>
              <Link
                to={secondaryAction.href}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
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