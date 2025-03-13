import React from 'react';
import { Building, ChevronRight, Loader2 } from 'lucide-react';
import { useNamespace } from '../../context/NamespaceContext';

export default function NamespaceSelector() {
  const { 
    currentNamespace, 
    openNamespaceModal, 
    isLoading,
    fetchUserNamespaces 
  } = useNamespace();
  
  const handleClick = () => {
    // Refresh namespaces when opening the modal
    fetchUserNamespaces();
    openNamespaceModal();
  };
  
  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-between w-full px-3 py-3 mt-2 text-sm rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400 animate-spin" />
          ) : (
            <Building className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">Namespace</span>
          <span className="text-sm font-medium truncate max-w-[180px] text-gray-900 dark:text-white">{currentNamespace}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </button>
  );
} 