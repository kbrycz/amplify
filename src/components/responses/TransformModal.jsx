// TransformModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';
import { useToast } from '../ui/toast-notification';

// Keep track of which videos are currently being processed
const processingVideos = new Set();

export function isVideoProcessing(videoId) {
  return processingVideos.has(videoId);
}

export function markVideoProcessingComplete(videoId) {
  processingVideos.delete(videoId);
}

export async function checkVideoProcessingStatus(videoId) {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process/status/job/${videoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      return { status: 'pending' };
    } else if (!response.ok) {
      console.error('Failed to check video processing status:', response.status);
      return { status: 'unknown' };
    }
    
    const data = await response.json();
    
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

  const videoIsAlreadyProcessing = video && video.id && processingVideos.has(video.id);

  useEffect(() => {
    if (isOpen) {
      if (videoIsAlreadyProcessing) {
        addToast("This video is already being processed. Please wait for it to complete.", "info");
        onClose();
        return;
      }
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
    setIsProcessing(true);
    setError(null);
    processingVideos.add(video.id);

    if (onTransformStart) onTransformStart();
    
    onClose();
    
    const toastId = addToast(
      "Video processing in progress. This may take a few minutes...",
      "info",
      0 // Don't auto-dismiss
    );

    try {
      const idToken = await auth.currentUser.getIdToken();
      const payload = { videoId: video.id };

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

      const responseData = await response.json().catch(() => ({}));
      console.log('Video processing initiated:', responseData);
      const jobId = responseData.jobId;
      
      if (onProcessingStart && jobId) {
        onProcessingStart(video.id, toastId, jobId);
      } else if (onProcessingStart) {
        onProcessingStart(video.id, toastId);
      }
    } catch (err) {
      console.error('Error processing video:', err);
      setError(err.message || 'Failed to process video');
      addToast(err.message || 'Failed to process video', "error", 10000, toastId);
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
      <div className="relative w-full max-w-xl transform overflow-y-auto rounded-xl bg-white shadow-xl transition-all dark:bg-gray-900">
        <div className="px-8 pb-8 pt-8">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mt-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <Wand2 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                Transform Video
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Enhance your video with professional effects using our AI video processor.
              </p>
              <div className="mt-4 mx-auto max-w-md">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    If processing fails, your credit will be automatically refunded.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="mt-8 flex justify-between gap-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTransform}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Use 1 Credit to Transform Video
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}