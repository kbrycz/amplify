import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Moon } from 'lucide-react';

export default function AppearanceSettings() {
  return (
    <div className="mt-16 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Customize how Amplify looks and feels.
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-6">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select
              id="theme"
              name="theme"
              className="mt-2"
              defaultValue="system"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="density">Interface Density</Label>
            <Select
              id="density"
              name="density"
              className="mt-2"
              defaultValue="comfortable"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </Select>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Moon className="h-4 w-4" />
              Save Appearance Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}