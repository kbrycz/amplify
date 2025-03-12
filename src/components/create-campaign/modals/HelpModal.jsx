import React from 'react';
import { X } from 'lucide-react';

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Creating Effective Survey Questions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We recommend making your questions broad and open-ended to let your members speak freely about their experiences. This approach often leads to more authentic and meaningful responses.
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Good Examples:</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• "What inspired you to join our cause?"</li>
                <li>• "How has our community impacted your life?"</li>
                <li>• "What's your favorite memory with us?"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Tips:</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Keep questions simple and clear</li>
                <li>• Avoid yes/no questions</li>
                <li>• Focus on personal experiences</li>
                <li>• Encourage storytelling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}