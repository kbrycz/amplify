import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Check, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
  const { user, updateUserProfile, changePassword } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [messages, setMessages] = useState({
    profile: { error: '', success: '' },
    password: { error: '', success: '' }
  });

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

  return (
    <div className="p-6">
      {/* Profile Information */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
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
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}