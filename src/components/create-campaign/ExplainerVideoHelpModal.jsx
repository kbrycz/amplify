import React, { useEffect, useRef } from 'react';
import { X, Video, Info } from 'lucide-react';

export function ExplainerVideoHelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
        
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Explainer Video
          </h3>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-4">
          <p>
            An <strong>explainer video</strong> is a short video that will be shown to survey participants before they record their responses.
          </p>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">How it works:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your explainer video will appear at the top of the survey, above the questions.</li>
              <li>Use this video to introduce yourself, explain the purpose of your survey, or provide context for the questions.</li>
              <li>Keep it brief (30-90 seconds) to maintain participant engagement.</li>
              <li>The video will be automatically played when participants open your survey.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Best practices:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Introduce yourself and your organization</li>
              <li>Explain why you're collecting video responses</li>
              <li>Provide clear instructions for answering the questions</li>
              <li>Thank participants in advance for their time</li>
              <li>Ensure good lighting and clear audio in your recording</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>The explainer video is optional. If you don't include one, participants will only see your survey questions.</span>
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
} 