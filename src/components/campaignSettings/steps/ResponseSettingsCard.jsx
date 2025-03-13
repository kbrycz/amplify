import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Info } from 'lucide-react';

export const ResponseSettingsCard = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Response Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure how responses are collected and managed.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <div className="mt-1">
              <Input
                id="businessName"
                value={formData.businessName || ''}
                onChange={handleInputChange}
                placeholder="Enter your business name"
                className="w-full"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This will be displayed to respondents in the footer of your survey.
            </p>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <div className="mt-1">
              <Input
                id="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your website URL for respondents to visit.
            </p>
          </div>

          <div>
            <Label htmlFor="email">Contact Email</Label>
            <div className="mt-1">
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="contact@example.com"
                className="w-full"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Email address for respondents to contact you.
            </p>
          </div>

          <div>
            <Label htmlFor="phone">Contact Phone</Label>
            <div className="mt-1">
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
                className="w-full"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Phone number for respondents to contact you.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Response Notifications</Label>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Receive email notifications when someone responds to your survey.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications-toggle"
                checked={formData.notificationsEnabled}
                onCheckedChange={(checked) => {
                  handleInputChange({
                    target: {
                      id: 'notificationsEnabled',
                      value: checked
                    }
                  });
                }}
              />
              <Label htmlFor="notifications-toggle" className="text-sm">
                {formData.notificationsEnabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>

          <div className="flex items-start gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Notifications will be sent to the email address associated with your account. You can update your notification preferences in your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 