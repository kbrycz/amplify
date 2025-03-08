import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Type, PaintBucket } from 'lucide-react';

const captionStyles = [
  {
    id: 'none',
    name: 'No Subtitles',
    description: 'Video without any subtitles',
    preview: null
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Clean white text with dark background',
    preview: 'bg-black/70 text-white px-4 py-2 rounded-md text-center'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple white text with no background',
    preview: 'text-white px-3 py-1.5 text-shadow-sm rounded-md text-center'
  },
  {
    id: 'outlined',
    name: 'Outlined',
    description: 'White text with black outline',
    preview: 'text-white px-4 py-2 rounded-md text-center text-shadow-outline'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Large, impactful text with background',
    preview: 'bg-indigo-600 text-white px-4 py-2 font-bold rounded-md text-center'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Eye-catching gradient background',
    preview: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md text-center'
  }
];

const captionPositions = [
  {
    id: 'top',
    name: 'Top',
    description: 'Display captions at the top of the video'
  },
  {
    id: 'middle',
    name: 'Middle',
    description: 'Display captions in the middle of the video'
  },
  {
    id: 'bottom',
    name: 'Bottom',
    description: 'Display captions at the bottom of the video'
  }
];

export default function CaptionSettingsCard({
  selectedTheme,
  setSelectedTheme,
  selectedCaptionStyle,
  setSelectedCaptionStyle
}) {
  // Extract style and position from selectedCaptionStyle if it's an object
  const currentStyle = typeof selectedCaptionStyle === 'object' 
    ? selectedCaptionStyle.style 
    : selectedCaptionStyle;
    
  const currentPosition = typeof selectedCaptionStyle === 'object'
    ? selectedCaptionStyle.position
    : 'bottom';
    
  const isSubtitlesDisabled = currentStyle === 'none';

  // Handle style change
  const handleStyleChange = (styleId) => {
    if (styleId === 'none') {
      setSelectedCaptionStyle({ style: styleId, position: currentPosition });
    } else {
      setSelectedCaptionStyle({ style: styleId, position: currentPosition });
    }
  };

  // Handle position change
  const handlePositionChange = (positionId) => {
    if (isSubtitlesDisabled) return;
    
    if (selectedCaptionStyle && typeof selectedCaptionStyle === 'object') {
      setSelectedCaptionStyle({ ...selectedCaptionStyle, position: positionId });
    } else {
      setSelectedCaptionStyle({ style: selectedCaptionStyle || 'standard', position: positionId });
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Type className="h-5 w-5 text-indigo-500" />
          Caption Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Caption Style */}
        <div>
          <Label className="text-base font-medium">Caption Style</Label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose how captions will appear on your videos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {captionStyles.map((style) => (
              <div
                key={style.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  currentStyle === style.id
                    ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
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

        {/* Caption Position */}
        <div className={`transition-all duration-200 ${isSubtitlesDisabled ? 'opacity-50 pointer-events-none filter blur-[0.5px]' : ''}`}>
          <Label className="text-base font-medium">Caption Position</Label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose where captions will be displayed on the video.
            {isSubtitlesDisabled && <span className="ml-2 text-indigo-500 font-medium">(Select a caption style first)</span>}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {captionPositions.map((position) => (
              <div
                key={position.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  currentPosition === position.id && !isSubtitlesDisabled
                    ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
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
      </CardContent>
    </Card>
  );
} 