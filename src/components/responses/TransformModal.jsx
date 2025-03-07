import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, Loader2 } from 'lucide-react';
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
    
    // Use the new Creatomate status endpoint
    const response = await fetch(`${SERVER_URL}/creatomate/status/job/${videoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      // Job not found or processing hasn't started
      return { status: 'pending' };
    } else if (!response.ok) {
      console.error('Failed to check video processing status:', response.status);
      return { status: 'unknown' };
    }
    
    const data = await response.json();
    
    // Map the API response to our status format
    if (data.status === 'completed') {
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

export function TransformModal({ isOpen, onClose, video, onProcessingStart, onTransformStart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
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
    }
  }, [isOpen, videoIsAlreadyProcessing, addToast, onClose]);

  const handleTransform = async () => {
    if (!video) {
      setError("No video selected");
      addToast("No video selected", "error");
      return;
    }

    if (!video.id) {
      setError("Video ID is required for processing");
      addToast("Video ID is required for processing", "error");
      return;
    }

    console.log("Transform video:", video);

    // Set processing state to disable the button
    setIsProcessing(true);
    setError(null);
    
    // Add this video to the processing set
    processingVideos.add(video.id);
    
    // Call onTransformStart if provided - do this BEFORE any async operations
    if (onTransformStart) {
      onTransformStart();
    }
    
    // Close the modal immediately
    onClose();
    
    // Show a simple loading toast without progress bar
    const toastId = addToast(
      "Video processing in progress. This may take a few minutes...",
      "info",
      0 // Don't auto-dismiss
    );

    try {
      const idToken = await auth.currentUser.getIdToken();
      
      // Call the new Creatomate process endpoint
      const payload = {
        videoId: video.id
      };

      // Wait for the initial response from the server
      const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process`, {
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

      // Get the jobId from the response
      const responseData = await response.json().catch(() => ({}));
      console.log('Video processing initiated:', responseData);
      const jobId = responseData.jobId;
      
      // Call onProcessingStart if provided, passing the jobId and toastId
      if (onProcessingStart && jobId) {
        onProcessingStart(video.id, toastId, jobId);
      } else if (onProcessingStart) {
        // Fallback to using video.id if jobId is not available
        onProcessingStart(video.id, toastId);
      }
    } catch (err) {
      console.error('Error processing video:', err);
      setError(err.message || 'Failed to process video');
      addToast(err.message || 'Failed to process video', "error", 10000, toastId);
      
      // Remove from processing set if there's an error
      processingVideos.delete(video.id);
      
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

      <div className="relative w-full max-w-md transform overflow-y-auto rounded-xl bg-white shadow-xl transition-all dark:bg-gray-900">
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
                Enhance your video with professional effects using our AI video processor.
              </p>
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