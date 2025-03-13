import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Check, Loader2, X } from 'lucide-react';

export default function ProfileForm({ user, isUpdating, messages, onUpdateProfile }) {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update your personal information and email address.
        </p>
      </div>
      <form
        onSubmit={onUpdateProfile}
        className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
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
            disabled={isUpdating}
            className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
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
  );
}