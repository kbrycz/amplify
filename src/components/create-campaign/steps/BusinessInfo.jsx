import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

export function BusinessInfo({ formData, handleInputChange }) {
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
          <Input
            id="businessName"
            placeholder="Enter business name"
            value={formData.businessName}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label htmlFor="email">Business Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="contact@business.com"
            autoComplete="off"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
          />
        </div>
      </div>
    </div>
  );
}