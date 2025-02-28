import React, { useState } from 'react';
import { Upload, Video, Clock, X } from 'lucide-react';

const mockVideos = [
  {
    id: 1,
    name: 'Product Demo',
    status: 'Complete',
    duration: '2:45',
    createdAt: '2024-03-19T10:30:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=2073'
  },
  {
    id: 2,
    name: 'Team Introduction',
    status: 'Processing',
    duration: '3:15',
    createdAt: '2024-03-18T15:20:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070'
  },
  {
    id: 3,
    name: 'Customer Testimonial',
    status: 'Complete',
    duration: '1:30',
    createdAt: '2024-03-17T09:15:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070'
  }
];

export default function VideoEnhancer() {
  const [activeTab, setActiveTab] = useState('upload');
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary video element to check duration
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        setVideoDuration(duration);

        if (duration > 300) { // 5 minutes
          setError('Video is too long. Maximum duration is 5 minutes.');
          setVideoFile(null);
        } else if (duration < 10) { // 10 seconds
          setError('Video is too short. Minimum duration is 10 seconds.');
          setVideoFile(null);
        } else {
          setError(null);
          setVideoFile({
            file,
            url: URL.createObjectURL(file),
            duration
          });
        }
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoDuration(null);
    setError(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Video Enhancer</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Upload and enhance your videos with AI-powered tools
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === 'upload'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Upload
            {activeTab === 'upload' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === 'videos'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Videos
            {activeTab === 'videos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        </div>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <label className="relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
              {videoFile ? (
                <div className="relative w-full h-full p-4">
                  <video
                    src={videoFile.url}
                    className="w-full h-full object-cover rounded-lg"
                    controls
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/80 text-white backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    Click to upload a video
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Video must be between 10 seconds and 5 minutes
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleVideoUpload}
              />
            </label>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            {videoFile && !error && (
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Video className="w-4 h-4" />
                  Enhance Video
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          {mockVideos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full sm:w-48 overflow-hidden rounded-lg">
                <img
                  src={video.thumbnailUrl}
                  alt={video.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  <span>{video.duration}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {video.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    video.status === 'Complete'
                      ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20'
                      : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-500/20'
                  }`}>
                    {video.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(video.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}