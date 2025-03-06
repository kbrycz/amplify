import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Check, Loader2, X } from 'lucide-react';

export default function PasswordForm({ isChangingPassword, messages, onChangePassword }) {
  return (
    <div className="mt-16 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update your password associated with your account.
        </p>
      </div>
      <form
        onSubmit={onChangePassword}
        className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
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

        {messages.success && (
          <div className="mb-3 mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <Check className="h-4 w-4" />
            {messages.success}
          </div>
        )}
        {messages.error && (
          <div className="mb-3 mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <X className="h-4 w-4" />
            {messages.error}
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
  );
}