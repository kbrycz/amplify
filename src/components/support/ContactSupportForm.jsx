// src/components/support/ContactSupportForm.jsx
import React from 'react';
import { Plus, Minus, Upload, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';

export default function ContactSupportForm({
  previewImage,
  isSubmitting,
  handleImageChange,
  handleRemoveImage,
  handleSubmit
}) {
  return (
    <div className="mt-10 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Contact Support</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Get in touch with our support team for personalized assistance.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="mt-2"
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2"
                placeholder="you@example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="subject">Subject</Label>
              <Select id="subject" name="subject" required className="mt-2">
                <option value="">Select a subject</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                className="mt-2"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Screenshot or Image</Label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="relative flex items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {previewImage ? (
                        <div className="relative w-full h-full p-2">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-24 object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
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

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}