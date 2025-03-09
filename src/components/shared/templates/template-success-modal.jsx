import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, X, Edit, Plus } from 'lucide-react';

export function TemplateSuccessModal({ isOpen, onClose, templateName, templateId }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewTemplates = () => {
    navigate('/app/templates');
    onClose();
  };

  const handleCreateCampaign = () => {
    navigate('/app/campaigns/new', { state: { useTemplate: true, templateId } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Template Created!
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your template "{templateName}" has been successfully created and is ready to use.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
            <button
              onClick={handleCreateCampaign}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
            <button
              onClick={handleViewTemplates}
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Manage Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 