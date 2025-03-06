import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { DesignPage } from '../../components/create-campaign/steps/DesignPage';

export default function DesignCard({ selectedTheme, setSelectedTheme }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design</CardTitle>
        <CardDescription>
          Customize the look and feel of your campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DesignPage
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
        />
      </CardContent>
    </Card>
  );
}