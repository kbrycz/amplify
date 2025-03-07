import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const categories = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'educational', label: 'Educational' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'product', label: 'Product' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' }
];

export function TemplateInfo({ formData, handleInputChange, handleSelectChange }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Template Title *</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Give your template a descriptive title that will be shown to users.
        </p>
        <Input
          id="title"
          placeholder="Enter template title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-2"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Template Description *</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Provide a brief description of what this template is for and how it should be used.
        </p>
        <Textarea
          id="description"
          placeholder="Enter template description"
          value={formData.description}
          onChange={handleInputChange}
          className="mt-2 min-h-[100px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select a category that best describes this template.
        </p>
        <Select
          id="category"
          value={formData.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="businessName">Business Name</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter the name of your business or organization.
        </p>
        <Input
          id="businessName"
          placeholder="Enter business name"
          value={formData.businessName}
          onChange={handleInputChange}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter your website URL.
        </p>
        <Input
          id="website"
          placeholder="https://example.com"
          value={formData.website}
          onChange={handleInputChange}
          className="mt-2"
        />
      </div>
    </div>
  );
}