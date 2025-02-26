import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, X, Copy, ExternalLink } from 'lucide-react';

export function SuccessModal({ isOpen, onClose, campaignId, campaignName }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const surveyUrl = `${window.location.origin}/survey/${campaignId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyUrl);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-gray-900">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Campaign Created Successfully!
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your campaign "{campaignName}" has been created. Share the survey link with your audience to start collecting responses.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Survey URL
            </label>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={surveyUrl}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
            <Link
              to={`/app/campaigns/${campaignId}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Campaign
            </Link>
            <button
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}