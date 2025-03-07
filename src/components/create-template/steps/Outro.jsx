import React, { useState, useRef } from 'react';
import { Label } from '../../ui/label';
import { Upload, X, Image } from 'lucide-react';
import { Input } from '../../ui/input';
import { ToggleSwitch } from '../../ui/toggle-switch';

const outroThemes = [
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    text: 'text-white'
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    text: 'text-white'
  },
  {
    id: 'nature',
    name: 'Nature Fresh',
    background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    text: 'text-white'
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    background: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600',
    text: 'text-white'
  },
  {
    id: 'custom',
    name: 'Custom Color',
    background: 'bg-gray-200 dark:bg-gray-700',
    text: 'text-gray-800 dark:text-white',
    isCustom: true
  }
];

export function Outro({ 
  selectedOutroTheme, 
  setSelectedOutroTheme, 
  outroLogo, 
  setOutroLogo,
  customOutroColor,
  setCustomOutroColor,
  outroText,
  setOutroText,
  outroTextColor,
  setOutroTextColor,
  showOutro,
  setShowOutro
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLogoUpload = (file) => {
    if (file) {
      // Create a URL for the file
      const objectUrl = URL.createObjectURL(file);
      setOutroLogo(objectUrl);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setOutroLogo(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextChange = (e) => {
    // Limit text to 60 characters
    if (e.target.value.length <= 60) {
      setOutroText(e.target.value);
    }
  };

  // Ensure hex color format
  const validateHexColor = (color) => {
    // If it's already a valid hex color, return it
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      return color;
    }
    
    // If it's a hex color without #, add it
    if (/^[0-9A-F]{6}$/i.test(color)) {
      return `#${color}`;
    }
    
    // Default to white if invalid
    return '#FFFFFF';
  };

  const handleTextColorChange = (e) => {
    const newColor = e.target.value;
    setOutroTextColor(validateHexColor(newColor));
  };

  const handleToggleOutro = (checked) => {
    setShowOutro(checked);
    if (!checked) {
      // If turning off outro, reset to default theme
      setSelectedOutroTheme('sunset');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Outro Screen</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customize the final screen that appears at the end of your videos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${!showOutro ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            No Outro
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            <ToggleSwitch 
              checked={showOutro} 
              onCheckedChange={handleToggleOutro}
              aria-label="Toggle outro screen"
            />
          </div>
          <span className={`text-sm ${showOutro ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Show Outro
          </span>
        </div>
      </div>

      {showOutro && (
        <>
          <div className={`transition-opacity duration-200 ${showOutro ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <Label className="text-base font-medium">Upload Your Logo</Label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your logo will be displayed at the end of your videos. Upload a transparent PNG for best results.
            </p>
            {outroLogo ? (
              <div className="mt-4 relative">
                <div className="relative w-full max-w-xs mx-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <img 
                    src={outroLogo} 
                    alt="Your logo" 
                    className="max-h-40 max-w-full mx-auto object-contain"
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-2">
                    <Image className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Drag and drop your logo here, or click to browse
                  </p>
                  <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Browse Files
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className={`transition-opacity duration-200 ${showOutro ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <Label className="text-base font-medium">Outro Text</Label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a message or website URL to display below your logo.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="outroText" className="text-sm">Text Content</Label>
                <Input
                  id="outroText"
                  value={outroText}
                  onChange={handleTextChange}
                  placeholder="www.yourwebsite.com"
                  className="mt-1"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {outroText.length}/60 characters
                </p>
              </div>
              <div>
                <Label htmlFor="textColor" className="text-sm">Text Color</Label>
                <div className="flex mt-1 items-center gap-2">
                  <input
                    type="color"
                    id="textColor"
                    value={outroTextColor}
                    onChange={(e) => setOutroTextColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={outroTextColor}
                    onChange={handleTextColorChange}
                    placeholder="#FFFFFF"
                    className="flex-1"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-opacity duration-200 ${showOutro ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <Label className="text-base font-medium">Outro Background</Label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose a background for your outro screen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {outroThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedOutroTheme === theme.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
                  onClick={() => setSelectedOutroTheme(theme.id)}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">{theme.name}</h3>
                    <div className={`h-20 w-full rounded-md ${theme.background} flex flex-col items-center justify-center mb-2 shadow-sm`}>
                      {outroLogo && (
                        <img 
                          src={outroLogo} 
                          alt="Logo preview" 
                          className="max-h-10 max-w-[80%] object-contain mb-1"
                        />
                      )}
                      {outroText && (
                        <div className="text-sm truncate max-w-[90%] text-center" style={{ color: outroTextColor || '#FFFFFF' }}>
                          {outroText.length > 25 ? `${outroText.substring(0, 22)}...` : outroText}
                        </div>
                      )}
                    </div>
                    {theme.isCustom && selectedOutroTheme === 'custom' && (
                      <div className="mt-2">
                        <Label htmlFor="customColor" className="text-sm">Background Color</Label>
                        <div className="flex mt-1 items-center gap-2">
                          <input
                            type="color"
                            id="customColor"
                            value={customOutroColor}
                            onChange={(e) => setCustomOutroColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={customOutroColor}
                            onChange={(e) => setCustomOutroColor(validateHexColor(e.target.value))}
                            placeholder="#3B82F6"
                            className="flex-1"
                            maxLength={7}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}