import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
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
              value="system"
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="density">Interface Density</Label>
            <Select
              id="density"
              name="density"
              value="comfortable"
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select density" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
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