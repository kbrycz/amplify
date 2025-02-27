import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Circle, Volume2, VolumeX } from 'lucide-react';

export function CarouselViewResponse({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentIndex < testimonials.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, testimonials.length]);

  // Handle Mouse Wheel Scrolling
  const handleScroll = (e) => {
    e.preventDefault();
    if (e.deltaX > 0 && currentIndex < testimonials.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (e.deltaX < 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="relative h-[calc(100vh-12rem)] overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900"
      onWheel={handleScroll}
    >
      {/* Carousel Items */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="flex flex-col items-center justify-center h-full w-full flex-shrink-0 relative"
          >
            {/* Phone-like Video Container */}
            <div className="relative w-[360px] h-[640px] bg-black rounded-[2rem] overflow-hidden shadow-2xl">
              {testimonial.isNew && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  <Circle className="h-2 w-2 fill-current" />
                  <span>New</span>
                </div>
              )}
              <video
                src={testimonial.videoUrl}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                loop
                muted={isMuted}
                autoPlay={currentIndex === index}
                playsInline
              />
              
              {/* Sound Control Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Controls Below Video */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {testimonial.name || 'Anonymous'}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {testimonial.email || 'No email provided'}
              </p>
              <div className="mt-2 flex justify-center items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.zipCode || 'No zip code'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.createdAt
                    ? new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'No date'}
                </span>
              </div>
              <div className="mt-4 flex justify-center items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <div className="w-6 h-6 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <span>to navigate</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
        disabled={currentIndex === 0}
        className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 transition-opacity ${
          currentIndex === 0 ? 'opacity-30' : 'hover:opacity-75'
        }`}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => currentIndex < testimonials.length - 1 && setCurrentIndex((prev) => prev + 1)}
        disabled={currentIndex === testimonials.length - 1}
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 transition-opacity ${
          currentIndex === testimonials.length - 1 ? 'opacity-30' : 'hover:opacity-75'
        }`}
      >
        <ArrowRight className="h-6 w-6" />
      </button>

    </div>
  );
}