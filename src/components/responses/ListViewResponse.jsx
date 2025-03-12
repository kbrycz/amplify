import React, { useState, useEffect, useRef } from 'react';
import { Play, Clock, Circle, ChevronDown, Pencil, Trash2, Wand2, Star, Video, Sparkles, Download, Rewind } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';

/**
 * Helper: Convert Firestore-like timestamp objects to a JS Date.
 * Supports either { _seconds, _nanoseconds } or { seconds, nanoseconds }.
 */
function parseFirestoreTimestamp(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === 'function') {
    return ts.toDate();
  }
  const seconds = ts._seconds ?? ts.seconds;
  const nanos = ts._nanoseconds ?? ts.nanoseconds ?? 0;
  if (typeof seconds === 'number' && typeof nanos === 'number') {
    return new Date(seconds * 1000 + nanos / 1000000);
  }
  const d = new Date(ts);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Helper: Format a Date into a "time ago" string.
 */
function timeAgo(date) {
  if (!date) return 'Unknown';
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now';

  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.secs);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

export function ListViewResponse({ response, onVideoClick, onEdit, onDelete, onTransform, onStarChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(response.isStarred || false);
  const [isStarring, setIsStarring] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);
  const errorTimeoutRef = useRef(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  
  // Check if this is an AI enhanced video
  const isEnhanced = response.isVideoEnhanced === true;
  
  // Parse the createdAt timestamp and compute the "time ago" string.
  const createdAtDate = parseFirestoreTimestamp(response.createdAt);
  const timeAgoString = createdAtDate ? timeAgo(createdAtDate) : 'Unknown';

  useEffect(() => {
    if (error) {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setError(null), 3000);
    }
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [error]);

  const handleStar = async (e) => {
    e.stopPropagation();
    if (isStarring) return;

    if (!response.id) {
      console.error('No video ID provided');
      setError('No video ID provided. Please try again.');
      return;
    }
    setIsStarring(true);
    setError(null);
    const newStarredState = !isStarred;
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch(`${SERVER_URL}/videoEditor/update-metadata/${response.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ starred: newStarredState })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update star status');
      }
      await res.json();
      setIsStarred(newStarredState);
      onStarChange(response.id, newStarredState);
    } catch (err) {
      console.error('Error updating star status:', err);
      setIsStarred(!newStarredState);
      setError(err.message || 'Failed to update star status. Please try again.');
    } finally {
      setIsStarring(false);
    }
  };

  const handleCardClick = (e) => {
    // Do not toggle expand if clicking video area or an action button.
    if (e.target.closest('.video-area') || e.target.closest('.action-button')) return;
    setIsExpanded(!isExpanded);
  };

  // Use the provided thumbnailUrl if available; otherwise, fallback to our server endpoint.
  const thumbnailSrc = response.thumbnailUrl
    ? response.thumbnailUrl
    : response.videoUrl
      ? `${SERVER_URL}/thumbnailEndpoint?videoUrl=${encodeURIComponent(response.videoUrl)}`
      : null;

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    
    // Get the video URL from the response
    const videoUrl = response.processedVideoUrl || response.videoUrl;
    
    if (!videoUrl) {
      setError('Video URL not available for download');
      return;
    }
    
    try {
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `enhanced-video-${response.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading video:', err);
      setError('Failed to download video. Please try again.');
    }
  };
  
  // Function to view the original non-AI version of the video
  const handleViewOriginal = (e) => {
    e.stopPropagation();
    
    // Check if there's an original video URL
    if (!response.videoUrl) {
      setError('Original video not available');
      return;
    }
    
    // Create a temporary response object with the original video URL
    const originalResponse = {
      ...response,
      // Use the original video URL instead of the processed one
      processedVideoUrl: null,
      // Add a flag to indicate this is the original version
      isOriginalVersion: true
    };
    
    // Use the existing onVideoClick handler to show the video
    onVideoClick(originalResponse);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col rounded-lg border ${
        isEnhanced 
          ? 'border-purple-300 bg-purple-50/30 dark:border-purple-800 dark:bg-purple-900/10' 
          : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
      } transition-all duration-300 ease-in-out overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] ${
        isEnhanced 
          ? 'hover:bg-purple-50/50 dark:hover:border-purple-700 dark:hover:bg-purple-900/20' 
          : 'hover:bg-gray-50/50 dark:hover:border-gray-700 dark:hover:bg-gray-800/50'
      } h-full`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:p-4">
        {/* Thumbnail section */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onVideoClick(response);
          }}
          className="video-area relative aspect-video w-full lg:w-48 overflow-hidden lg:rounded-lg hover:opacity-90 transition-opacity"
        >
          {response.isNew && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
              <Circle className="h-2 w-2 fill-current" />
              <span>New</span>
            </div>
          )}
          
          {/* AI Enhanced Badge */}
          {isEnhanced && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-full bg-purple-500 px-2 py-1 text-xs font-medium text-white">
              <Sparkles className="h-2.5 w-2.5" />
              <span>AI Enhanced</span>
            </div>
          )}
          
          {thumbnailSrc && !thumbnailError ? (
            <>
              <img
                src={thumbnailSrc}
                alt={response.firstName && response.lastName 
                  ? `${response.firstName} ${response.lastName}'s video`
                  : 'Video response'}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                onError={handleThumbnailError}
              />
              <div className={`absolute inset-0 ${
                isEnhanced 
                  ? 'bg-purple-900/40 transition-opacity group-hover:bg-purple-900/50' 
                  : 'bg-black/40 transition-opacity group-hover:bg-black/50'
              }`} />
            </>
          ) : (
            <div className={`absolute inset-0 ${
              isEnhanced 
                ? 'bg-gradient-to-br from-purple-800 to-indigo-900 dark:from-purple-900 dark:to-indigo-950' 
                : 'bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black'
            } flex items-center justify-center`}>
              <Video className="h-12 w-12 text-gray-400 dark:text-gray-600 opacity-50" />
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`rounded-full ${
              isEnhanced 
                ? 'bg-purple-500/20 p-3 backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-purple-500/30' 
                : 'bg-white/10 p-3 backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20'
            }`}>
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Info area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 lg:p-0 flex-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {response.firstName && response.lastName 
                ? `${response.firstName} ${response.lastName}`
                : response.name || 'Anonymous'}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
              {response.email || 'No email provided'}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {response.zipCode ? (
                <div className="flex items-center gap-2">
                  <span className="shrink-0 font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                    Zip Code
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">{response.zipCode}</span>
                </div>
              ) : null}
              
              <div className="flex items-center gap-2">
                <span className="shrink-0 font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                  Uploaded
                </span>
                <span className="text-gray-600 dark:text-gray-400">{timeAgoString}</span>
              </div>
            </div>
          </div>

          {/* Star and expand icons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleStar}
              disabled={isStarring || !!error}
              className={`action-button p-2 rounded-lg transition-all hover:scale-105 ${isStarring ? 'opacity-50 cursor-not-allowed' : ''} ${
                isStarred
                  ? 'text-yellow-500 dark:text-yellow-400'
                  : 'text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400'
              }`}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
            </button>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} group-hover:text-gray-700 dark:group-hover:text-gray-300`}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[280px] md:max-h-[320px]' : 'max-h-0'}`}>
        <div className={`border-t ${
          isEnhanced 
            ? 'border-purple-200 dark:border-purple-800' 
            : 'border-gray-200 dark:border-gray-800'
        } p-4`}>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            {/* Show download button for enhanced videos, transform button for non-enhanced */}
            {isEnhanced ? (
              <>
                <button
                  className="action-button inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium w-full sm:w-auto justify-center transition-all bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download Enhanced Video
                </button>
                <button
                  className="action-button inline-flex items-center gap-2 rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 hover:scale-105 transition-transform dark:border-purple-800 dark:bg-gray-900 dark:text-purple-400 dark:hover:bg-purple-900/20 w-full sm:w-auto justify-center"
                  onClick={handleViewOriginal}
                >
                  <Rewind className="w-4 h-4" />
                  View Original Video
                </button>
              </>
            ) : onTransform && (
              <button
                className="action-button inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium w-full sm:w-auto justify-center transition-all bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  onTransform(response);
                }}
              >
                <Wand2 className="w-4 h-4" />
                Transform into Polished Short
              </button>
            )}
            <button
              className="action-button inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:scale-105 transition-transform dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 w-full sm:w-auto justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(response);
              }}
            >
              <Pencil className="w-4 h-4" />
              Edit Response
            </button>
            <button
              className="action-button inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-50 hover:scale-105 transition-transform dark:border-gray-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-gray-800 w-full sm:w-auto justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(response);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}