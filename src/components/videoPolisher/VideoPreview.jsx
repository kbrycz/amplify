import React, { useRef, useEffect, useState } from 'react';
import { Iphone15Pro } from '../ui/iphone';
import { Info } from 'lucide-react';

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

  const getCaptionStyle = () => {
    if (!selectedTemplate || !selectedTemplate.captionStyle) return '';
    
    const style = selectedTemplate.captionStyle;
    
    switch (style) {
      case 'standard':
        return 'bg-black/70 text-white px-4 py-2 rounded-md text-center';
      case 'minimal':
        return 'text-white px-3 py-1.5 text-shadow-sm rounded-md text-center';
      case 'outlined':
        return 'text-white px-4 py-2 rounded-md text-center text-shadow-outline';
      case 'bold':
        return 'bg-indigo-600 text-white px-4 py-2 font-bold rounded-md text-center';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md text-center';
      default:
        return 'bg-black/70 text-white px-4 py-2 rounded-md text-center';
    }
  };

  const getBackgroundStyle = () => {
    if (!selectedTemplate || !selectedTemplate.theme) return 'bg-black';
    
    const theme = selectedTemplate.theme;
    
    if (theme.background) {
      return theme.background;
    }
    
    return 'bg-black';
  };

  const renderVideo = () => {
    const captionStyle = getCaptionStyle();
    
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
            {selectedTemplate && captionStyle && (
              <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
                <div className={`${captionStyle} mx-auto max-w-[90%]`}>
                  {selectedTemplate.title || selectedTemplate.name || 'Template Caption'}
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

  const renderOutro = () => {
    if (!selectedTemplate || !selectedTemplate.showOutro) {
      return null;
    }

    const outroTheme = selectedTemplate.outroTheme || 'standard';
    const outroText = selectedTemplate.outroText || 'Thank you for watching!';
    const outroTextColor = selectedTemplate.outroTextColor || '#FFFFFF';
    const outroBackground = selectedTemplate.customOutroColor || '#000000';

    let backgroundClass = 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600'; // Default
    
    if (outroTheme === 'midnight') {
      backgroundClass = 'bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900';
    } else if (outroTheme === 'nature') {
      backgroundClass = 'bg-gradient-to-br from-green-500 via-teal-500 to-blue-500';
    } else if (outroTheme === 'ocean') {
      backgroundClass = 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500';
    } else if (outroTheme === 'custom') {
      backgroundClass = '';
    }

    return (
      <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="text-sm font-medium px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          Outro Preview
        </div>
        <div 
          className={`h-32 flex items-center justify-center p-4 ${backgroundClass}`}
          style={outroTheme === 'custom' ? { backgroundColor: outroBackground } : {}}
        >
          <div 
            className="text-center font-medium"
            style={{ color: outroTextColor }}
          >
            {outroText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="hidden xl:block sticky top-24 h-[calc(100vh-6rem)] w-[500px]">
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
      
      {selectedTemplate && renderOutro()}
    </div>
  );
} 