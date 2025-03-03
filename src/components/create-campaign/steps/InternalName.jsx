import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Sparkles } from 'lucide-react';

export function InternalName({ formData, handleInputChange, aiGeneratedFields }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="internalName">Campaign Name *</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Give your campaign a name to help you identify and organize it. This name is for your reference only and won't be shown to users.
        </p>
        <div className="mt-2 flex gap-2">
          <Input
            id="internalName"
            placeholder="Enter campaign name"
            value={formData.internalName}
            onChange={handleInputChange}
            autoComplete="off"
            required
            className="flex-1"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Tip: Make it unique amongst your campaigns so you can identify it later
        </p>
      </div>
    </div>
  );
}