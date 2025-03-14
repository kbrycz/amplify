import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

export function InternalName({ formData, handleInputChange, context = 'video' }) {
  const nameIsEmpty = !formData.name?.trim();
  const isTemplate = context === 'template';
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">{isTemplate ? 'Template Name' : 'Video Name'} <span className="text-gray-500">*</span></Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isTemplate 
            ? 'Give your template a name to help you identify and organize it.'
            : 'Give your video a name to help you identify and organize it.'}
        </p>
        <div className="mt-2 flex gap-2">
          <Input
            id="name"
            name="name"
            placeholder={isTemplate ? "Enter template name" : "Enter video name"}
            value={formData.name || ''}
            onChange={handleInputChange}
            autoComplete="off"
            required
            className="flex-1"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {nameIsEmpty 
            ? "Required field - please enter a name to proceed." 
            : `Tip: Make it unique amongst your ${isTemplate ? 'templates' : 'videos'}.`}
        </p>
      </div>
    </div>
  );
}