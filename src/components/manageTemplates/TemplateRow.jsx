import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pencil, Trash2, ChevronRight, Clock, Image, PaintBucket, Type 
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { EditTemplateModal } from './edit-template-modal';

/**
 * Helper function to parse a Firestore timestamp or date-like object.
 */
function parseDate(val) {
  if (!val) return null;
  if (typeof val.toDate === 'function') {
    return val.toDate();
  }
  if (typeof val === 'object' && (('seconds' in val) || ('_seconds' in val))) {
    const seconds = val.seconds ?? val._seconds;
    return new Date(seconds * 1000);
  }
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Helper function to convert a date to a relative time string.
 */
function timeAgo(date) {
  if (!date) return 'N/A';
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 0) return 'N/A';
  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
    { label: 'second', secs: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.secs);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

export default function TemplateRow({
  template,
  isEditMode,
  onDelete,
  onUpdate,
  onTemplateClick,
  currentNamespaceId
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(template.id);
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      // Make sure we include the namespaceId in the form data
      const updateData = {
        ...formData,
        namespaceId: currentNamespaceId
      };
      
      return await onUpdate(template.id, updateData);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const dateModified = parseDate(template.lastModified);
  const lastUpdateStr = dateModified ? timeAgo(dateModified) : 'N/A';

  return (
    <div 
      onClick={() => !isEditMode && navigate(`/app/templates/${template.id}`)}
      className={`group relative rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out
        ${!isEditMode ? 'cursor-pointer hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50/50' : ''}
        dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/50`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 p-4 pb-3 lg:pb-4">
        <div className="self-center">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate max-w-[250px]">
              {template.name}
            </h3>
          </div>
          {template.captionType && (
            <div className="mt-1.5 flex items-center gap-2 max-w-md">
              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                Caption Type
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{template.captionType}</span>
            </div>
          )}
          {template.captionPosition && (
            <div className="mt-1.5 mb-1 flex items-start gap-2">
              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                Caption Position
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{template.captionPosition}</span>
            </div>
          )}
        </div>
        <div className="hidden lg:flex flex-col justify-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
            <Type className="h-4 w-4 shrink-0" />
            <span className="font-medium">{template.captionType || 'None'}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Caption Type</div>
        </div>
        <div className="hidden lg:flex flex-col justify-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
            <PaintBucket className="h-4 w-4 shrink-0" />
            <span className="font-medium">{template.outtroFontColor ? 'Custom' : 'Default'}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Font Color</div>
        </div>
        <div className="hidden lg:flex flex-col justify-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
            <Clock className="h-4 w-4 shrink-0" />
            <span className="tabular-nums font-medium">{lastUpdateStr}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Last Update</div>
        </div>
        <div className="hidden lg:flex items-center justify-end self-center">
          {isEditMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 dark:text-gray-600 dark:group-hover:text-indigo-400" />
          )}
        </div>
      </div>
      <div className="lg:hidden grid grid-cols-3 gap-4 px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
        {isEditMode && (
          <div className="col-span-3 flex justify-end mb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
            <Type className="h-4 w-4 shrink-0" />
            <span className="font-medium">{template.captionType || 'None'}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Caption Type</div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
            <PaintBucket className="h-4 w-4 shrink-0" />
            <span className="font-medium">{template.outtroFontColor ? 'Custom' : 'Default'}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Font Color</div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors ${!isEditMode && 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
            <Clock className="h-4 w-4 shrink-0" />
            <span className="tabular-nums font-medium">{lastUpdateStr}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Last Update</div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${template.name}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmText="delete template"
        confirmButtonText="Delete Template"
      />
      <EditTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        template={template}
        onSave={handleUpdate}
      />
    </div>
  );
} 