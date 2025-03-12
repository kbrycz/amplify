import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function CampaignAgeModal({ campaign, onClose }) {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Format the campaign creation date
  const formatCreationDate = () => {
    if (!campaign || !campaign.createdAt) {
      return "Unknown";
    }
    
    const createdAtSeconds = campaign.createdAt._seconds || campaign.createdAt.seconds;
    const createdAt = new Date(createdAtSeconds * 1000);
    
    return createdAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        ref={modalRef}
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 animate-in fade-in zoom-in duration-200"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Campaign Age Information
        </h3>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p className="mb-3">
            This campaign was created on <span className="font-medium">{formatCreationDate()}</span>.
          </p>
          <p className="mb-3">
            Campaign age is calculated from the creation date to the current date.
          </p>
          <p>
            Older campaigns may have more responses and engagement data, which can be useful for analyzing trends over time.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
} 