import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Bell, Check, Loader2 } from 'lucide-react';

export default function NotificationsSettings({ isLoading, messages, onSaveNotifications }) {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notifications</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage how you receive notifications and updates.
        </p>
      </div>
      <form onSubmit={onSaveNotifications} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-6">
          <div>
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Select
              id="email-notifications"
              name="email-notifications"
              value="important"
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select email notification preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All notifications</SelectItem>
                <SelectItem value="important">Important only</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Select
              id="push-notifications"
              name="push-notifications"
              value="all"
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select push notification preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All notifications</SelectItem>
                <SelectItem value="important">Important only</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-6 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  id="marketing"
                  name="marketing"
                  type="checkbox"
                  defaultChecked
                  className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                />
                <svg
                  fill="none"
                  viewBox="0 0 14 14"
                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                >
                  <path
                    d="M3 8L6 11L11 3.5"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:checked]:opacity-100"
                  />
                </svg>
              </div>
            </div>
            <Label htmlFor="marketing">
              Receive marketing communications
            </Label>
          </div>
          {messages.success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-4 w-4" />
              {messages.success}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Save Notification Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}