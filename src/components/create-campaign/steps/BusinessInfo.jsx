import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Sparkles } from 'lucide-react';

export function BusinessInfo({ formData, handleInputChange, aiGeneratedFields }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Information</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Optional - Fill in if you want to display your business details. <br />
          <span className="font-semibold">Note:</span> Business Name and Business Email are required.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <div className="relative mt-2">
            <Input
              id="businessName"
              placeholder="Enter business name"
              value={formData.businessName}
              onChange={handleInputChange}
              autoComplete="off"
              required
              className={aiGeneratedFields?.businessName ? "border-purple-300 dark:border-purple-500" : ""}
            />
            {aiGeneratedFields?.businessName && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium">AI</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <div className="relative mt-2">
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className={aiGeneratedFields?.website ? "border-purple-300 dark:border-purple-500" : ""}
            />
            {aiGeneratedFields?.website && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium">AI</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="email">Business Email *</Label>
          <div className="relative mt-2">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="contact@business.com"
              autoComplete="off"
              required
              className={aiGeneratedFields?.email ? "border-purple-300 dark:border-purple-500" : ""}
            />
            {aiGeneratedFields?.email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium">AI</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative mt-2">
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              className={aiGeneratedFields?.phone ? "border-purple-300 dark:border-purple-500" : ""}
            />
            {aiGeneratedFields?.phone && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium">AI</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}