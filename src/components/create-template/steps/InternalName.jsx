import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

export function InternalName({ formData, handleInputChange }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Template Name *</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Give your template a name to help you identify and organize it.
        </p>
        <div className="mt-2 flex gap-2">
          <Input
            id="name"
            placeholder="Enter template name"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="off"
            required
            className="flex-1"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Tip: Make it unique amongst your templates.
        </p>
      </div>
    </div>
  );
}