import React, { useState, useEffect, useRef } from 'react';
import { Play, Clock, Circle, ChevronDown, Pencil, Trash2, Wand2, Star } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';

export function ListViewResponse({ response, onVideoClick, onEdit, onDelete, onTransform, onStarChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(response.starred || false);
  const [isStarring, setIsStarring] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    if (error) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
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

    console.log('Attempting to update star status for video:', response.id);
    console.log('New starred state:', !isStarred);

    setIsStarring(true);
    setError(null);
    const newStarredState = !isStarred;

    try {
      const idToken = await auth.currentUser.getIdToken();
      console.log('ID Token obtained');
      const res = await fetch(`${SERVER_URL}/videoEditor/update-metadata/${response.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ starred: newStarredState })
      });

      console.log('Fetch response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.log('Error data from server:', errorData);
        throw new Error(errorData.error || 'Failed to update star status');
      }

      const data = await res.json();
      console.log('Update successful:', data);
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
    if (e.target.closest('.video-area') || e.target.closest('.action-button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out
        ${!isEditMode ? 'cursor-pointer hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50/50' : ''}
        dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/50"
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Thumbnail */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onVideoClick(response);
          }}
          className="video-area relative aspect-video w-full overflow-hidden rounded-lg"
        >
          {response.isNew && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
              <Circle className="h-2 w-2 fill-current" />
              <span>New</span>
            </div>
          )}
          <img
            src={response.thumbnailUrl || 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=2073'}
            alt={response.name || 'Video response'}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            <span>{response.createdAt ? new Date(response.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {response.name || 'Anonymous'}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {response.email || 'No email provided'}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{response.zipCode || 'No zip code'}</span>
              <span>{response.createdAt ? new Date(response.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }) : 'Unknown'}</span>
            </div>
          </div>
          {/* Star and Expand Icons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleStar}
              disabled={isStarring || !!error}
              className={`action-button p-2 rounded-lg transition-colors ${
                isStarring ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isStarred
                  ? 'text-yellow-500 dark:text-yellow-400'
                  : 'text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400'
              }`}
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
            </button>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-24' : 'max-h-0'}`}>
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-x-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="action-button inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 w-full sm:w-auto justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onTransform(response);
              }}
            >
              <Wand2 className="w-4 h-4" />
              Transform into Polished Short
            </button>
            <button
              className="action-button inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 w-full sm:w-auto justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(response);
              }}
            >
              <Pencil className="w-4 h-4" />
              Edit Response
            </button>
            <button
              className="action-button inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-gray-800 w-full sm:w-auto justify-center"
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