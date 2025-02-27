import React from 'react';
import { X } from 'lucide-react';

export function VideoModal({ testimonial, onClose }) {
  if (!testimonial) return null;

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
            src={testimonial.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}