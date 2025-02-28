import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';
import { ErrorMessage } from '../ui/error-message';

export function VideoEditorModal({ isOpen, onClose, video, onSave }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(duration);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const startHandleRef = useRef(null);
  const endHandleRef = useRef(null);
  const isDraggingRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        const videoDuration = videoRef.current.duration;
        setDuration(videoDuration);
        setEndTime(videoDuration);
      });

      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current.currentTime);
        if (videoRef.current.currentTime >= endTime) {
          videoRef.current.pause();
          setIsPlaying(false);
          videoRef.current.currentTime = startTime;
        }
      });
    }
  }, [endTime, startTime]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !progressBarRef.current) return;
      
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const time = percentage * duration;
      
      if (isDraggingRef.current === 'start') {
        if (time < endTime) {
          setStartTime(time);
          if (videoRef.current) {
            videoRef.current.currentTime = time;
          }
        }
      } else if (isDraggingRef.current === 'end') {
        if (time > startTime) {
          setEndTime(time);
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = null;
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [duration, startTime, endTime]);

  const handleStartDragStart = () => {
    isDraggingRef.current = 'start';
    document.body.style.cursor = 'ew-resize';
  };

  const handleEndDragStart = () => {
    isDraggingRef.current = 'end';
    document.body.style.cursor = 'ew-resize';
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = Math.max(0, Math.min(percentage * duration, duration));
    
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = parseFloat(e.target.value);
    if (newStartTime < endTime) {
      const time = Math.max(0, Math.min(newStartTime, duration));
      setStartTime(time);
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = parseFloat(e.target.value);
    if (newEndTime > startTime) {
      setEndTime(Math.max(startTime, Math.min(newEndTime, duration)));
    }
  };

  // Function to trim video and return a blob
  const trimVideo = async (videoUrl, start, end) => {
    try {
      // Create a video element to load the video
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      await new Promise((resolve) => {
        videoElement.onloadeddata = resolve;
      });

      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');

      // Set video to start time
      videoElement.currentTime = start;

      // Create a MediaRecorder to record the canvas
      const stream = canvas.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000 // 8 Mbps for high quality
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        // Convert to MP4 for better compatibility
        const mp4Blob = new Blob([blob], { type: 'video/mp4' });
        resolve(mp4Blob);
      };

      // Start recording
      mediaRecorder.start();

      // Draw frames to canvas and record
      const drawFrame = () => {
        if (videoElement.currentTime <= end) {
          ctx.drawImage(videoElement, 0, 0);
          videoElement.currentTime += 1/60; // 60fps for smoother video
          requestAnimationFrame(drawFrame);
        } else {
          mediaRecorder.stop();
        }
      };
      drawFrame();

      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          // Convert to MP4 for better compatibility
          const blob = new Blob(chunks, { type: 'video/mp4' });
          resolve(blob);
        };
      });
    } catch (err) {
      console.error('Error trimming video:', err);
      throw err;
    }
  };

  // Handle saving the edited video
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      setError('');
      const formData = new FormData();
      
      // Create a new video blob from the trimmed video
      const videoBlob = await trimVideo(video.videoUrl, startTime, endTime);
      formData.append('video', videoBlob, 'trimmed.mp4');

      const response = await fetch(`${SERVER_URL}/videoEditor/update-video/${video.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update video');
      }

      await onSave();
      onClose();
    } catch (err) {
      console.error('Error updating video:', err);
      setError(err.message || 'Failed to update video. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Video
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            src={video?.videoUrl}
            className="h-full w-full"
            onClick={togglePlay}
          />
          
          {/* Play/Pause Button Overlay */}
          <button
            onClick={togglePlay}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-white backdrop-blur-sm transition-transform hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Video Controls */}
        <div className="p-4">
          {/* Progress Bar */}
          <div 
            ref={progressBarRef}
            className="relative h-2 w-full cursor-pointer rounded-lg bg-gray-200 dark:bg-gray-800"
            onClick={handleProgressBarClick}
          >
            {/* Playback Progress */}
            <div
              className="absolute h-2 rounded-lg bg-blue-600/30 dark:bg-blue-500/30"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            
            {/* Selected Range */}
            <div
              className="absolute h-2 rounded-lg bg-blue-600 dark:bg-blue-500"
              style={{
                left: `${(startTime / duration) * 100}%`,
                right: `${100 - (endTime / duration) * 100}%`
              }}
            />

            {/* Start Handle */}
            <div
              ref={startHandleRef}
              onMouseDown={handleStartDragStart}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize"
              style={{ left: `${(startTime / duration) * 100}%` }}
            >
              <div className="h-4 w-4 rounded-full border-2 border-blue-600 bg-white dark:border-blue-500" />
            </div>

            {/* End Handle */}
            <div
              ref={endHandleRef}
              onMouseDown={handleEndDragStart}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize"
              style={{ left: `${(endTime / duration) * 100}%` }}
            >
              <div className="h-4 w-4 rounded-full border-2 border-blue-600 bg-white dark:border-blue-500" />
            </div>
          </div>

          {/* Time Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={startTime}
                onChange={handleStartTimeChange}
                className="w-24"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatTime(startTime)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatTime(endTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={endTime}
                onChange={handleEndTimeChange}
                className="w-24"
              />
            </div>
          </div>

          {/* Action Buttons */}
          {error && (
            <div className="mt-4">
              <ErrorMessage message={error} />
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}