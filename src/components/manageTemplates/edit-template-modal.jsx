import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';

export function EditTemplateModal({ isOpen, onClose, template, onSave }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    captionType: template?.captionType || '',
    captionPosition: template?.captionPosition || '',
    outtroFontColor: template?.outtroFontColor || '',
    outtroBackgroundColors: template?.outtroBackgroundColors || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: template?.name || '',
        captionType: template?.captionType || '',
        captionPosition: template?.captionPosition || '',
        outtroFontColor: template?.outtroFontColor || '',
        outtroBackgroundColors: template?.outtroBackgroundColors || '',
      });
      setIsSubmitting(false);
      setError('');
      setIsSuccess(false);
    }
  }, [isOpen, template]);

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setIsSuccess(false);

    try {
      await onSave(formData);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Template
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Update your template details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="captionType">Caption Type</Label>
              <Select 
                id="captionType"
                value={formData.captionType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, captionType: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select caption type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Subtitle">Subtitle</SelectItem>
                  <SelectItem value="Overlay">Overlay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="captionPosition">Caption Position</Label>
              <Select 
                id="captionPosition"
                value={formData.captionPosition} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, captionPosition: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select caption position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Top">Top</SelectItem>
                  <SelectItem value="Bottom">Bottom</SelectItem>
                  <SelectItem value="Center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="outtroFontColor">Outtro Font Color</Label>
              <Input
                id="outtroFontColor"
                type="text"
                value={formData.outtroFontColor}
                onChange={(e) => setFormData(prev => ({ ...prev, outtroFontColor: e.target.value }))}
                className="mt-1"
                placeholder="#FFFFFF"
              />
            </div>

            <div>
              <Label htmlFor="outtroBackgroundColors">Outtro Background Colors</Label>
              <Input
                id="outtroBackgroundColors"
                type="text"
                value={formData.outtroBackgroundColors}
                onChange={(e) => setFormData(prev => ({ ...prev, outtroBackgroundColors: e.target.value }))}
                className="mt-1"
                placeholder="#000000,#111111"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Comma-separated list of colors for gradient background
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                  isSuccess ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : isSuccess ? (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 