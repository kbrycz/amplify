import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export default function NamespaceBasicInfo({ formData, setFormData }) {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Namespace Details
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Provide basic information about your namespace.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="block mb-1">
            Namespace Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="Enter namespace name"
            className="w-full"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This will be the name of your organization or team workspace.
          </p>
        </div>

        <div>
          <Label htmlFor="description" className="block mb-1">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Enter a description for this namespace"
            className="w-full h-24"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Provide a brief description of this namespace's purpose.
          </p>
        </div>
      </div>
    </div>
  );
} 