import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Upload, X, Sparkles } from 'lucide-react';

export function BasicInfo({ 
  formData, 
  handleInputChange, 
  previewImage, 
  handleImageChange, 
  handleRemoveImage,
  setIsAIModalOpen 
}) {
  return (
    <div className="space-y-8">
      <button
        onClick={() => setIsAIModalOpen(true)}
        className="group flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-800 dark:group-hover:bg-gray-700">
          <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </div>
        <span className="font-medium text-gray-900 dark:text-white">
          Try our AI Campaign Creator
        </span>
        <div className="ml-auto">
          <div className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            New
          </div>
        </div>
      </button>

      <div>
        <Label htmlFor="name">Campaign Name *</Label>
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
    </div>
  );
}