import React from 'react';
import { Video, Upload, Clock, ChevronDown, Loader2, Pencil, Trash2, Wand2 } from 'lucide-react';
import { EmptyState } from '../ui/empty-state';

const VideosTab = ({
  videos,
  processingIds,
  openDropdownId,
  toggleDropdown,
  formatDate,
  formatDuration,
  setSelectedVideo,
  setIsVideoEditorOpen,
  handleProcess,
  addToast,
  setIsDeleteModalOpen
}) => {
  return (
    <div className="space-y-4">
      {videos.length === 0 ? (
        <EmptyState
          title="No enhanced videos yet"
          description="Upload a video to start enhancing it with our AI tools."
          icon={Video}
          primaryAction={{
            label: 'Upload Video',
            onClick: () => setIsVideoEditorOpen(false) || toggleDropdown('upload'),
            icon: <Upload className="h-5 w-5" />
          }}
        />
      ) : (
        videos.map((video) => {
          const isProcessing = processingIds.has(video.id) || video.status === 'processing';
          const isDropdownOpen = openDropdownId === video.id;
          return (
            <div
              key={video.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div 
                className="flex flex-col sm:flex-row items-start gap-4 p-4 cursor-pointer"
                onClick={() => toggleDropdown(video.id)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full sm:w-48 overflow-hidden rounded-lg">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title || 'Video'}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                      <Video className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                    <Clock className="h-3 w-3" />
                    <span>
                      {video.duration
                        ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}`
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Video info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {video.title || 'Untitled Video'}
                    </h3>
                    <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {video.createdAt ? formatDate(video.createdAt) : 'Unknown'}
                    </span>
                    {isProcessing && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing
                      </span>
                    )}
                    {video.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Failed
                      </span>
                    )}
                    {video.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </span>
                    )}
                  </div>
                  {video.status === 'failed' && video.error && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Error: {video.error}
                    </div>
                  )}
                  {video.processedVideoUrl && video.status === 'completed' && (
                    <div className="mt-2">
                      <a 
                        href={video.processedVideoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Video className="h-4 w-4" />
                        View Enhanced Video
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Dropdown actions */}
              {isDropdownOpen && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex flex-wrap gap-2">
                    {video.processedVideoUrl && video.status === 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          setIsVideoEditorOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                    {!(processingIds.has(video.id) || video.status === 'processing') && video.status !== 'completed' && (
                      <button
                        onClick={() => handleProcess(video.id)}
                        disabled={processingIds.has(video.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        {processingIds.has(video.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4" />
                            Transform
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedVideo(video);
                        setIsDeleteModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default VideosTab;