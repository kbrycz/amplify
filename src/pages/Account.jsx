import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Crown, Trash2, AlertTriangle } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { auth, SERVER_URL } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      console.log('Deleting account...');
      
      const response = await fetch(`${SERVER_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete account');
      
      console.log('Account deleted successfully');
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Delete account error:', err);
      setError(err.message.includes('Firebase')
        ? 'We encountered an error while deleting your account. Please try again.'
        : err.message);
      setIsDeleteModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Plan Information */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
        <div className="py-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Current Plan</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your subscription and billing details.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Plan</h3>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                    Current Plan
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Free tier with basic features
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current billing period</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">N/A (Free plan)</p>
            </div>
          </div>
          <div className="mt-4 sm:hidden">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current billing period</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">N/A (Free plan)</p>
          </div>

          <div className="mt-8">
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:border-gray-700 dark:from-indigo-950/30 dark:via-gray-900 dark:to-purple-950/30">
              <div className="flex flex-col p-6 sm:flex-row sm:items-start sm:gap-4">
                <div className="mx-auto mb-4 rounded-full bg-indigo-100 p-2.5 dark:bg-indigo-900/50 sm:mx-0 sm:mb-0">
                  <Crown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white sm:text-left">
                    Upgrade to Premium
                  </h3>
                  <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400 sm:text-left">
                    Get access to advanced features and unlimited campaigns
                  </p>
                  <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account */}
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
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}