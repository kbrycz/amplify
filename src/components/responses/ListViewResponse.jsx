import React from 'react';
import { Play, Clock, Circle } from 'lucide-react';

export function ListViewResponse({ response, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-48 flex-shrink-0 overflow-hidden rounded-lg">
        {response.isNew && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
            <Circle className="h-2 w-2 fill-current" />
            <span>New</span>
          </div>
        )}
        <img
          src={response.thumbnailUrl || 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=2073'}
          alt={response.name || 'Video response'}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          <span>{response.createdAt ? new Date(response.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {response.name || 'Anonymous'}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {response.email || 'No email provided'}
        </p>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{response.zipCode || 'No zip code'}</span>
          <span>{response.createdAt ? new Date(response.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) : 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
}