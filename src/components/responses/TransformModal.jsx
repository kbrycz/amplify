import React, { useState, useRef } from 'react';
import { X, Wand2 } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';

export function TransformModal({ isOpen, onClose, video }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const abortControllerRef = useRef(null);

  // State for parameters
  const [videoLengthMinutes, setVideoLengthMinutes] = useState(0);
  const [videoLengthSeconds, setVideoLengthSeconds] = useState(30);
  const [transitionEffect, setTransitionEffect] = useState('fade'); // Changed default to 'fade'
  const [captionText, setCaptionText] = useState('Discover Something Cool!');
  const [backgroundMusic, setBackgroundMusic] = useState('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/effects.mp3');
  const [outputResolution, setOutputResolution] = useState('1080x1920');

  const handleTransform = async () => {
    setIsProcessing(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const idToken = await auth.currentUser.getIdToken();
      const totalLengthSeconds = parseInt(videoLengthMinutes) * 60 + parseInt(videoLengthSeconds);
      const response = await fetch(`${SERVER_URL}/videoProcessor/process-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoId: video.id,
          desiredLength: totalLengthSeconds,
          transitionEffect,
          captionText,
          backgroundMusic,
          outputResolution
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl transform overflow-y-auto rounded-xl bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8 max-h-[calc(100vh-4rem)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <Wand2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transform into Polished Short
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize your video with professional effects
              </p>
            </div>
          </div>
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Video Length Input */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Video Length (Minutes)
              </label>
              <input
                type="number"
                min="0"
                value={videoLengthMinutes}
                onChange={(e) => setVideoLengthMinutes(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Video Length (Seconds)
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={videoLengthSeconds}
                onChange={(e) => setVideoLengthSeconds(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
              />
            </div>
          </div>

          {/* Transition Effect */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Transition Effect
            </label>
            <select
              value={transitionEffect}
              onChange={(e) => setTransitionEffect(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
            >
              <option value="fade">Fade</option>
              <option value="fadeSlow">Fade Slow</option>
              <option value="slideUp">Slide Up</option>
            </select>
          </div>

          {/* Caption Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Caption Text
            </label>
            <input
              type="text"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
            />
          </div>

          {/* Background Music */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Music
            </label>
            <select
              value={backgroundMusic}
              onChange={(e) => setBackgroundMusic(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
            >
              <option value="https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/effects.mp3">Upbeat Effects</option>
              <option value="https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/chill.mp3">Chill Vibes</option>
              <option value="https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/energetic.mp3">Energetic Beat</option>
            </select>
          </div>

          {/* Output Resolution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Output Resolution
            </label>
            <select
              value={outputResolution}
              onChange={(e) => setOutputResolution(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
            >
              <option value="1080x1920">1080x1920 (Vertical - Shorts)</option>
              <option value="1920x1080">1920x1080 (Horizontal - Standard)</option>
              <option value="720x1280">720x1280 (Vertical - Lower Res)</option>
            </select>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          {success ? (
            <div className="flex flex-col gap-3">
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
            <div className="flex flex-col gap-3 sm:flex-row-reverse">
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