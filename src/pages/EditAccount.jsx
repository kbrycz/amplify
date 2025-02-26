import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, SERVER_URL } from '../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AlertTriangle, Crown, Check, Zap, Trash2, Loader2, X } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/confirmation-modal';

export default function EditAccount() {
  const { user, updateUserProfile, changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({
    profile: { error: '', success: '' },
    password: { error: '', success: '' },
    delete: { error: '' }
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessages(prev => ({
      ...prev,
      profile: { error: '', success: '' }
    }));

    try {
      const formData = new FormData(e.target);
      await updateUserProfile({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email')
      });

      setMessages(prev => ({
        ...prev,
        profile: { 
          error: '', 
          success: 'Your profile has been updated successfully! The changes will be reflected immediately.' 
        }
      }));
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          profile: { error: '', success: '' }
        }));
      }, 5000);
    } catch (err) {
      console.error('Update profile error:', err);
      setMessages(prev => ({
        ...prev,
        profile: { 
          error: err.message.includes('Firebase') 
            ? 'We encountered an error while updating your profile. Please try again.' 
            : err.message,
          success: '' 
        }
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setMessages(prev => ({
      ...prev,
      password: { error: '', success: '' }
    }));

    try {
      const formData = new FormData(e.target);
      const currentPassword = formData.get('currentPassword');
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      await changePassword(currentPassword, newPassword);

      setMessages(prev => ({
        ...prev,
        password: { 
          error: '', 
          success: 'Your password has been changed successfully! You can now use your new password to sign in.' 
        }
      }));
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          password: { error: '', success: '' }
        }));
      }, 5000);
      
      e.target.reset();
    } catch (err) {
      console.error('Change password error:', err);
      setMessages(prev => ({
        ...prev,
        password: { 
          error: err.message === 'Current password is incorrect'
            ? 'The current password you entered is incorrect. Please try again.'
            : 'We encountered an error while changing your password. Please try again.',
          success: '' 
        }
      }));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    setIsLoading(true);
    setMessages(prev => ({
      ...prev,
      delete: { error: '' }
    }));

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
      setMessages(prev => ({
        ...prev,
        delete: { 
          error: err.message.includes('Firebase')
            ? 'We encountered an error while deleting your account. Please try again.'
            : err.message
        }
      }));
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
                  <ul className="mt-6 space-y-4 sm:mt-4 sm:space-y-3">
                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Unlimited video responses
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Advanced analytics and reporting
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Custom branding and white-labeling
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Priority support
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-col items-center gap-4 sm:mt-6 sm:flex-row">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">
                      <Zap className="h-4 w-4" />
                      Upgrade Now
                    </button>
                    <div className="text-center sm:text-left">
                      <p className="font-medium text-gray-900 dark:text-white">$49/month</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Billed monthly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="mt-16 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
        <div className="py-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your personal information and email address.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-2">
            <div className="sm:col-span-3">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={user?.displayName?.split(' ')[0]}
                className="mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={user?.displayName?.split(' ')[1]}
                className="mt-2"
              />
            </div>

            <div className="col-span-full">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email}
                className="mt-2"
              />
            </div>
          </div>

          {messages.profile.success && (
            <div className="mb-3 mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-4 w-4" />
              {messages.profile.success}
            </div>
          )}
          {messages.profile.error && (
            <div className="mb-3 mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <X className="h-4 w-4" />
              {messages.profile.error}
            </div>
          )}

          <div className="mt-8 flex">
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="mt-16 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
        <div className="py-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Change Password</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your password associated with your account.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl">
            <div className="col-span-full">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="mt-2"
              />
            </div>

            <div className="col-span-full">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="mt-2"
              />
            </div>

            <div className="col-span-full">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-2"
              />
            </div>
          </div>

          {messages.password.success && (
            <div className="mb-3 mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-4 w-4" />
              {messages.password.success}
            </div>
          )}
          {messages.password.error && (
            <div className="mb-3 mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <X className="h-4 w-4" />
              {messages.password.error}
            </div>
          )}

          <div className="mt-8 flex">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isChangingPassword ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                'Update password'
              )}
            </button>
          </div>
        </form>
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