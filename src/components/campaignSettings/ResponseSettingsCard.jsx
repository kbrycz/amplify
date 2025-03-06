import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export default function ResponseSettingsCard({ campaign }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Settings</CardTitle>
        <CardDescription>
          Configure how responses are collected and managed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="responseLimit">Response Limit</Label>
          <Input
            id="responseLimit"
            name="responseLimit"
            type="number"
            min="0"
            defaultValue={campaign?.responseLimit || ''}
            placeholder="Leave empty for unlimited"
            className="mt-2"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set a limit on the number of responses this campaign can receive
          </p>
        </div>
        <div>
          <Label htmlFor="notificationEmail">Notification Email</Label>
          <Input
            id="notificationEmail"
            name="notificationEmail"
            type="email"
            defaultValue={campaign?.notificationEmail || ''}
            placeholder="Enter email for notifications"
            className="mt-2"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Receive email notifications when new responses are submitted
          </p>
        </div>
      </CardContent>
    </Card>
  );
}