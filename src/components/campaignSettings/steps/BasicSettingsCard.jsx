import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Info, Upload, X } from 'lucide-react';

export const BasicSettingsCard = ({
  formData,
  handleInputChange,
  previewImage,
  handleImageChange,
  handleRemoveImage
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update the basic information for your campaign.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Internal Name</Label>
          <div className="mt-1">
            <Input
              id="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Enter an internal name for this campaign"
              className="w-full"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This name is only visible to you and your team, not to survey respondents.
          </p>
        </div>

        <div>
          <Label htmlFor="title">Campaign Title</Label>
          <div className="mt-1">
            <Input
              id="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              placeholder="Enter a title for your campaign"
              className="w-full"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This title will be displayed to respondents at the top of your survey.
          </p>
        </div>

        <div>
          <Label htmlFor="description">Campaign Description</Label>
          <div className="mt-1">
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Enter a description for your campaign"
              className="w-full min-h-[100px]"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This description will be displayed to respondents below the title.
          </p>
        </div>

        <div>
          <Label>Campaign Image</Label>
          <div className="mt-2">
            {previewImage ? (
              <div className="relative w-full max-w-md">
                <img
                  src={previewImage}
                  alt="Campaign preview"
                  className="rounded-lg border border-gray-200 dark:border-gray-800 object-cover w-full max-h-[200px]"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or GIF (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>This image will be displayed at the top of your survey. Recommended size: 1200x630px.</span>
          </p>
        </div>
      </div>
    </div>
  );
}; 