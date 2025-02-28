import React, { useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';
import { useRef } from 'react';

export function TransformModal({ isOpen, onClose, video }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const abortControllerRef = useRef(null);

  const handleTransform = async () => {
    setIsProcessing(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/videoProcessor/process-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoId: video.id
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process video');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error processing video:', err);
      // Don't show error if request was aborted
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (isProcessing && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      setError(null);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <Wand2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transform into Polished Short
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We'll process your video into a polished short with professional transitions, captions, and effects.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          {success ? (
            <div className="mt-6 flex flex-col gap-3">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success!</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Your video is being processed. You'll be notified when it's ready.</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                onClick={handleTransform}
                disabled={isProcessing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Transform Video'
                )}
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {isProcessing ? 'Stop Processing' : 'Cancel'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}