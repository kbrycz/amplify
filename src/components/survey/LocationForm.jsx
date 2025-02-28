import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export function LocationForm({ formData, handleInputChange, theme, themes }) {
  return (
    <div>
      <h2 className={`text-2xl font-bold ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>Location</h2>
      <p className={`mt-2 text-sm ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
        Please provide your zip code to help us understand our community better.
      </p>
      <div className="mt-8">
        <Label htmlFor="zipCode" className={theme ? themes[theme].text : undefined}>Zip code</Label>
        <Input
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          required
          className={`mt-2 ${theme ? `${themes[theme].border} ${themes[theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
          maxLength={5}
          pattern="[0-9]*"
        />
      </div>
    </div>
  );
}