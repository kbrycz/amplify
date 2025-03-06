import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

export default function BasicSettingsCard({ campaign }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Settings</CardTitle>
        <CardDescription>
          Configure the basic settings for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={campaign?.name}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Campaign Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={campaign?.description}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Campaign Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={campaign?.status || 'Active'}
            className="mt-2"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="visibility">Campaign Visibility</Label>
          <Select
            id="visibility"
            name="visibility"
            defaultValue={campaign?.visibility || 'public'}
            className="mt-2"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="password">Password Protected</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}