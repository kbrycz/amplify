import React from 'react';
import { X } from 'lucide-react';

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

  // Convert the video URL if needed
  const videoUrl = convertGsUrlToHttps(testimonial.videoUrl);

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