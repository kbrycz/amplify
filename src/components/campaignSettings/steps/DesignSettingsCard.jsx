import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Info, Palette, Check } from 'lucide-react';

export const DesignSettingsCard = ({
  selectedTheme,
  setSelectedTheme,
  gradientColors,
  setGradientColors,
  gradientDirection,
  setGradientDirection,
  hexText,
  setHexText,
  themes
}) => {
  const handleGradientColorChange = (color, position) => {
    setGradientColors({
      ...gradientColors,
      [position]: color
    });
  };

  const handleDirectionChange = (direction) => {
    setGradientDirection(direction);
  };

  const handleTextColorChange = (color) => {
    setHexText(color);
  };

  const handleThemeSelect = (key) => {
    setSelectedTheme(key);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Design Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Customize the look and feel of your campaign.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Theme</Label>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select a theme for your campaign.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(themes)
              .filter(([key]) => key !== 'custom') // Filter out the custom theme
              .map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeSelect(key)}
                type="button"
                className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
                  selectedTheme === key
                    ? 'border-primary-600 dark:border-primary-400 ring-4 ring-primary-600/20 dark:ring-primary-400/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-800 hover:border-primary-600/50 dark:hover:border-primary-400/50 shadow-md'
                }`}
              >
                {/* Theme Preview */}
                <div
                  className="w-full h-24 rounded-md mb-3"
                  style={{
                    background: theme.gradient
                      ? `linear-gradient(to ${theme.direction || 'right'}, ${theme.colors.join(', ')})`
                      : theme.colors[0]
                  }}
                />
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium">{theme.name}</span>
                  {selectedTheme === key && (
                    <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                  )}
                </div>
              </button>
            ))}
            
            {/* Custom Theme Button */}
            <button
              onClick={() => handleThemeSelect('custom')}
              type="button"
              className={`group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
                selectedTheme === 'custom'
                  ? 'border-primary-600 dark:border-primary-400 ring-4 ring-primary-600/20 dark:ring-primary-400/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-800 hover:border-primary-600/50 dark:hover:border-primary-400/50 shadow-md'
              }`}
            >
              <div
                className="w-full h-24 rounded-md mb-3"
                style={{
                  background: themes.custom.gradient
                    ? `linear-gradient(to ${themes.custom.direction || 'right'}, ${themes.custom.colors.join(', ')})`
                    : themes.custom.colors[0]
                }}
              />
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium">Custom</span>
                {selectedTheme === 'custom' && (
                  <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                )}
              </div>
            </button>
          </div>
        </div>

        {selectedTheme === 'custom' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
            <div>
              <Label className="text-base font-medium">Custom Colors</Label>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Customize the gradient colors for your campaign.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="from-color">From Color</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: gradientColors.from }}
                  />
                  <Input
                    id="from-color"
                    type="text"
                    value={gradientColors.from}
                    onChange={(e) => handleGradientColorChange(e.target.value, 'from')}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="via-color">Via Color</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: gradientColors.via }}
                  />
                  <Input
                    id="via-color"
                    type="text"
                    value={gradientColors.via}
                    onChange={(e) => handleGradientColorChange(e.target.value, 'via')}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="to-color">To Color</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: gradientColors.to }}
                  />
                  <Input
                    id="to-color"
                    type="text"
                    value={gradientColors.to}
                    onChange={(e) => handleGradientColorChange(e.target.value, 'to')}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="gradient-direction">Gradient Direction</Label>
              <Select
                value={gradientDirection}
                onValueChange={handleDirectionChange}
              >
                <SelectTrigger id="gradient-direction" className="w-full">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t">Top</SelectItem>
                  <SelectItem value="tr">Top Right</SelectItem>
                  <SelectItem value="r">Right</SelectItem>
                  <SelectItem value="br">Bottom Right</SelectItem>
                  <SelectItem value="b">Bottom</SelectItem>
                  <SelectItem value="bl">Bottom Left</SelectItem>
                  <SelectItem value="l">Left</SelectItem>
                  <SelectItem value="tl">Top Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700"
                  style={{ backgroundColor: hexText }}
                />
                <Input
                  id="text-color"
                  type="text"
                  value={hexText}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Use hex color codes (e.g., #FF5733) for the best results. You can use a color picker tool online to find the perfect colors for your campaign.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 