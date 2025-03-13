import React from 'react';
import { X, Rewind, Sparkles } from 'lucide-react';

// Helper function to convert Firebase Storage gs:// URLs to HTTPS URLs
const convertGsUrlToHttps = (url) => {
  if (!url) return null;
  
  // If it's already an HTTPS URL, return it as is
  if (url.startsWith('https://')) {
    return url;
  }
  
  // Convert gs:// URL to HTTPS URL
  if (url.startsWith('gs://')) {
    // Extract bucket name and path
    const gsPattern = /gs:\/\/([^\/]+)\/(.+)/;
    const match = url.match(gsPattern);
    
    if (match && match.length === 3) {
      const [, bucket, path] = match;
      return `https://storage.googleapis.com/${bucket}/${path}`;
    }
  }
  
  // Return original URL if conversion failed
  return url;
};

export function VideoModal({ testimonial, onClose }) {
  if (!testimonial) return null;

  // Determine if we're showing the original version
  const isOriginalVersion = testimonial.isOriginalVersion === true;
  
  // Determine if this is an AI enhanced video
  const isEnhanced = testimonial.isVideoEnhanced === true;

  // Choose the appropriate video URL
  // If it's marked as original version, use videoUrl
  // Otherwise, use processedVideoUrl if available, falling back to videoUrl
  const videoUrl = convertGsUrlToHttps(
    isOriginalVersion 
      ? testimonial.videoUrl 
      : (testimonial.processedVideoUrl || testimonial.videoUrl)
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}>
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-6 top-6 p-2.5 text-white hover:text-white/80 bg-gray-900/90 hover:bg-gray-800/90 rounded-full backdrop-blur-sm transition-colors shadow-lg ring-1 ring-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4">
        {/* Original version badge */}
        {isOriginalVersion && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
            <Rewind className="h-4 w-4" />
            <span>Original Version</span>
          </div>
        )}
        
        {/* AI Enhanced badge */}
        {!isOriginalVersion && isEnhanced && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>AI Enhanced</span>
          </div>
        )}
        
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}