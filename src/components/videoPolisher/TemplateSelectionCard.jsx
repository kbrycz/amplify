import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Layout, Plus } from 'lucide-react';

export default function TemplateSelectionCard({ selectedTemplate, setSelectedTemplate, onOpenTemplateModal }) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Layout className="h-5 w-5 text-blue-500" />
          Template Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {selectedTemplate ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-md flex items-center justify-center ${selectedTemplate.theme?.background || 'bg-indigo-500'}`}>
                  <Layout className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedTemplate.captionStyle ? 'With captions' : 'No captions'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenTemplateModal}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Layout className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-1 text-base font-medium text-gray-900 dark:text-white">No template selected</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Choose a template to apply to your video
            </p>
            <button
              type="button"
              onClick={onOpenTemplateModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              Select Template
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 