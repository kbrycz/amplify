import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Scissors, RotateCcw, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';

export function VideoEditorModal({ isOpen, onClose, video, onSave }) {
  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Trimming state
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [trimmedDuration, setTrimmedDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(null);
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTrimControls, setShowTrimControls] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [thumbnails, setThumbnails] = useState([]);
  
  // Refs
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  
  // Initialize when video loads
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        const videoDuration = videoRef.current.duration;
        setDuration(videoDuration);
        setEndTime(videoDuration);
        setTrimmedDuration(videoDuration);
        
        // Generate thumbnails
        generateThumbnails(video.videoUrl, videoDuration);
      });

      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current.currentTime);
        
        // Loop playback within trim boundaries in preview mode
        if (previewMode && videoRef.current.currentTime >= endTime) {
          videoRef.current.currentTime = startTime;
        }
      });
      
      videoRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        if (previewMode) {
          videoRef.current.currentTime = startTime;
        }
      });
      
      // Reset volume
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', () => {});
        videoRef.current.removeEventListener('timeupdate', () => {});
        videoRef.current.removeEventListener('ended', () => {});
      }
    };
  }, [isOpen, video, previewMode, startTime, endTime]);
  
  // Update trimmed duration when trim points change
  useEffect(() => {
    setTrimmedDuration(endTime - startTime);
  }, [startTime, endTime]);
  
  // Handle mouse events for trimming
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !timelineRef.current) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const timelineWidth = rect.width;
      const offsetX = Math.max(0, Math.min(e.clientX - rect.left, timelineWidth));
      const percentage = offsetX / timelineWidth;
      const time = percentage * duration;
      
      if (isDragging === 'start') {
        if (time < endTime - 1) { // Ensure at least 1 second between handles
          setStartTime(time);
          if (!isPlaying && videoRef.current) {
            videoRef.current.currentTime = time;
          }
        }
      } else if (isDragging === 'end') {
        if (time > startTime + 1) { // Ensure at least 1 second between handles
          setEndTime(time);
          if (!isPlaying && videoRef.current) {
            videoRef.current.currentTime = time;
          }
        }
      } else if (isDragging === 'playhead') {
        if (videoRef.current) {
          const newTime = Math.max(0, Math.min(time, duration));
          videoRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      document.body.style.cursor = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, startTime, endTime, isPlaying]);
  
  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      // Clear any existing timeout
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      
      // Set new timeout to clear messages after 3 seconds
      messageTimeoutRef.current = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
    }
    
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [error, success]);
  
  // Generate video thumbnails
  const generateThumbnails = async (videoUrl, videoDuration) => {
    const thumbnailCount = 10; // Number of thumbnails to generate
    const interval = videoDuration / thumbnailCount;
    const thumbs = [];
    
    const videoElement = document.createElement('video');
    videoElement.src = videoUrl;
    videoElement.crossOrigin = 'anonymous';
    
    await new Promise(resolve => {
      videoElement.onloadedmetadata = resolve;
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = 160; // Thumbnail width
    canvas.height = 90; // Thumbnail height
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < thumbnailCount; i++) {
      const time = i * interval;
      videoElement.currentTime = time;
      
      const thumbnail = await new Promise(resolve => {
        videoElement.onseeked = () => {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          resolve({
            time,
            url: canvas.toDataURL('image/jpeg', 0.7)
          });
        };
      });
      
      thumbs.push(thumbnail);
    }
    
    setThumbnails(thumbs);
  };
  
  // Format time as MM:SS.ms
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // If at the end, restart from beginning or trim start
        if (currentTime >= duration || (previewMode && currentTime >= endTime)) {
          videoRef.current.currentTime = previewMode ? startTime : 0;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle timeline click
  const handleTimelineClick = (e) => {
    if (!timelineRef.current || isPlaying) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const time = percentage * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  // Start dragging trim handles
  const handleStartDrag = (handle) => (e) => {
    e.stopPropagation();
    setIsDragging(handle);
    document.body.style.cursor = handle === 'playhead' ? 'grabbing' : 'ew-resize';
  };
  
  // Toggle preview mode
  const togglePreviewMode = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode && videoRef.current) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  };
  
  // Reset trim points
  const resetTrim = () => {
    setStartTime(0);
    setEndTime(duration);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };
  
  // Fine-tune trim points
  const adjustTrimPoint = (handle, delta) => {
    if (handle === 'start') {
      const newStart = Math.max(0, Math.min(startTime + delta, endTime - 1));
      setStartTime(newStart);
      if (!isPlaying && videoRef.current) {
        videoRef.current.currentTime = newStart;
        setCurrentTime(newStart);
      }
    } else {
      const newEnd = Math.max(startTime + 1, Math.min(endTime + delta, duration));
      setEndTime(newEnd);
      if (!isPlaying && videoRef.current) {
        videoRef.current.currentTime = newEnd;
        setCurrentTime(newEnd);
      }
    }
  };
  
  // Handle saving the edited video
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      
      // Send trim points to server
      const response = await fetch(`${SERVER_URL}/videoEditor/trim/${video.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startTime,
          endTime,
          duration
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update video');
      }

      setSuccess('Video trimmed successfully!');
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error updating video:', err);
      setError(err.message || 'Failed to update video. Please try again.');
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div ref={containerRef} className="relative w-full max-w-4xl h-[90vh] flex flex-col transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Video
            </h3>
            {trimmedDuration > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                <Clock className="h-3 w-3" />
                <span>Trimmed: {formatTime(trimmedDuration)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePreviewMode}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                previewMode 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {previewMode ? 'Exit Preview' : 'Preview Trim'}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="relative flex-1 bg-black overflow-hidden">
          <video
            ref={videoRef}
            src={video?.videoUrl}
            className="h-full w-full object-contain"
            onClick={togglePlay}
            playsInline
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
          
          {/* Current time indicator */}
          <div className="absolute bottom-4 left-4 rounded-md bg-black/70 px-2 py-1 text-sm text-white backdrop-blur-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Video Controls */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          {/* Status messages */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {success}
            </div>
          )}
          
          {/* Trim Controls */}
          <div className={`${showTrimControls ? 'block' : 'hidden'}`}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Trim Video</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetTrim}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
            </div>
            
            {/* Timeline with thumbnails */}
            <div className="relative mt-2">
              {/* Thumbnails */}
              <div className="relative h-16 overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
                <div className="absolute inset-0 flex h-full">
                  {thumbnails.map((thumb, index) => (
                    <div 
                      key={index} 
                      className="h-full flex-shrink-0" 
                      style={{ width: `${100 / thumbnails.length}%` }}
                    >
                      <img 
                        src={thumb.url} 
                        alt={`Thumbnail ${index}`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Timeline overlay */}
                <div 
                  ref={timelineRef}
                  className="absolute inset-0 cursor-pointer"
                  onClick={handleTimelineClick}
                >
                  {/* Selected range */}
                  <div 
                    className="absolute inset-y-0 bg-blue-500/30 border-x border-blue-500"
                    style={{
                      left: `${(startTime / duration) * 100}%`,
                      right: `${100 - (endTime / duration) * 100}%`
                    }}
                  />
                  
                  {/* Start handle - just the line, no dot */}
                  <div
                    className="absolute inset-y-0 w-2 cursor-ew-resize bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ left: `${(startTime / duration) * 100}%` }}
                    onMouseDown={handleStartDrag('start')}
                  />
                  
                  {/* End handle - just the line, no dot */}
                  <div
                    className="absolute inset-y-0 w-2 cursor-ew-resize bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ left: `${(endTime / duration) * 100}%` }}
                    onMouseDown={handleStartDrag('end')}
                  />
                  
                  {/* Playhead */}
                  <div
                    className="absolute inset-y-0 w-1 bg-red-500 z-10"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                    onMouseDown={handleStartDrag('playhead')}
                  >
                    <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-red-500" />
                  </div>
                </div>
              </div>
              
              {/* Fine-tune controls */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Start: {formatTime(startTime)}
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => adjustTrimPoint('start', -0.1)}
                      className="rounded-l-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => adjustTrimPoint('start', 0.1)}
                      className="rounded-r-md border border-gray-300 border-l-0 px-2 py-1 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    End: {formatTime(endTime)}
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => adjustTrimPoint('end', -0.1)}
                      className="rounded-l-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => adjustTrimPoint('end', 0.1)}
                      className="rounded-r-md border border-gray-300 border-l-0 px-2 py-1 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}