import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Shield, Check, Loader2 } from 'lucide-react';

export default function PrivacySettings() {
  return (
    <div className="mt-16 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Privacy</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Control your privacy and security settings.
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-6">
          <div>
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select
              id="profile-visibility"
              name="profile-visibility"
              className="mt-2"
              defaultValue="public"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="activity-status">Activity Status</Label>
            <Select
              id="activity-status"
              name="activity-status"
              className="mt-2"
              defaultValue="online"
            >
              <option value="online">Show when online</option>
              <option value="offline">Always appear offline</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-6 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  id="analytics"
                  name="analytics"
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
            <Label htmlFor="analytics">
              Allow usage analytics
            </Label>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Shield className="h-4 w-4" />
              Save Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}