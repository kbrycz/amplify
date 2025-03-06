import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { ConfirmationModal } from '../ui/confirmation-modal';

export default function DeleteAccountSection({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  isLoading,
  error,
  handleDeleteAccount
}) {
  return (
    <div className="mt-16 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Delete Account</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Warning</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>Once you delete your account, there is no going back. Please be certain.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}