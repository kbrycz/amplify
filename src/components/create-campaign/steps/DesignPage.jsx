import React, { useState } from 'react';
import { Label } from '../../ui/label';
import { HexColorPicker } from 'react-colorful';
import { Check, Palette, ChevronDown } from 'lucide-react';

export function DesignPage({ 
  selectedTheme,
  setSelectedTheme,
  gradientColors,
  setGradientColors,
  gradientDirection,
  setGradientDirection,
  hexText,
  setHexText,
  themes
}) {
  const [showCustomColors, setShowCustomColors] = useState(selectedTheme === 'custom');
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [showTextPicker, setShowTextPicker] = useState(false);

  // Ensure all color values have # prefix
  React.useEffect(() => {
    // Check and fix gradient colors
    const updatedGradientColors = { ...gradientColors };
    let needsUpdate = false;
    
    ['from', 'via', 'to'].forEach(position => {
      if (!gradientColors[position].startsWith('#')) {
        updatedGradientColors[position] = `#${gradientColors[position]}`;
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      setGradientColors(updatedGradientColors);
    }
    
    // Check and fix text color
    if (!hexText.startsWith('#')) {
      setHexText(`#${hexText}`);
    }
  }, []);

  // Update showCustomColors when selectedTheme changes
  React.useEffect(() => {
    setShowCustomColors(selectedTheme === 'custom');
  }, [selectedTheme]);

  // Handle gradient color change with # enforcement
  const handleGradientColorChange = (position, value) => {
    // Remove any existing # symbol
    let colorValue = value.replace('#', '');
    
    // Limit to 6 characters
    colorValue = colorValue.substring(0, 6);
    
    // Ensure it's uppercase
    colorValue = colorValue.toUpperCase();
    
    // Add the # symbol back
    setGradientColors(prev => ({
      ...prev,
      [position]: `#${colorValue}`
    }));
  };

  // Handle text color change with # enforcement
  const handleTextColorChange = (value) => {
    // Remove any existing # symbol
    let colorValue = value.replace('#', '');
    
    // Limit to 6 characters
    colorValue = colorValue.substring(0, 6);
    
    // Ensure it's uppercase
    colorValue = colorValue.toUpperCase();
    
    // Add the # symbol back
    setHexText(`#${colorValue}`);
  };

  const handleThemeSelect = (key) => {
    setSelectedTheme(key);
    // If selecting a custom theme, set it to 'custom'
    if (key === 'custom') {
      setSelectedTheme('custom');
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.color-picker-container')) {
      setActiveColorPicker(null);
      setShowTextPicker(false);
    }
  };

  const gradientDirections = [
    { value: 'br', label: 'Bottom Right', class: 'bg-gradient-to-br' },
    { value: 'r', label: 'Right', class: 'bg-gradient-to-r' },
    { value: 'b', label: 'Bottom', class: 'bg-gradient-to-b' },
    { value: 'bl', label: 'Bottom Left', class: 'bg-gradient-to-bl' },
    { value: 'tr', label: 'Top Right', class: 'bg-gradient-to-tr' },
  ];

  const getGradientStyle = () => {
    const direction = gradientDirection === 'br' ? '135deg' :
                     gradientDirection === 'r' ? '90deg' :
                     gradientDirection === 'b' ? '180deg' :
                     gradientDirection === 'bl' ? '225deg' :
                     gradientDirection === 'tr' ? '45deg' : '135deg';
    
    return `linear-gradient(${direction}, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`;
  };
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <Label>Theme</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose a theme that best represents your brand and campaign style.
        </p>
        {showCustomColors ? (
          <div className="mt-6 space-y-6">
            <div>
              <Label>Gradient Colors</Label>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {['from', 'via', 'to'].map((position) => (
                  <div key={position} className="relative color-picker-container">
                    <Label htmlFor={`gradient-${position}`} className="capitalize">{position}</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <div 
                        className="h-8 w-8 rounded-lg border border-gray-200 cursor-pointer dark:border-gray-700"
                        style={{ backgroundColor: gradientColors[position] }}
                        onClick={() => setActiveColorPicker(position)}
                      />
                      <input
                        type="text"
                        id={`gradient-${position}`}
                        placeholder="#000000"
                        value={gradientColors[position]}
                        onChange={(e) => handleGradientColorChange(position, e.target.value)}
                        maxLength={7}
                        className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    {activeColorPicker === position && (
                      <div className="absolute left-0 top-full z-10 mt-2">
                        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                          <HexColorPicker 
                            color={gradientColors[position]} 
                            onChange={(color) => {
                              // Ensure color has # prefix and limit to 7 characters
                              let formattedColor = color.startsWith('#') ? color : `#${color}`;
                              // Limit to 7 characters (# + 6 hex digits)
                              formattedColor = formattedColor.substring(0, 7);
                              setGradientColors(prev => ({
                                ...prev,
                                [position]: formattedColor
                              }));
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Gradient Direction</Label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {gradientDirections.map(({ value, label, class: gradientClass }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGradientDirection(value)}
                    className={`relative flex h-16 items-center justify-center overflow-hidden rounded-lg border transition-all ${
                      gradientDirection === value
                        ? 'border-primary-600 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      gradientDirection === value
                        ? 'text-primary-text-600 dark:text-primary-text-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="customText">Text Color</Label>
                <div className="relative color-picker-container">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-8 w-8 rounded-lg border border-gray-200 cursor-pointer dark:border-gray-700"
                      style={{ backgroundColor: hexText }}
                      onClick={() => setShowTextPicker(!showTextPicker)}
                    />
                  <input
                    type="text"
                    id="customText"
                    placeholder="#FFFFFF"
                    value={hexText}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    maxLength={7}
                    className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                  </div>
                  {showTextPicker && (
                    <div className="absolute right-0 top-full z-10 mt-2">
                      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <HexColorPicker 
                          color={hexText} 
                          onChange={(color) => {
                            // Ensure color has # prefix and limit to 7 characters
                            let formattedColor = color.startsWith('#') ? color : `#${color}`;
                            // Limit to 7 characters (# + 6 hex digits)
                            formattedColor = formattedColor.substring(0, 7);
                            setHexText(formattedColor);
                          }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowCustomColors(false);
                  // If the theme is 'custom', set it back to a default theme
                  if (selectedTheme === 'custom') {
                    setSelectedTheme('sunset');
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Palette className="h-4 w-4" />
                Choose a custom built theme
              </button>
            </div>
          </div>
        ) : (
          <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(themes)
            .filter(([key]) => key !== 'custom') // Filter out the custom theme
            .map(([key, theme]) => (
            <button
              key={key}
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleThemeSelect(key);
              }}
              type="button" // Explicitly set button type to prevent form submission
              className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
                selectedTheme === key
                  ? 'border-primary-600 dark:border-primary-400 ring-4 ring-primary-600/20 dark:ring-primary-400/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-800 hover:border-primary-600/50 dark:hover:border-primary-400/50 shadow-md'
              }`}
            >
              {/* Theme Preview */}
              <div className={`aspect-[4/3] w-full ${theme.background} relative overflow-hidden`}>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Selected Indicator */}
                {selectedTheme === key && (
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-text-600 shadow-lg ring-2 ring-white/20 dark:bg-gray-900 dark:text-primary-text-400 dark:ring-black/20">
                    <Check className="h-5 w-5" />
                  </div>
                )}

                {/* Theme Preview Content */}
                <div className="flex h-full flex-col items-center justify-center p-6">
                  <div className={`w-1/2 rounded-lg ${theme.border} border-2 p-2 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-105`}>
                    <div className={`h-2 w-12 rounded-full ${theme.input} shadow-inner`} />
                  </div>
                </div>
              </div>

              {/* Theme Name */}
              <div className="relative border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="font-medium text-gray-900 dark:text-white transition-colors group-hover:text-primary-text-600 dark:group-hover:text-primary-400">
                  {theme.name}
                </h3>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </button>
          ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setShowCustomColors(true);
                setSelectedTheme('custom');
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Palette className="h-4 w-4" />
              Choose your own colors
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}