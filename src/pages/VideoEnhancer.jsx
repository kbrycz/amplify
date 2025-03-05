import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { SERVER_URL, auth } from '../lib/firebase';
import { VideoEditorModal } from '../components/responses/VideoEditorModal';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { TransformModal } from '../components/responses/TransformModal';
import { useToast } from '../components/ui/toast-notification';
import UploadTab from '../components/videoEnhancer/UploadTab';
import VideosTab from '../components/videoEnhancer/VideosTab';
import { formatDate, formatDuration } from '../components/videoEnhancer/VideoEnhancerUtils';

export default function VideoEnhancer() {
  // State variables
  const [activeTab, setActiveTab] = useState('upload');
  const [videoFile, setVideoFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
  const [isUploadProcessing, setIsUploadProcessing] = useState(false);
  const [uploadProcessingId, setUploadProcessingId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentToastId, setCurrentToastId] = useState(null);
  const { addToast } = useToast();

  // For polling intervals
  const activePollingIntervals = useRef(new Map());

  // Fetch videos from the server
  const fetchVideos = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.get(`${SERVER_URL}/videoEnhancer`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const fetchedVideos = response.data;
      setVideos(fetchedVideos);

      // Determine processing IDs from server data
      const serverProcessingIds = new Set(
        fetchedVideos.filter(video => video.status === 'processing').map(video => video.id)
      );

      // Remove any IDs that are no longer processing
      [...processingIds].forEach(videoId => {
        const video = fetchedVideos.find(v => v.id === videoId);
        if (video && video.status === 'completed') {
          addToast('Video enhancement completed successfully!', 'success');
          setProcessingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          if (videoId === uploadProcessingId) {
            setIsUploadProcessing(false);
            setUploadProcessingId(null);
            setVideoFile(null);
            setVideoDuration(null);
          }
          if (activePollingIntervals.current.has(videoId)) {
            clearInterval(activePollingIntervals.current.get(videoId));
            activePollingIntervals.current.delete(videoId);
          }
        } else if (!video || video.status !== 'processing') {
          setProcessingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          if (activePollingIntervals.current.has(videoId)) {
            clearInterval(activePollingIntervals.current.get(videoId));
            activePollingIntervals.current.delete(videoId);
          }
        }
      });

      // Start polling for any new processing videos
      serverProcessingIds.forEach(videoId => {
        if (!processingIds.has(videoId)) {
          setProcessingIds(prev => new Set([...prev, videoId]));
        }
        if (!activePollingIntervals.current.has(videoId)) {
          handleVideoProcessingStart(videoId);
        }
      });
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
    return () => {
      activePollingIntervals.current.forEach(intervalId => clearInterval(intervalId));
    };
  }, []);

  // Handle video processing start and polling for status
  const handleVideoProcessingStart = (videoId, initialToastId = null, renderId = null) => {
    const toastId = currentToastId || initialToastId;
    setProcessingIds(prev => new Set([...prev, videoId]));
    if (activeTab === 'upload') {
      setIsUploadProcessing(true);
      setUploadProcessingId(videoId);
    }
    if (activePollingIntervals.current.has(videoId)) {
      clearInterval(activePollingIntervals.current.get(videoId));
    }
    setCurrentToastId(null);

    const checkInitialStatus = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${SERVER_URL}/videoEnhancer/status/${videoId}`, {
          headers: { 'Authorization': `Bearer ${idToken}` },
        });
        if (!response.ok) {
          console.error('Failed to check initial video status:', response.status);
          return false;
        }
        const data = await response.json();
        setVideos(prevVideos =>
          prevVideos.map(v =>
            v.id === videoId
              ? { ...v, status: data.status, error: data.error, processedVideoUrl: data.processedVideoUrl || v.processedVideoUrl, renderId: renderId || v.renderId }
              : v
          )
        );
        if (data.status === 'completed') {
          setProcessingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          if (videoId === uploadProcessingId) {
            setIsUploadProcessing(false);
            setUploadProcessingId(null);
            setVideoFile(null);
            setVideoDuration(null);
          }
          if (toastId) {
            addToast('Video enhancement completed successfully!', 'success', 5000, toastId);
          }
          fetchVideos();
          return true;
        }
        if (data.status === 'failed') {
          setProcessingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
          if (videoId === uploadProcessingId) {
            setIsUploadProcessing(false);
            setUploadProcessingId(null);
          }
          const errorMessage = data.error || 'Video enhancement failed';
          if (toastId) {
            addToast(errorMessage, 'error', 10000, toastId);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking initial video status:', error);
        if (videoId === uploadProcessingId) {
          setIsUploadProcessing(false);
          setUploadProcessingId(null);
        }
        return false;
      }
    };

    checkInitialStatus().then(isAlreadyResolved => {
      if (!isAlreadyResolved) {
        const pollStatus = async () => {
          try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch(`${SERVER_URL}/videoEnhancer/status/${videoId}`, {
              headers: { 'Authorization': `Bearer ${idToken}` },
            });
            if (!response.ok) {
              console.error('Failed to check video status:', response.status);
              return;
            }
            const data = await response.json();
            setVideos(prevVideos =>
              prevVideos.map(v =>
                v.id === videoId
                  ? { ...v, status: data.status, error: data.error, processedVideoUrl: data.processedVideoUrl || v.processedVideoUrl, renderId: renderId || v.renderId }
                  : v
              )
            );
            if (data.status === 'completed') {
              clearInterval(activePollingIntervals.current.get(videoId));
              activePollingIntervals.current.delete(videoId);
              setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(videoId);
                return newSet;
              });
              if (videoId === uploadProcessingId) {
                setIsUploadProcessing(false);
                setUploadProcessingId(null);
                setVideoFile(null);
                setVideoDuration(null);
              }
              if (toastId) {
                addToast(
                  <div className="flex flex-col space-y-3">
                    <p className="font-semibold text-base">Success! Your enhanced video is ready.</p>
                    <button 
                      onClick={() => setActiveTab('videos')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium mt-1 w-full text-center"
                    >
                      View Enhanced Videos
                    </button>
                  </div>,
                  "success",
                  15000,
                  toastId
                );
              }
              fetchVideos();
            } else if (data.status === 'failed') {
              clearInterval(activePollingIntervals.current.get(videoId));
              activePollingIntervals.current.delete(videoId);
              setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(videoId);
                return newSet;
              });
              if (videoId === uploadProcessingId) {
                setIsUploadProcessing(false);
                setUploadProcessingId(null);
              }
              const errorMessage = data.error || 'Video enhancement failed';
              if (toastId) {
                addToast(errorMessage, 'error', 10000, toastId);
              }
            }
          } catch (error) {
            console.error('Error polling video status:', error);
            if (error.retryCount >= 3 && videoId === uploadProcessingId) {
              setIsUploadProcessing(false);
              setUploadProcessingId(null);
              clearInterval(activePollingIntervals.current.get(videoId));
              activePollingIntervals.current.delete(videoId);
              setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(videoId);
                return newSet;
              });
              addToast('Failed to check video status. Please try again.', 'error');
            }
            error.retryCount = (error.retryCount || 0) + 1;
          }
        };
        pollStatus();
        const intervalId = setInterval(pollStatus, 5000);
        activePollingIntervals.current.set(videoId, intervalId);
      }
    });
  };

  // Delete a video
  const handleDelete = async () => {
    if (!selectedVideo) return;
    setIsDeleting(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoEnhancer/${selectedVideo.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });
      if (!response.ok) {
        throw new Error('Failed to delete video');
      }
      addToast('Video deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setSelectedVideo(null);
      fetchVideos();
    } catch (error) {
      console.error('Delete error:', error);
      addToast(`Failed to delete video: ${error.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle dropdown for video options
  const toggleDropdown = (videoId) => {
    setOpenDropdownId(openDropdownId === videoId ? null : videoId);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Video Enhancer</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Transform your videos with AI-powered enhancement tools</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'upload' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Upload
            {activeTab === 'upload' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'videos' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
          >
            Videos
            {activeTab === 'videos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <UploadTab
          videoFile={videoFile}
          setVideoFile={setVideoFile}
          videoDuration={videoDuration}
          setVideoDuration={setVideoDuration}
          error={error}
          setError={setError}
          isUploadProcessing={isUploadProcessing}
          uploadProcessingId={uploadProcessingId}
          setActiveTab={setActiveTab}
          handleVideoUpload={(e) => {
            const file = e.target.files[0];
            if (file) {
              setError('');
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
                  const videoFileObj = {
                    file: file,
                    url: URL.createObjectURL(file),
                    duration: duration
                  };
                  setVideoFile(videoFileObj);
                }
              };
              video.onerror = function() {
                setError('Error loading video. Please try another file.');
                setVideoFile(null);
              };
              video.src = URL.createObjectURL(file);
            }
          }}
          handleRemoveVideo={() => { setVideoFile(null); setVideoDuration(null); setError(''); }}
          setSelectedVideo={setSelectedVideo}
          setIsTransformModalOpen={setIsTransformModalOpen}
        />
      )}

      {activeTab === 'videos' && (
        <VideosTab
          videos={videos}
          processingIds={processingIds}
          openDropdownId={openDropdownId}
          toggleDropdown={toggleDropdown}
          formatDate={formatDate}
          formatDuration={formatDuration}
          setSelectedVideo={setSelectedVideo}
          setIsVideoEditorOpen={setIsVideoEditorOpen}
          handleProcess={handleVideoProcessingStart}
          addToast={addToast}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
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

      <TransformModal
        isOpen={isTransformModalOpen}
        onClose={() => setIsTransformModalOpen(false)}
        video={selectedVideo}
        endpoint="/videoEnhancer/upload"
        onProcessingStart={handleVideoProcessingStart}
        onTransformStart={() => {
          const toastId = addToast("Starting video enhancement process...", "info", 0);
          setCurrentToastId(toastId);
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