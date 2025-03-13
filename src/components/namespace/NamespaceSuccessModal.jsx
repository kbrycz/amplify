import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

export default function NamespaceSuccessModal({ isOpen, onClose, namespaceName, namespaceId, isEditMode = false }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToManage = () => {
    onClose();
    navigate('/app/namespaces/manage');
  };

  const actionText = isEditMode ? 'Updated' : 'Created';
  const createAnotherText = isEditMode ? 'Edit Another Namespace' : 'Create Another Namespace';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 mx-4 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Namespace {actionText} Successfully!
          </h3>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your namespace <span className="font-medium text-gray-900 dark:text-white">{namespaceName}</span> has been {actionText.toLowerCase()} successfully.
          </p>
          
          <div className="mt-6 w-full">
            <button
              onClick={handleGoToManage}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Go to Manage Namespaces
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            
            <button
              onClick={onClose}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {createAnotherText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 