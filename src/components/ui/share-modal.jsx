import React from 'react';
import { X, Share2, Facebook, Twitter, Linkedin as LinkedIn, Instagram, ExternalLink } from 'lucide-react';
import { CopyButton } from './copy-button';

export function ShareModal({ isOpen, onClose, campaignId, campaignName }) {
  if (!isOpen) return null;

  const surveyUrl = `${window.location.origin}/survey/${campaignId}`;

  const shareOnSocial = (platform) => {
    const text = encodeURIComponent(`Check out this survey: ${campaignName}`);
    const url = encodeURIComponent(surveyUrl);
    
    let shareUrl;
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'instagram':
        // Instagram sharing is done via Stories using their URL scheme
        shareUrl = `instagram://story?url=${url}&text=${text}`;
        break;
      default:
        return;
    }

    // For Instagram, try to open the app, if it fails, open web version
    if (platform === 'instagram') {
      try {
        window.location.href = shareUrl;
      } catch (err) {
        // Fallback to web version
        window.open('https://instagram.com', '_blank');
      }
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
              <Share2 className="h-6 w-6 text-primary-text-600 dark:text-primary-text-400" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Share Campaign
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share this survey link with your audience to start collecting responses.
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
              <CopyButton text={surveyUrl} />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Share on Social Media
            </label>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => shareOnSocial('facebook')}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </button>
              <button
                onClick={() => shareOnSocial('twitter')}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </button>
              <button
                onClick={() => shareOnSocial('linkedin')}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <LinkedIn className="h-4 w-4" />
                LinkedIn
              </button>
              <button
                onClick={() => shareOnSocial('instagram')}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <a
                  href={surveyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview Survey
                </a>
              </div>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}