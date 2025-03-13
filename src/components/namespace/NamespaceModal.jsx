import React, { useRef, useEffect } from 'react';
import { X, Plus, Building, Settings, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNamespace } from '../../context/NamespaceContext';

export default function NamespaceModal() {
  const navigate = useNavigate();
  const { 
    isNamespaceModalOpen, 
    closeNamespaceModal, 
    namespaces, 
    currentNamespace,
    switchNamespace,
    isLoading,
    error,
    fetchUserNamespaces
  } = useNamespace();

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    if (!isNamespaceModalOpen) return;
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeNamespaceModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNamespaceModalOpen, closeNamespaceModal]);

  // Close modal when pressing Escape key
  useEffect(() => {
    if (!isNamespaceModalOpen) return;
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeNamespaceModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isNamespaceModalOpen, closeNamespaceModal]);

  if (!isNamespaceModalOpen) return null;

  const handleNavigateToCreate = () => {
    closeNamespaceModal();
    navigate('/app/namespaces/create');
  };

  const handleNavigateToManage = () => {
    closeNamespaceModal();
    navigate('/app/namespaces/manage');
  };

  const handleSelectNamespace = (namespace) => {
    switchNamespace(namespace.name);
  };

  // Function to display namespace name safely
  const getNamespaceName = (namespace) => {
    if (typeof namespace === 'string') return namespace;
    return namespace?.name || 'Unknown';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 mx-4 animate-in fade-in zoom-in duration-200"
      >
        <button
          onClick={closeNamespaceModal}
          className="absolute right-6 top-6 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Namespaces
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between your available namespaces
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading namespaces...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
              <div className="flex flex-col items-center justify-center">
                <svg className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unable to Load Namespaces</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            </div>
          )}

          {/* Available Namespaces */}
          {!isLoading && !error && namespaces.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Namespaces</h4>
              <div className="space-y-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                {namespaces.map((namespace) => (
                  <button
                    key={namespace.id || namespace.name}
                    onClick={() => handleSelectNamespace(namespace)}
                    className={`w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                      getNamespaceName(namespace) === currentNamespace ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{getNamespaceName(namespace)}</span>
                      {namespace.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">{namespace.description}</span>
                      )}
                    </div>
                    {getNamespaceName(namespace) === currentNamespace && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Namespaces */}
          {!isLoading && !error && namespaces.length === 0 && (
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">You don't have any namespaces yet.</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Create a new namespace to get started.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-3">
            <button
              onClick={handleNavigateToCreate}
              className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Create New</span>
            </button>
            <button
              onClick={handleNavigateToManage}
              className="flex items-center justify-center gap-2 p-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Manage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 