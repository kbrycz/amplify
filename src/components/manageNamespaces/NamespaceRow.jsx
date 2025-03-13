import React, { useState } from 'react';
import { Trash2, Users, Shield, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NamespaceRow({ namespace, roleIcon, onClick, onDelete, currentUserRole, isEditMode = false }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const isAdmin = currentUserRole === 'admin';

  // Format the date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    try {
      // Handle different timestamp formats
      let date;
      
      // If it's a Firestore timestamp with toDate method
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } 
      // If it's a string or number, convert to Date
      else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp);
      }
      // If it's already a Date object
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Default fallback
      else {
        return 'Recently';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  // Truncate description for display
  const getTruncatedDescription = () => {
    if (!namespace.description) return '';
    return namespace.description.length > 60 
      ? `${namespace.description.substring(0, 60)}...` 
      : namespace.description;
  };

  // Count active members
  const activeMembers = namespace.members?.filter(m => m.status === 'active')?.length || 0;
  const pendingMembers = namespace.members?.filter(m => m.status === 'pending')?.length || 0;
  const totalMembers = namespace.members?.length || 0;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    if (deleteConfirmation === namespace.name) {
      onDelete();
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(false);
    setDeleteConfirmation('');
  };

  const handleRowClick = (e) => {
    if (!isEditMode && onClick) {
      onClick(e);
    }
  };

  return (
    <>
      <div
        onClick={handleRowClick}
        className={`group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all ${
          !isEditMode ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : ''
        } dark:border-gray-700 dark:bg-gray-800 w-full mb-4`}
      >
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr,1fr,auto] gap-4">
            <div className="self-center">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 flex-shrink-0">
                  <span className="text-lg font-medium text-primary-800 dark:text-primary-300">
                    {namespace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {namespace.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getTruncatedDescription() || 'No description'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex flex-col justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-text-600 dark:group-hover:text-primary-400 transition-colors">
                <Users className="h-4 w-4 shrink-0" />
                <span className="font-medium">
                  {totalMembers} {totalMembers === 1 ? 'member' : 'members'}
                  {pendingMembers > 0 && ` (${pendingMembers} pending)`}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Members</div>
            </div>
            
            <div className="hidden lg:flex flex-col justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-text-600 dark:group-hover:text-primary-400 transition-colors">
                {roleIcon}
                <span className="font-medium">
                  {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Your Role</div>
            </div>
            
            <div className="hidden lg:flex items-center justify-end self-center">
              {isEditMode && isAdmin ? (
                <button
                  onClick={handleDeleteClick}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                  aria-label={`Delete ${namespace.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : !isEditMode ? (
                <div className="text-gray-400 group-hover:text-primary-500 dark:text-gray-600 dark:group-hover:text-primary-400">
                  <ChevronRight className="h-5 w-5" />
                </div>
              ) : null}
            </div>
          </div>
          
          {/* Mobile view for members and role */}
          <div className="lg:hidden grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-text-600 dark:group-hover:text-primary-400 transition-colors">
                <Users className="h-4 w-4 shrink-0" />
                <span className="font-medium">
                  {totalMembers} {totalMembers === 1 ? 'member' : 'members'}
                  {pendingMembers > 0 && ` (${pendingMembers} pending)`}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Members</div>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-text-600 dark:group-hover:text-primary-400 transition-colors">
                {roleIcon}
                <span className="font-medium">
                  {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Your Role</div>
            </div>
            
            {/* Mobile delete button */}
            {isEditMode && isAdmin && (
              <div className="col-span-2 flex justify-start mt-3">
                <button
                  onClick={handleDeleteClick}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                  aria-label={`Delete ${namespace.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleCancelDelete}>
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Delete Namespace
              </h3>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone. This will permanently delete the
                <span className="font-semibold"> {namespace.name} </span>
                namespace and all associated data.
              </p>
              
              <div className="mt-4 w-full">
                <label htmlFor="confirm-delete" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left mb-1">
                  Please type <span className="font-semibold">{namespace.name}</span> to confirm:
                </label>
                <input
                  type="text"
                  id="confirm-delete"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder={namespace.name}
                />
              </div>
              
              <div className="mt-6 flex w-full space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmation !== namespace.name}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 