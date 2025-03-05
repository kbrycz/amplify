import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, Video, ArrowRight, CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';
import { useToast } from '../ui/toast-notification';

// Keep track of which videos are currently being processed
const processingVideos = new Set();

// Function to check if a video is being processed
export function isVideoProcessing(videoId) {
  return processingVideos.has(videoId);
}

// Function to mark a video as no longer processing
export function markVideoProcessingComplete(videoId) {
  processingVideos.delete(videoId);
}

// Function to check the status of a video processing request
export async function checkVideoProcessingStatus(videoId) {
  try {
    const idToken = await auth.currentUser.getIdToken();
    
    // Determine the correct endpoint based on the videoId format or other logic
    // For now, we'll use a simple approach - if the videoId starts with 'ai-', use videoProcessor endpoint
    // otherwise use videoEnhancer endpoint
    const endpoint = videoId.startsWith('ai-') 
      ? `/videoProcessor/status/${videoId}`
      : `/videoEnhancer/status/${videoId}`;
    
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      // Video not found or processing hasn't started
      return { status: 'pending' };
    } else if (!response.ok) {
      console.error('Failed to check video processing status:', response.status);
      return { status: 'unknown' };
    }
    
    const data = await response.json();
    
    // Map the API response to our status format
    if (data.status === 'completed' || data.status === 'success') {
      return { status: 'completed', data };
    } else if (data.status === 'failed' || data.status === 'error') {
      return { status: 'failed', error: data.error || 'Unknown error' };
    } else {
      return { status: 'processing', progress: data.progress || 0 };
    }
  } catch (error) {
    console.error('Error checking video processing status:', error);
    return { status: 'unknown', error: error.message };
  }
}

export function TransformModal({ isOpen, onClose, video, endpoint, onProcessingStart, onTransformStart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [totalLengthSeconds, setTotalLengthSeconds] = useState(60);
  const [transitionEffect, setTransitionEffect] = useState('fade');
  const [captionText, setCaptionText] = useState('');
  const [backgroundMusic, setBackgroundMusic] = useState('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/effects.mp3');
  const [outputResolution, setOutputResolution] = useState('1080x1920');
  const { addToast } = useToast();

  // Check if this video is already being processed
  const videoIsAlreadyProcessing = video && video.id && processingVideos.has(video.id);

  useEffect(() => {
    if (isOpen) {
      // If the video is already being processed, show a message and close the modal
      if (videoIsAlreadyProcessing) {
        addToast("This video is already being processed. Please wait for it to complete.", "info");
        onClose();
        return;
      }
      
      // Reset state when modal opens
      setIsProcessing(false);
      setError(null);
      setTotalLengthSeconds(60);
      setTransitionEffect('fade');
      setCaptionText('');
      setBackgroundMusic('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/effects.mp3');
      setOutputResolution('1080x1920');
      
      // Set default caption text based on endpoint
      if (endpoint === '/videoEnhancer/upload') {
        setCaptionText('Enhanced with AI');
      }
    }
  }, [isOpen, videoIsAlreadyProcessing, addToast, onClose, endpoint]);

  const handleTransform = async () => {
    if (!video) {
      setError("No video selected");
      addToast("No video selected", "error");
      return;
    }

    console.log("Transform video:", video);

    // Set processing state to disable the button
    setIsProcessing(true);
    setError(null);
    
    // Add this video to the processing set
    if (video.id) {
      processingVideos.add(video.id);
    }
    
    // Call onTransformStart if provided - do this BEFORE any async operations
    if (onTransformStart) {
      onTransformStart();
    }
    
    // Close the modal immediately
    onClose();
    
    // Show a simple loading toast without progress bar
    const toastId = addToast(
      "Video enhancement in progress. This may take a few minutes...",
      "info",
      0 // Don't auto-dismiss
    );

    try {
      const idToken = await auth.currentUser.getIdToken();
      const lengthInSeconds = parseInt(totalLengthSeconds);
      
      if (endpoint === '/videoEnhancer/upload') {
        // Handle new video uploads for videoEnhancer
        if (!video.file) {
          console.error('Video file is required for upload', video);
          addToast("Video file is required for upload", "error", 10000, toastId);
          setIsProcessing(false);
          if (video.id) {
            processingVideos.delete(video.id);
          }
          return;
        }
        
        console.log("Uploading video file:", video.file);
        
        const formData = new FormData();
        formData.append('video', video.file);
        formData.append('desiredLength', lengthInSeconds.toString());
        formData.append('transitionEffect', transitionEffect);
        formData.append('captionText', captionText);
        formData.append('backgroundMusic', backgroundMusic);
        formData.append('outputResolution', outputResolution);

        // Wait for the initial response from the server
        const response = await fetch(`${SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to process video');
        }

        // Get the videoId and renderId from the response
        const responseData = await response.json().catch(() => ({}));
        console.log("Upload response:", responseData);
        const videoId = responseData.videoId;
        const renderId = responseData.renderId;
        
        // Call onProcessingStart if provided, passing the videoId and toastId
        if (onProcessingStart && videoId) {
          onProcessingStart(videoId, toastId, renderId);
        }
      } else if (endpoint === '/video-enhancer/upload') {
        // Handle new video uploads for video-enhancer
        if (!video.file) {
          console.error('Video file is required for upload');
          addToast("Video file is required for upload", "error", 10000, toastId);
          setIsProcessing(false);
          return;
        }
        const formData = new FormData();
        formData.append('video', video.file);
        formData.append('desiredLength', lengthInSeconds.toString());
        formData.append('transitionEffect', transitionEffect);
        formData.append('captionText', captionText);
        formData.append('backgroundMusic', backgroundMusic);
        formData.append('outputResolution', outputResolution);

        // Wait for the initial response from the server
        const response = await fetch(`${SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to process video');
        }

        // Get the aiVideoId from the response
        const responseData = await response.json().catch(() => ({}));
        const aiVideoId = responseData.aiVideoId;
        
        // Call onProcessingStart if provided, passing the aiVideoId and toastId
        if (onProcessingStart && aiVideoId) {
          onProcessingStart(video.id, toastId, aiVideoId);
        }
      } else {
        // Handle processing existing videos
        if (!video.id) {
          console.error('Video ID is required for processing');
          setIsProcessing(false);
          addToast("Video ID is required for processing", "error", 10000, toastId);
          return;
        }
        
        const payload = {
          videoId: video.id,
          desiredLength: lengthInSeconds,
          transitionEffect,
          captionText,
          backgroundMusic,
          outputResolution,
        };

        // Wait for the initial response from the server
        const response = await fetch(`${SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to process video');
        }

        // Get the aiVideoId from the response
        const responseData = await response.json().catch(() => ({}));
        console.log('Video processing initiated:', responseData);
        const aiVideoId = responseData.aiVideoId;
        
        // Call onProcessingStart if provided, passing the aiVideoId and toastId
        if (onProcessingStart && aiVideoId) {
          onProcessingStart(video.id, toastId, aiVideoId);
        } else if (onProcessingStart && video.id) {
          // Fallback to using video.id if aiVideoId is not available
          onProcessingStart(video.id, toastId);
        }
      }
    } catch (err) {
      console.error('Error processing video:', err);
      setError(err.message || 'Failed to process video');
      addToast(err.message || 'Failed to process video', "error", 10000, toastId);
      
      // Remove from processing set if there's an error
      if (video.id) {
        processingVideos.delete(video.id);
      }
      
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl transform overflow-y-auto rounded-xl bg-white shadow-xl transition-all dark:bg-gray-900">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mt-3 text-center sm:mt-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <Wand2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Transform Video
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enhance your video with professional effects, transitions, and background music.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              {/* Video Length Input */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Video Length (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={totalLengthSeconds}
                  onChange={(e) => setTotalLengthSeconds(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Transition Effect */}
              <div>
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transition Effect
                </label>
                <select
                  value={transitionEffect}
                  onChange={(e) => setTransitionEffect(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="fade">Fade</option>
                  <option value="slideLeft">Slide Left</option>
                  <option value="slideRight">Slide Right</option>
                  <option value="slideUp">Slide Up</option>
                  <option value="slideDown">Slide Down</option>
                </select>
              </div>

              {/* Caption Text */}
              <div className="col-span-2">
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Caption Text
                </label>
                <input
                  type="text"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  placeholder="Enter caption text (optional)"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Background Music */}
              <div className="col-span-2">
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Background Music
                </label>
                <select
                  value={backgroundMusic}
                  onChange={(e) => setBackgroundMusic(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/effects.mp3">Upbeat Electronic</option>
                  <option value="https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/motions.mp3">Smooth Jazz</option>
                  <option value="https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/urban-pulse.mp3">Urban Pulse</option>
                </select>
              </div>

              {/* Output Resolution */}
              <div className="col-span-2">
                <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Output Resolution
                </label>
                <select
                  value={outputResolution}
                  onChange={(e) => setOutputResolution(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="1080x1920">1080x1920 (Portrait)</option>
                  <option value="1920x1080">1920x1080 (Landscape)</option>
                  <option value="1080x1080">1080x1080 (Square)</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTransform}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Transform Video
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}