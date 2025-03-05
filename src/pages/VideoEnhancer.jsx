import React, { useState, useEffect, useRef } from 'react';
import { Upload, Video, Clock, X, Wand2, Sparkles, Pencil, Trash2, Loader2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { SERVER_URL, auth } from '../lib/firebase';
import { EmptyState } from '../components/ui/empty-state'; 
import { VideoEditorModal } from '../components/responses/VideoEditorModal';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { TransformModal } from '../components/responses/TransformModal';
import { useToast } from '../components/ui/toast-notification';

export default function VideoEnhancer() {
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
  
  // Store active polling intervals to clean them up when needed
  const activePollingIntervals = useRef(new Map());

  // Set up a ref to track if we need to start processing when the modal closes
  const pendingProcessRef = useRef(null);

  // Fetch the enhancer videos for the current user
  const fetchVideos = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.get(`${SERVER_URL}/videoEnhancer`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      
      const fetchedVideos = response.data;
      setVideos(fetchedVideos);
      
      // Get videos that are in processing state from the server
      const serverProcessingIds = new Set(
        fetchedVideos
          .filter(video => video.status === 'processing')
          .map(video => video.id)
      );
      
      // Check for any videos that are in our processingIds but are actually completed
      const currentProcessingIds = [...processingIds];
      for (const videoId of currentProcessingIds) {
        const video = fetchedVideos.find(v => v.id === videoId);
        if (video && video.status === 'completed') {
          // This video is completed but still in our processing state
          // Show success toast and update state
          addToast('Video enhancement completed successfully!', 'success');
          
          // Remove from processing IDs
          setProcessingIds(prev => {
            const newSet = new Set([...prev]);
            newSet.delete(videoId);
            return newSet;
          });
          
          // If this was from the upload tab, clear the upload processing state
          if (videoId === uploadProcessingId) {
            setIsUploadProcessing(false);
            setUploadProcessingId(null);
            setVideoFile(null);
            setVideoDuration(null);
          }
          
          // Clear any polling interval
          if (activePollingIntervals.current.has(videoId)) {
            clearInterval(activePollingIntervals.current.get(videoId));
            activePollingIntervals.current.delete(videoId);
          }
        } else if (!video || video.status !== 'processing') {
          // This video is no longer in the list or not in processing state
          // Remove from processing IDs
          setProcessingIds(prev => {
            const newSet = new Set([...prev]);
            newSet.delete(videoId);
            return newSet;
          });
          
          // Clear any polling interval
          if (activePollingIntervals.current.has(videoId)) {
            clearInterval(activePollingIntervals.current.get(videoId));
            activePollingIntervals.current.delete(videoId);
          }
        }
      }
      
      // Add any new processing videos from the server
      serverProcessingIds.forEach(videoId => {
        if (!processingIds.has(videoId)) {
          setProcessingIds(prev => new Set([...prev, videoId]));
        }
        
        // Set up polling for any videos that are processing but don't have an active interval
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
    
    // Clean up any active polling intervals when component unmounts
    return () => {
      activePollingIntervals.current.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    };
  }, []);

  // Handle file selection and validate video duration
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setError('');
      // Create a temporary video element to load metadata
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        setVideoDuration(duration);
        console.log("Video duration:", duration);

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
          console.log("Setting videoFile:", videoFileObj);
          setVideoFile(videoFileObj);
        }
      };
      video.onerror = function() {
        console.error("Error loading video metadata");
        setError('Error loading video. Please try another file.');
        setVideoFile(null);
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

  // Handle when the transform modal closes
  const handleTransformModalClose = () => {
    setIsTransformModalOpen(false);
  };

  // Handle when the transform modal starts processing
  const handleTransformStart = () => {
    // Show a loading toast
    const toastId = addToast(
      "Starting video enhancement process...",
      "info",
      0 // Don't auto-dismiss
    );
    
    // Store the toast ID so we can update it later
    setCurrentToastId(toastId);
  };

  // Handle video processing start and set up polling
  const handleVideoProcessingStart = (videoId, initialToastId = null, renderId = null) => {
    // Use the currentToastId if available, otherwise use the initialToastId
    const toastId = currentToastId || initialToastId;
    
    // Add this video ID to the set of processing videos
    setProcessingIds(prev => new Set([...prev, videoId]));
    
    // If this is from the upload tab, set the upload processing state
    if (activeTab === 'upload') {
      setIsUploadProcessing(true);
      setUploadProcessingId(videoId);
    }
    
    // Clear any existing polling for this video
    if (activePollingIntervals.current.has(videoId)) {
      clearInterval(activePollingIntervals.current.get(videoId));
    }
    
    // Reset the currentToastId after using it
    setCurrentToastId(null);
    
    // Check status immediately to see if it's already completed
    const checkInitialStatus = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${SERVER_URL}/videoEnhancer/status/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });
        
        if (!response.ok) {
          console.error('Failed to check initial video status:', response.status);
          return false;
        }
        
        const data = await response.json();
        console.log('Initial video status check:', data);
        
        // Update videos list with latest status
        setVideos(prevVideos => 
          prevVideos.map(v => 
            v.id === videoId 
              ? { 
                  ...v, 
                  status: data.status, 
                  error: data.error,
                  processedVideoUrl: data.processedVideoUrl || v.processedVideoUrl,
                  renderId: renderId || v.renderId
                } 
              : v
          )
        );
        
        // If already completed, handle it now
        if (data.status === 'completed') {
          // Remove from processing IDs
          setProcessingIds(prev => {
            const newSet = new Set([...prev]);
            newSet.delete(videoId);
            return newSet;
          });
          
          // If this was from the upload tab, clear the upload processing state
          if (videoId === uploadProcessingId) {
            setIsUploadProcessing(false);
            setUploadProcessingId(null);
            setVideoFile(null);
            setVideoDuration(null);
          }
          
          // Update toast with success message
          if (toastId) {
            addToast('Video enhancement completed successfully!', 'success', 5000, toastId);
          }
          
          // Refresh videos to get the latest data
          fetchVideos();
          
          return true; // Already completed, no need to poll
        }
        
        // If failed, handle it now
        if (data.status === 'failed') {
          // Remove from processing IDs
          setProcessingIds(prev => {
            const newSet = new Set([...prev]);
            newSet.delete(videoId);
            return newSet;
          });
          
          // If this was from the upload tab, clear the upload processing state
          if (videoId === uploadProcessingId) {
            setIsUploadProcessing(false);
            setUploadProcessingId(null);
          }
          
          // Update toast with error message
          const errorMessage = data.error || 'Video enhancement failed';
          if (toastId) {
            addToast(errorMessage, 'error', 10000, toastId);
          }
          
          return true; // Failed, no need to poll
        }
        
        return false; // Not completed or failed, continue with polling
      } catch (error) {
        console.error('Error checking initial video status:', error);
        
        // If there's an error, we should still clear the processing state
        if (videoId === uploadProcessingId) {
          setIsUploadProcessing(false);
          setUploadProcessingId(null);
        }
        
        return false;
      }
    };
    
    // Start the initial check and then set up polling if needed
    checkInitialStatus().then(isAlreadyResolved => {
      if (!isAlreadyResolved) {
        // Set up polling for this video's status
        const pollStatus = async () => {
          try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch(`${SERVER_URL}/videoEnhancer/status/${videoId}`, {
              headers: {
                'Authorization': `Bearer ${idToken}`,
              },
            });
            
            if (!response.ok) {
              console.error('Failed to check video status:', response.status);
              return;
            }
            
            const data = await response.json();
            console.log('Video status response:', data);
            
            // Update videos list with latest status
            setVideos(prevVideos => 
              prevVideos.map(v => 
                v.id === videoId 
                  ? { 
                      ...v, 
                      status: data.status, 
                      error: data.error,
                      processedVideoUrl: data.processedVideoUrl || v.processedVideoUrl,
                      renderId: renderId || v.renderId
                    } 
                  : v
              )
            );
            
            // Handle completed processing
            if (data.status === 'completed') {
              // Clear the interval
              clearInterval(activePollingIntervals.current.get(videoId));
              activePollingIntervals.current.delete(videoId);
              
              // Remove from processing IDs
              setProcessingIds(prev => {
                const newSet = new Set([...prev]);
                newSet.delete(videoId);
                return newSet;
              });
              
              // If this was from the upload tab, clear the upload processing state
              if (videoId === uploadProcessingId) {
                setIsUploadProcessing(false);
                setUploadProcessingId(null);
                setVideoFile(null); // Only remove the video from the upload container on success
                setVideoDuration(null);
              }
              
              // Update toast with success message
              if (toastId) {
                addToast(
                  <div className="flex flex-col space-y-3">
                    <p className="font-semibold text-base">Success! Your enhanced video is ready.</p>
                    <button 
                      onClick={() => {
                        setActiveTab('videos');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium mt-1 w-full text-center"
                    >
                      View Enhanced Videos
                    </button>
                  </div>,
                  "success",
                  15000, // Show for 15 seconds to give user time to click
                  toastId // Replace the existing toast
                );
              }
              
              // Refresh videos to get the latest data
              fetchVideos();
            }
            
            // Handle failed processing
            else if (data.status === 'failed') {
              // Clear the interval
              clearInterval(activePollingIntervals.current.get(videoId));
              activePollingIntervals.current.delete(videoId);
              
              // Remove from processing IDs
              setProcessingIds(prev => {
                const newSet = new Set([...prev]);
                newSet.delete(videoId);
                return newSet;
              });
              
              // If this was from the upload tab, clear the upload processing state
              if (videoId === uploadProcessingId) {
                setIsUploadProcessing(false);
                setUploadProcessingId(null);
              }
              
              // Update toast with error message
              const errorMessage = data.error || 'Video enhancement failed';
              if (toastId) {
                addToast(errorMessage, 'error', 10000, toastId);
              }
            }
          } catch (error) {
            console.error('Error polling video status:', error);
            
            // If there's an error, we should still clear the processing state after a few retries
            if (error.retryCount >= 3 && videoId === uploadProcessingId) {
              setIsUploadProcessing(false);
              setUploadProcessingId(null);
              
              // Clear the interval
              clearInterval(activePollingIntervals.current.get(videoId));
              activePollingIntervals.current.delete(videoId);
              
              // Remove from processing IDs
              setProcessingIds(prev => {
                const newSet = new Set([...prev]);
                newSet.delete(videoId);
                return newSet;
              });
              
              // Show error toast
              addToast('Failed to check video status. Please try again.', 'error');
            }
            
            // Add retry count to the error
            error.retryCount = (error.retryCount || 0) + 1;
          }
        };
        
        // Start polling immediately
        pollStatus();
        
        // Then set up interval (every 5 seconds)
        const intervalId = setInterval(pollStatus, 5000);
        activePollingIntervals.current.set(videoId, intervalId);
      }
    });
  };

  // Trigger processing (i.e. enhance) the video via the server which calls Shotstack
  const handleProcess = async (videoId) => {
    // Add this video ID to the set of processing videos
    setProcessingIds(prev => new Set([...prev, videoId]));
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
      
      // Show toast notification that processing has started
      const toastId = addToast("Video enhancement started. You'll be notified when it's complete.", "info", 0);
      
      // Start polling for status updates
      handleVideoProcessingStart(videoId, toastId);
      
      // Update the video with the processed video URL
      setVideos(prevVideos =>
        prevVideos.map(v => v.id === videoId ? { ...v, status: 'processing' } : v)
      );
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.response?.data?.error || err.message);
      addToast(err.response?.data?.error || err.message || "Failed to process video", "error");
      
      // Remove this video ID from the set of processing videos
      setProcessingIds(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(videoId);
        return newSet;
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedVideo) return;
    
    setIsDeleting(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoEnhancer/${selectedVideo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
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

  // Toggle dropdown for a video
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
                  {!isUploadProcessing && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/80 text-white backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {isUploadProcessing && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="flex items-center justify-center mb-2">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Processing video...</span>
                        </div>
                        <p className="text-sm">Your video is being enhanced with AI</p>
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
                disabled={isUploadProcessing}
              />
            </label>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-4 flex justify-between">
              {isUploadProcessing && uploadProcessingId && (
                <button
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  View All Videos
                </button>
              )}
              <div className="ml-auto">
                <button
                  type="button"
                  disabled={!videoFile || videoDuration < 10 || videoDuration > 180 || isUploadProcessing}
                  onClick={() => {
                    if (videoFile && videoFile.file) {
                      const videoObj = {
                        file: videoFile.file,
                        url: videoFile.url,
                        duration: videoDuration,
                        id: uploadProcessingId
                      };
                      console.log("Setting selectedVideo:", videoObj);
                      setSelectedVideo(videoObj);
                      setIsTransformModalOpen(true);
                    } else {
                      addToast("No video file selected", "error");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>
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
                        <span>{video.duration ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}` : 'N/A'}</span>
                      </div>
                    </div>

                    {/* Info */}
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
                      
                      {/* View processed video link */}
                      {video.processedVideoUrl && video.status === 'completed' && (
                        <div className="mt-2">
                          <a 
                            href={video.processedVideoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle when clicking the link
                          >
                            <Video className="h-4 w-4" />
                            View Enhanced Video
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Dropdown content */}
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
                        
                        {!isProcessing && video.status !== 'completed' && (
                          <button
                            onClick={() => handleProcess(video.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                          >
                            {isProcessing ? (
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
        onClose={handleTransformModalClose}
        video={selectedVideo}
        endpoint="/videoEnhancer/upload"
        onProcessingStart={handleVideoProcessingStart}
        onTransformStart={handleTransformStart}
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