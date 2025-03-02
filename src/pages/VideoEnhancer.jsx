import React, { useState, useEffect } from 'react';
import { Upload, Video, Clock, X } from 'lucide-react';
import axios from 'axios';
import { SERVER_URL, auth } from '../lib/firebase';
import { EmptyState } from '../components/ui/empty-state';

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Video Enhancer</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Upload and enhance your videos with AI-powered tools.
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Video must be between 10 seconds and 3 minutes.
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
            <label className="relative flex flex-col items-center justify-center w-full max-h-[300px] aspect-video overflow-hidden border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
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
                          onClick={handleCancelUpload}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >Cancel Upload</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <Upload className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    Click to upload a video
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Video must be between 10 seconds and 3 minutes.
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
          </div>
          {/* Bottom button: Only enabled if a valid video is uploaded */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={!videoFile || videoDuration < 10 || videoDuration > 180 || isUploading}
              onClick={handleUpload}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white disabled:opacity-50`}
            >
              {isUploading ? `Uploading ${uploadProgress}%...` : 'Upload Video'}
            </button>
          </div>
          {uploadStatus && <p className="mt-2 text-green-600">{uploadStatus}</p>}
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
                    <span>{video.duration ? video.duration : 'N/A'}</span>
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

                {/* Action: Process or Play Enhanced Video */}
                <div className="flex items-center">
                  {video.processedVideoUrl ? (
                    <a
                      href={video.processedVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Play Enhanced Video
                    </a>
                  ) : (
                    <button
                      onClick={() => handleProcess(video.id)}
                      disabled={processingId === video.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processingId === video.id ? 'Processing...' : 'Enhance Video'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}