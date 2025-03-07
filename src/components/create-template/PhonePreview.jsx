import React, { useRef, useEffect } from 'react';
import { ChevronLeft as SafariBack, ChevronRight as SafariForward, Share2, MoreVertical, Image } from 'lucide-react';
import { Iphone15Pro } from '../ui/iphone';

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
  showOutro = true
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && currentStep === 1) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [currentStep]);

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
      case 'custom':
        return '';
      default:
        return themes.sunset.background;
    }
  };

  const renderCaptionsByPosition = () => {
    const position = getCaptionPosition();
    const captionStyle = getCaptionStyle();
    
    // If no captions selected, just show the video
    if (!captionStyle) {
      return (
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          src="/videos/template.mp4"
        />
      );
    }
    
    const captionContent = (
      <div className={`${captionStyle} mx-auto max-w-[90%]`}>
        {formData.title || 'This is the subtitle text'}
      </div>
    );

    switch (position) {
      case 'top':
        return (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              src="/videos/template.mp4"
            />
            <div className="absolute top-[140px] left-0 right-0 z-10 flex justify-center">
              {captionContent}
            </div>
          </>
        );
      case 'middle':
        return (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              src="/videos/template.mp4"
            />
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10 flex justify-center">
              {captionContent}
            </div>
          </>
        );
      case 'bottom':
      default:
        return (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              src="/videos/template.mp4"
            />
            <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
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
            <div className="h-32 w-32 flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Image className="w-8 h-8 text-white" />
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

  return (
    <div className="hidden lg:block sticky top-0 h-[calc(100vh-1.5rem)] w-[500px] xl:block">
      <div className="flex flex-col items-center">
        <div className="scale-[0.8] origin-top xl:scale-[0.85] -mt-24">
          <Iphone15Pro>
            {/* Content based on current step */}
            {currentStep === 0 && (
              <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Video Preview will be shown on next page
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex flex-col h-full relative">
                {/* Video with captions based on position */}
                {renderCaptionsByPosition()}
              </div>
            )}

            {currentStep === 2 && renderOutroScreen()}
          </Iphone15Pro>
        </div>
      </div>
    </div>
  );
}