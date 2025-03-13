import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';

export function EditTemplateModal({ isOpen, onClose, template, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    captionType: '',
    captionPosition: '',
    outtroBackgroundColors: '',
    outtroFontColor: '',
    outroText: '',
    outroTheme: '',
    showOutro: false,
    theme: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        captionType: template.captionType || '',
        captionPosition: template.captionPosition || '',
        outtroBackgroundColors: template.outtroBackgroundColors || '',
        outtroFontColor: template.outtroFontColor || '',
        outroText: template.outroText || '',
        outroTheme: template.outroTheme || '',
        showOutro: template.showOutro !== undefined ? template.showOutro : false,
        theme: template.theme || ''
      });
    }
  }, [template]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Make sure we preserve the namespaceId if it exists in the template
      const updateData = {
        ...formData,
        namespaceId: template.namespaceId
      };
      
      await onSave(updateData);
      onClose();
    } catch (err) {
      console.error('Error saving template:', err);
      setError(err.message || 'Failed to save template');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Template</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Template Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="captionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Caption Type
            </label>
            <select
              id="captionType"
              name="captionType"
              value={formData.captionType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="">Select a caption type</option>
              <option value="standard">Standard</option>
              <option value="subtitle">Subtitle</option>
              <option value="none">None</option>
            </select>
          </div>

          {formData.captionType && formData.captionType !== 'none' && (
            <div>
              <label htmlFor="captionPosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Caption Position
              </label>
              <select
                id="captionPosition"
                name="captionPosition"
                value={formData.captionPosition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
              >
                <option value="">Select a position</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
            >
              <option value="">Select a theme</option>
              <option value="sunset">Sunset</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="midnight">Midnight</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showOutro"
              name="showOutro"
              checked={formData.showOutro}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
            />
            <label htmlFor="showOutro" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Show Outro
            </label>
          </div>

          {formData.showOutro && (
            <>
              <div>
                <label htmlFor="outroTheme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Outro Theme
                </label>
                <select
                  id="outroTheme"
                  name="outroTheme"
                  value={formData.outroTheme}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                >
                  <option value="">Select an outro theme</option>
                  <option value="sunset">Sunset</option>
                  <option value="ocean">Ocean</option>
                  <option value="forest">Forest</option>
                  <option value="midnight">Midnight</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {formData.outroTheme === 'custom' && (
                <div>
                  <label htmlFor="outtroBackgroundColors" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Background Color
                  </label>
                  <input
                    type="text"
                    id="outtroBackgroundColors"
                    name="outtroBackgroundColors"
                    value={formData.outtroBackgroundColors}
                    onChange={handleChange}
                    placeholder="#RRGGBB"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label htmlFor="outtroFontColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Outro Font Color
                </label>
                <input
                  type="text"
                  id="outtroFontColor"
                  name="outtroFontColor"
                  value={formData.outtroFontColor}
                  onChange={handleChange}
                  placeholder="#RRGGBB"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="outroText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Outro Text
                </label>
                <input
                  type="text"
                  id="outroText"
                  name="outroText"
                  value={formData.outroText}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
            </>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 