import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Upload, X } from 'lucide-react';

export function BasicInfo({ 
  formData, 
  handleInputChange, 
  previewImage, 
  handleImageChange, 
  handleRemoveImage,
}) {
  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="name">Campaign Title *</Label>
        <Input
          id="name"
          name="campaign-title"
          placeholder="Enter campaign name"
          value={formData.name}
          onChange={handleInputChange}
          autoComplete="off"
          data-form-type="other"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Campaign Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your campaign's purpose and goals"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label>Campaign Image</Label>
        <div className="mt-2">
          <div className="flex items-center justify-center w-full min-h-[160px]">
            <label className="relative flex items-center justify-center w-full h-full border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
              <div className="flex flex-col items-center justify-center p-6">
                {previewImage ? (
                  <div className="relative w-40 h-40 group">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
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
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}