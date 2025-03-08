import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { ToggleSwitch } from '../../components/ui/toggle-switch';
import { Upload, X, Image, Layout } from 'lucide-react';

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

export default function OutroSettingsCard({
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
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Create a URL for the file
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setOutroLogo(objectUrl);
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
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Layout className="h-5 w-5 text-indigo-500" />
          Outro Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Outro Screen</h3>
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
            {/* Outro Theme Selection */}
            <div className={`transition-opacity duration-200 ${showOutro ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <Label className="text-base font-medium">Outro Theme</Label>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose the background style for your outro screen.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                {outroThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedOutroTheme === theme.id
                        ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
                    }`}
                    onClick={() => setSelectedOutroTheme(theme.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`h-16 ${theme.background} rounded-md mb-3`}></div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{theme.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Color Picker (only if custom theme is selected) */}
            {selectedOutroTheme === 'custom' && (
              <div className="transition-opacity duration-200">
                <Label htmlFor="customColor" className="text-base font-medium">Custom Background Color</Label>
                <div className="flex mt-2 items-center gap-2">
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

            {/* Logo Upload */}
            <div className={`transition-opacity duration-200 ${showOutro ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <Label className="text-base font-medium">Upload Your Logo</Label>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your logo will be displayed at the end of your videos. Upload a transparent PNG for best results.
              </p>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full min-h-[160px]">
                  <label className="relative flex items-center justify-center w-full h-full border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                    <div className="flex flex-col items-center justify-center p-6">
                      {outroLogo ? (
                        <div className="relative w-40 h-40 group">
                          <img
                            src={outroLogo}
                            alt="Your logo"
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                        </>
                      )}
                    </div>
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
            </div>

            {/* Outro Text */}
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
          </>
        )}
      </CardContent>
    </Card>
  );
} 