import React, { useRef, useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { Iphone15Pro } from '../../ui/iphone';

export function PhonePreview({ 
  selectedTheme, 
  formData,
  currentStep,
  themes,
  selectedCaptionStyle,
  selectedOutroTheme,
  outroLogo,
  customOutroColor,
  outroText,
  outroTextColor,
  showOutro = true,
  videoRef,
  previewMode, // optional prop for TemplateDetails
  videoUrl // NEW: if provided, use this URL instead of stock video
}) {
  const internalVideoRef = useRef(null);
  const actualVideoRef = videoRef || internalVideoRef;
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (actualVideoRef.current && (previewMode === 'video' || (!previewMode && currentStep === 1))) {
      actualVideoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    } else if (actualVideoRef.current) {
      actualVideoRef.current.pause();
    }
  }, [currentStep, actualVideoRef, previewMode]);

  // Reset video loading state when video URL or step changes
  useEffect(() => {
    if (currentStep === 1 || previewMode === 'video') {
      setIsVideoLoading(true);
    }
  }, [videoUrl, currentStep, previewMode]);

  const handleVideoLoaded = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = () => {
    console.error("Video failed to load");
    setIsVideoLoading(false); // Still set to false to avoid infinite loading
  };

  const theme = themes[selectedTheme] || themes.sunset;

  const getCaptionStyle = () => {
    if (!selectedCaptionStyle || selectedCaptionStyle.style === 'none') return '';
    
    const style = typeof selectedCaptionStyle === 'object' 
      ? selectedCaptionStyle.style 
      : selectedCaptionStyle;
      
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

  const getCaptionPosition = () => {
    if (!selectedCaptionStyle || typeof selectedCaptionStyle !== 'object') {
      return 'bottom';
    }
    return selectedCaptionStyle.position || 'bottom';
  };

  const getOutroBackground = () => {
    if (selectedOutroTheme === 'custom') {
      return '';
    }
    switch (selectedOutroTheme) {
      case 'sunset':
        return themes.sunset.background;
      case 'midnight':
        return themes.midnight.background;
      case 'nature':
        return themes.nature.background;
      case 'ocean':
        return themes.ocean.background;
      default:
        return themes.sunset.background;
    }
  };

  const renderCaptionsByPosition = () => {
    const position = getCaptionPosition();
    const captionStyle = getCaptionStyle();
    const captionContent = (
      <div className={`${captionStyle} mx-auto max-w-[90%]`}>
        {formData.title || 'This is the subtitle text'}
      </div>
    );
    const videoSrc = videoUrl || "/videos/template.mp4";

    switch (position) {
      case 'top':
        return (
          <>
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                <div className="animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 h-40 w-40" />
              </div>
            )}
            <video 
              ref={actualVideoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              src={videoSrc}
              onLoadedData={handleVideoLoaded}
              onError={handleVideoError}
            />
            <div className="absolute top-[140px] left-0 right-0 z-20 flex justify-center">
              {captionContent}
            </div>
          </>
        );
      case 'middle':
        return (
          <>
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                <div className="animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 h-40 w-40" />
              </div>
            )}
            <video 
              ref={actualVideoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              src={videoSrc}
              onLoadedData={handleVideoLoaded}
              onError={handleVideoError}
            />
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-20 flex justify-center">
              {captionContent}
            </div>
          </>
        );
      case 'bottom':
      default:
        return (
          <>
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                <div className="animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 h-40 w-40" />
              </div>
            )}
            <video 
              ref={actualVideoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              src={videoSrc}
              onLoadedData={handleVideoLoaded}
              onError={handleVideoError}
            />
            <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
              {captionContent}
            </div>
          </>
        );
    }
  };

  const renderOutroScreen = () => {
    if (!showOutro) {
      return (
        <div className="flex flex-col h-full bg-black">
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-400 text-sm">
              No outro screen will be shown
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col h-full ${getOutroBackground()}`} style={selectedOutroTheme === 'custom' ? { backgroundColor: customOutroColor } : {}}>
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          {outroLogo ? (
            <img 
              src={outroLogo} 
              alt="Business Logo" 
              className="h-32 w-auto object-contain mb-4"
            />
          ) : (
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/20">
                <Upload className="w-8 h-8 text-white opacity-50" />
              </div>
            </div>
          )}
          {outroText && (
            <div 
              className="text-base font-medium max-w-[80%] break-words text-center"
              style={{ color: outroTextColor || '#FFFFFF' }}
            >
              {outroText}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (previewMode) {
      if (previewMode === 'video') {
        return (
          <div className="flex flex-col h-full relative">
            {renderCaptionsByPosition()}
          </div>
        );
      } else if (previewMode === 'outro') {
        return renderOutroScreen();
      }
    }
    if (currentStep === 0) {
      return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Video Preview will be shown on next page
            </p>
          </div>
        </div>
      );
    } else if (currentStep === 1) {
      return (
        <div className="flex flex-col h-full relative">
          {renderCaptionsByPosition()}
        </div>
      );
    } else if (currentStep === 2) {
      return renderOutroScreen();
    }
    return null;
  };

  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] w-[500px] xl:block">
      <div className="flex flex-col items-center">
        <div className="scale-[0.8] origin-top xl:scale-[0.85] -mt-12">
          <Iphone15Pro>
            {renderContent()}
          </Iphone15Pro>
        </div>
      </div>
    </div>
  );
}