import React, { useRef, useEffect, useState } from 'react';
import { Iphone15Pro } from '../ui/iphone';

export function VideoPreview({ 
  videoUrl,
  videoRef,
  selectedTemplate = null
}) {
  const internalVideoRef = useRef(null);
  const actualVideoRef = videoRef || internalVideoRef;
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    if (actualVideoRef.current && videoUrl) {
      actualVideoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });

      // Check video orientation once metadata is loaded
      actualVideoRef.current.onloadedmetadata = () => {
        const video = actualVideoRef.current;
        if (video.videoWidth && video.videoHeight) {
          setIsVertical(video.videoHeight > video.videoWidth);
        }
      };
    }
  }, [videoUrl, actualVideoRef]);

  const renderVideo = () => {
    return (
      <div className="flex flex-col h-full relative">
        {videoUrl ? (
          <>
            <video 
              ref={actualVideoRef}
              className={`w-full h-full ${isVertical ? 'object-cover' : 'object-contain'} bg-black`}
              muted
              loop
              playsInline
              controls
              src={videoUrl}
            />
            {selectedTemplate && selectedTemplate.captionStyle && (
              <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
                <div className="bg-black/70 text-white px-4 py-2 rounded-md text-center mx-auto max-w-[90%]">
                  {selectedTemplate.title || 'Template Caption'}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                No video selected
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] w-[500px] xl:block">
        <div className="flex flex-col items-center">
          <div className="scale-[0.8] origin-top xl:scale-[0.85] -mt-12">
            <Iphone15Pro>
              {renderVideo()}
            </Iphone15Pro>
          </div>
        </div>
      </div>
      {videoUrl && (
        <div className="mt-4 mx-auto max-w-md text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            <strong>Note:</strong> This preview is for guidance only. The AI-enhanced video will be properly formatted with better proportions and professional styling.
          </p>
        </div>
      )}
    </div>
  );
} 