import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Plus, PaintBucket, Type } from 'lucide-react';
import TemplateRow from './TemplateRow';
import { RecentCampaignSkeleton } from '../../components/ui/skeleton';

export default function TemplateList({ 
  isLoading, 
  templates, 
  isEditMode, 
  onDelete, 
  onUpdate, 
  onTemplateClick, 
  onNewTemplate, 
  currentNamespaceId
}) {
  // When loading, show a skeleton
  if (isLoading) {
    return <RecentCampaignSkeleton />;
  }

  // If there are templates, render the list
  if (templates.length > 0) {
    return (
      <div className="space-y-3">
        {templates.map((template) => (
          <TemplateRow
            key={template.id}
            template={template}
            onDelete={onDelete}
            onUpdate={onUpdate}
            isEditMode={isEditMode}
            onTemplateClick={onTemplateClick}
            currentNamespaceId={currentNamespaceId}
          />
        ))}
      </div>
    );
  }

  // Otherwise, render an empty state
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-50 dark:from-indigo-900/20 dark:via-gray-900 dark:to-gray-900" />
      <div className="relative">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
              <Image className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create Your First Template
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Start creating video templates for your campaigns. Templates help you maintain consistent branding and styling across all your videos.
          </p>
          <button
            onClick={onNewTemplate}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-indigo-500 hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Create Template
          </button>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <Image className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Custom Branding</h3>
              <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                Apply your brand colors and styles
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                <Type className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Caption Options</h3>
              <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                Customize caption styles and positions
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <PaintBucket className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Color Schemes</h3>
              <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                Define custom color schemes for videos
              </p>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Need help getting started?</span>
            <Link
              to="/app/support"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View our guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 