import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, Video, ArrowRight, CheckCircle } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';

export function TransformModal({ isOpen, onClose, video, endpoint }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State for parameters
  const [videoLengthMinutes, setVideoLengthMinutes] = useState(0);
  const [videoLengthSeconds, setVideoLengthSeconds] = useState(30);
  const [transitionEffect, setTransitionEffect] = useState('fade'); // Changed default to 'fade'
  const [captionText, setCaptionText] = useState('');
  const [backgroundMusic, setBackgroundMusic] = useState('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/effects.mp3');
  const [outputResolution, setOutputResolution] = useState('1080x1920');

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError(null);
      setVideoLengthMinutes(0);
      setVideoLengthSeconds(30);
      setTransitionEffect('fade');
      setCaptionText('');
      setBackgroundMusic('https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/effects.mp3');
      setOutputResolution('1080x1920');
    }
  }, [isOpen]);

  const handleTransform = async () => {
    if (!video) {
      setError("No video selected");
      return;
    }

    // Immediately show success screen
    setSuccess(true);

    // Continue with the API call in the background
    try {
      const idToken = await auth.currentUser.getIdToken();
      const totalLengthSeconds = parseInt(videoLengthMinutes) * 60 + parseInt(videoLengthSeconds);
      
      if (endpoint === '/video-enhancer/upload') {
        // Handle new video uploads
        if (!video.file) {
          console.error('Video file is required for upload');
          return;
        }
        const formData = new FormData();
        formData.append('video', video.file);
        formData.append('desiredLength', totalLengthSeconds.toString());
        formData.append('transitionEffect', transitionEffect);
        formData.append('captionText', captionText);
        formData.append('backgroundMusic', backgroundMusic);
        formData.append('outputResolution', outputResolution);

        // Fire and forget - don't wait for response
        fetch(`${SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
          body: formData
        }).catch(err => {
          console.error('Error processing video in background:', err);
        });
      } else {
        // Handle processing existing videos (e.g., /video-enhancer/process or /process-video)
        if (!video.id) {
          console.error('Video ID is required for processing');
          return;
        }
        const payload = {
          videoId: video.id,
          desiredLength: totalLengthSeconds,
          transitionEffect,
          captionText,
          backgroundMusic,
          outputResolution,
        };

        // Fire and forget - don't wait for response
        fetch(`${SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).catch(err => {
          console.error('Error processing video in background:', err);
        });
      }
    } catch (err) {
      console.error('Error initiating video processing:', err);
      // Don't set error or change success state since we've already shown success screen
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

          {success ? (
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Video Processing Started
                </h3>
                <div className="mt-3 max-w-md mx-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your video is now being processed in the background. This may take 5-10 minutes depending on the video length.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      You can close this window and continue using the app. Check the AI Videos tab later to see your processed video.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={videoLengthMinutes}
                    onChange={(e) => setVideoLengthMinutes(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
                  />
               </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Seconds
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

                {/* Caption Text */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Caption Text
                  </label>
                  <input
                    type="text"
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    placeholder="Optional caption text"
                    className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/10"
                  />
                </div>

                {/* Background Music */}
                <div className="col-span-2">
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

                {error && (
                  <div className="col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <button
                  onClick={onClose}
                  className="inline-flex w-full sm:w-auto justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransform}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Wand2 className="h-4 w-4" />
                  Start Processing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}