import React, { useState, useEffect } from 'react';
import { Label } from '../../ui/label';

const captionStyles = [
  { id: 'none', name: 'No Subtitles', description: 'Video without any subtitles', preview: null },
  { id: 'standard', name: 'Standard', description: 'Clean white text with dark background', preview: 'bg-black/70 text-white px-4 py-2 rounded-md text-center' },
  { id: 'minimal', name: 'Minimal', description: 'Simple white text with no background', preview: 'text-white px-3 py-1.5 text-shadow-sm rounded-md text-center' },
  { id: 'outlined', name: 'Outlined', description: 'White text with black outline', preview: 'text-white px-4 py-2 rounded-md text-center text-shadow-outline' },
  { id: 'bold', name: 'Bold', description: 'Large, impactful text with background', preview: 'bg-primary-600 text-white px-4 py-2 font-bold rounded-md text-center' },
  { id: 'gradient', name: 'Gradient', description: 'Eye-catching gradient background', preview: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md text-center' }
];

const captionPositions = [
  { id: 'top', name: 'Top', description: 'Display captions at the top of the video' },
  { id: 'middle', name: 'Middle', description: 'Display captions in the middle of the video' },
  { id: 'bottom', name: 'Bottom', description: 'Display captions at the bottom of the video' }
];

export function Captions({ selectedCaptionStyle, setSelectedCaptionStyle }) {
  console.log("Captions component received selectedCaptionStyle:", selectedCaptionStyle);
  
  // Initialize captionPosition from selectedCaptionStyle if it exists
  const initialPosition = typeof selectedCaptionStyle === 'object' && selectedCaptionStyle.position
    ? selectedCaptionStyle.position
    : 'bottom';
    
  console.log("Initializing captionPosition to:", initialPosition);
  
  const [captionPosition, setCaptionPosition] = useState(initialPosition);
  const [isSubtitlesDisabled, setIsSubtitlesDisabled] = useState(false);

  // Update captionPosition when selectedCaptionStyle changes
  useEffect(() => {
    if (typeof selectedCaptionStyle === 'object' && selectedCaptionStyle.position) {
      console.log("Updating captionPosition to:", selectedCaptionStyle.position);
      setCaptionPosition(selectedCaptionStyle.position);
    }
  }, [selectedCaptionStyle]);

  useEffect(() => {
    if (typeof selectedCaptionStyle === 'object') {
      setIsSubtitlesDisabled(selectedCaptionStyle.style === 'none');
    } else {
      setIsSubtitlesDisabled(selectedCaptionStyle === 'none');
    }
  }, [selectedCaptionStyle]);

  const handleStyleChange = (styleId) => {
    setSelectedCaptionStyle({ style: styleId, position: captionPosition });
  };

  const handlePositionChange = (positionId) => {
    if (isSubtitlesDisabled) return;
    setCaptionPosition(positionId);
    if (selectedCaptionStyle && typeof selectedCaptionStyle === 'object') {
      setSelectedCaptionStyle({ ...selectedCaptionStyle, position: positionId });
    } else {
      setSelectedCaptionStyle({ style: selectedCaptionStyle || 'standard', position: positionId });
    }
  };

  const currentStyle = typeof selectedCaptionStyle === 'object' 
    ? selectedCaptionStyle.style 
    : selectedCaptionStyle;

  return (
    <div className="space-y-12">
      <div>
        <Label className="text-lg font-medium">Caption Style</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose how captions will appear on your videos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {captionStyles.map((style) => (
            <div
              key={style.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                currentStyle === style.id
                  ? 'border-primary-500 ring-2 ring-primary-500/50 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'
              }`}
              onClick={() => handleStyleChange(style.id)}
            >
              <div className="flex flex-col h-full">
                <h3 className="font-medium text-gray-900 dark:text-white">{style.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 flex-grow">
                  {style.description}
                </p>
                <div className="mt-auto">
                  {style.id === 'none' ? (
                    <div className="mt-auto flex items-center justify-center h-10 text-sm text-gray-400 italic">
                      No subtitles
                    </div>
                  ) : (
                    <div className="relative h-16 bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
                      <div className={`${style.preview} w-full mx-auto max-w-[90%]`}>
                        This is the subtitle text
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`pb-8 transition-all duration-200 ${isSubtitlesDisabled ? 'opacity-50 pointer-events-none filter blur-[0.5px]' : ''}`}>
        <Label className="text-lg font-medium">Caption Position</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose where captions will be displayed on the video.
          {isSubtitlesDisabled && <span className="ml-2 text-primary-500 font-medium">(Select a caption style first)</span>}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {captionPositions.map((position) => (
            <div
              key={position.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                captionPosition === position.id && !isSubtitlesDisabled
                  ? 'border-primary-500 ring-2 ring-primary-500/50 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'
              }`}
              onClick={() => handlePositionChange(position.id)}
            >
              <div className="flex flex-col h-full">
                <h3 className="font-medium text-gray-900 dark:text-white">{position.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {position.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}