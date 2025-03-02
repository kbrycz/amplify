import React, { useState, useEffect } from 'react';
import { Upload, Video, Clock, X, Wand2, Sparkles, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_URL, auth } from '../lib/firebase';
import { EmptyState } from '../components/ui/empty-state'; 
import { VideoEditorModal } from '../components/responses/VideoEditorModal';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export default function VideoEnhancer() {
  const [activeTab, setActiveTab] = useState('upload');
  const [videoFile, setVideoFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [videos, setVideos] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [abortController, setAbortController] = useState(null);
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch the enhancer videos for the current user
  const fetchVideos = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.get(`${SERVER_URL}/videoEnhancer`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      setVideos(response.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle file selection and validate video duration
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError('');
      // Create a temporary video element to load metadata
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        setVideoDuration(duration);

        if (duration > 180) {
          setError('Video is too long. Maximum duration is 3 minutes.');
          setVideoFile(null);
        } else if (duration < 10) {
          setError('Video is too short. Minimum duration is 10 seconds.');
          setVideoFile(null);
        } else {
          setError('');
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
    setError('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format duration (in seconds) as mm:ss
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Upload the raw video via our server endpoint
  const handleUpload = async () => {
    if (!videoFile) return;
    setUploadStatus('Uploading...');
    setIsUploading(true);
    setError('');
    try {
      const idToken = await auth.currentUser.getIdToken();
      const controller = new AbortController();
      setAbortController(controller);

      const formData = new FormData();
      formData.append('video', videoFile.file);

      const response = await fetch(`${SERVER_URL}/videoEnhancer/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        body: formData,
        signal: controller.signal,
      });

      // Create a reader to read the response stream
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');

      let receivedLength = 0;
      while(true) {
        const {done, value} = await reader.read();
        
        if (done) {
          break;
        }
        
        receivedLength += value.length;
        const progress = (receivedLength / contentLength) * 100;
        setUploadProgress(Math.round(progress));
      }

      setUploadStatus('Upload successful!');
      setVideoFile(null);
      setVideoDuration(null);
      setUploadProgress(0);
      setAbortController(null);
      fetchVideos();
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Upload cancelled');
      } else {
        console.error('Upload error:', err);
        setError(err.message);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setAbortController(null);
    }
  };

  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  // Trigger processing (i.e. enhance) the video via the server which calls Shotstack
  const handleProcess = async (videoId) => {
    setProcessingId(videoId);
    setError('');
    try {
      const idToken = await auth.currentUser.getIdToken();
      const payload = {
        videoId,
        desiredLength: 60,         // seconds; adjust as needed
        transitionEffect: 'fade',  // can be 'fade', 'slideUp', etc.
        captionText: 'Enhanced by Shotstack',
        backgroundMusic: '',       // leave empty to use server default
        outputResolution: '1080x1920'
      };
      const response = await axios.post(`${SERVER_URL}/videoEnhancer/process`, payload, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      // Update the video with the processed video URL
      setVideos(prevVideos =>
        prevVideos.map(v => v.id === videoId ? { ...v, processedVideoUrl: response.data.processedVideoUrl } : v)
      );
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedVideo) return;
    setIsDeleting(true);
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoEnhancer/${selectedVideo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete video');
      }

      // Remove from local state
      setVideos(prev => prev.filter(v => v.id !== selectedVideo.id));
      setIsDeleteModalOpen(false);
      setSelectedVideo(null);
    } catch (err) {
      console.error('Error deleting video:', err);
      setError(err.message || 'Failed to delete video');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Video Enhancer</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Transform your videos with AI-powered enhancement tools</p>
        </div>

        <button
          onClick={() => setActiveTab('upload')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          <Upload className="h-4 w-4" />
          Upload Video
        </button>
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
            <label className="relative flex flex-col items-center justify-center w-full h-48 overflow-hidden border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
              {videoFile ? (
                <div className="relative w-full h-full p-4">
                  <video
                    src={videoFile.url}
                    className="w-full h-full object-contain rounded-lg"
                    controls
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/80 text-white backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="mb-2">Uploading... {uploadProgress}%</div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancelUpload();
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                        >Cancel Upload</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full p-3 bg-blue-100 dark:bg-blue-900/50">
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Click to upload a video
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Video must be between 10 seconds and 3 minutes
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

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={!videoFile || videoDuration < 10 || videoDuration > 180 || isUploading}
                onClick={() => {
                  setSelectedVideo(videoFile);
                  setIsVideoEditorOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                Enhance with AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          {videos.length === 0 ? (
            <EmptyState
              title="No enhanced videos yet"
              description="Upload a video to start enhancing it with our AI tools."
              icon={Video}
              primaryAction={{
                label: 'Upload Video',
                onClick: () => setActiveTab('upload'),
                icon: <Upload className="h-5 w-5" />
              }}
            />
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full sm:w-48 overflow-hidden rounded-lg">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.name}
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
                    <span>{video.duration ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}` : 'N/A'}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {video.name || 'Untitled Video'}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {video.createdAt ? formatDate(video.createdAt) : 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {video.processedVideoUrl ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo(video);
                          setIsVideoEditorOpen(true);
                        }}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo(video);
                          setIsDeleteModalOpen(true);
                        }}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo(video);
                          setIsVideoEditorOpen(true);
                        }}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo(video);
                          setIsDeleteModalOpen(true);
                        }}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <VideoEditorModal
        isOpen={isVideoEditorOpen}
        onClose={() => setIsVideoEditorOpen(false)}
        video={selectedVideo}
        onSave={async () => {
          await fetchVideos();
          setIsVideoEditorOpen(false);
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        isLoading={isDeleting}
      />

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}