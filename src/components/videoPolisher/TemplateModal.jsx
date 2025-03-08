import React, { useState, useEffect } from 'react';
import { X, Layout, Check, Loader2, Clock, FolderX } from 'lucide-react';
import { SERVER_URL, auth } from '../../lib/firebase';

export function TemplateModal({ isOpen, onClose, onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleConfirmSelection = async () => {
    if (!selectedTemplateId) return;
    
    try {
      setIsLoading(true);
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates/${selectedTemplateId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch template details');
      }

      const templateData = await response.json();
      onSelectTemplate(templateData);
      onClose();
    } catch (err) {
      console.error('Error fetching template details:', err);
      setError('Failed to load template details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Format date to a readable format
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    // Parse the timestamp
    let date;
    if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'object' && (('seconds' in timestamp) || ('_seconds' in timestamp))) {
      const seconds = timestamp.seconds ?? timestamp._seconds;
      date = new Date(seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    // Return relative time
    return timeAgo(date);
  };

  // Returns a relative time string like "3 days ago", "2 hours ago", etc.
  const timeAgo = (date) => {
    if (!date || isNaN(date.getTime())) return 'N/A';

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 0) return 'N/A'; // future date?

    const intervals = [
      { label: 'year', secs: 31536000 },
      { label: 'month', secs: 2592000 },
      { label: 'week', secs: 604800 },
      { label: 'day', secs: 86400 },
      { label: 'hour', secs: 3600 },
      { label: 'minute', secs: 60 },
      { label: 'second', secs: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.secs);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] sm:w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-900 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Template</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading templates...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          {!isLoading && !error && templates.length === 0 && (
            <div className="py-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-gray-100 p-3 mb-3 dark:bg-gray-800">
                  <FolderX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">No templates found</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  You don't have any templates yet to use.
                </p>
              </div>
            </div>
          )}
          
          {!isLoading && !error && templates.length > 0 && (
            <>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                Select a template to apply to your video.
              </p>
            </>
          )}
        </div>
        
        {/* Scrollable container with visual indicators */}
        {!isLoading && !error && templates.length > 0 && (
          <div className="relative flex-1 min-h-0 px-6">
            {/* Scroll shadow indicators */}
            <div className="absolute top-0 left-6 right-10 h-4 bg-gradient-to-b from-white to-transparent dark:from-gray-900 z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-6 right-10 h-4 bg-gradient-to-t from-white to-transparent dark:from-gray-900 z-10 pointer-events-none"></div>
            
            {/* Scrollable content with lighter scrollbar */}
            <div className="overflow-y-auto max-h-[50vh] pr-4 space-y-3 py-3 
              scrollbar-thin 
              scrollbar-thumb-blue-200 hover:scrollbar-thumb-blue-300 
              dark:scrollbar-thumb-blue-900/40 dark:hover:scrollbar-thumb-blue-800/60 
              scrollbar-track-transparent">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center gap-3 rounded-md p-3 cursor-pointer transition-colors border shadow-sm ${
                    selectedTemplateId === template.id
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="flex-shrink-0">
                    {selectedTemplateId === template.id ? (
                      <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Layout className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {template.name || 'Untitled Template'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {template.captionStyle ? 'With captions' : 'No captions'}
                    </p>
                    {template.lastModified && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>{formatDate(template.lastModified)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-6 pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedTemplateId || isLoading}
            className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 ${
              (!selectedTemplateId || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Loading...
              </>
            ) : (
              'Apply Template'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 