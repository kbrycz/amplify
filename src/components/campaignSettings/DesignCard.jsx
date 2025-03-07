import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { DesignPage } from '../../components/create-campaign/steps/DesignPage';

export default function DesignCard({ selectedTheme, setSelectedTheme }) {
  // Initialize the missing state variables that DesignPage needs
  const [gradientColors, setGradientColors] = useState({
    from: '#4F46E5',
    via: '#7C3AED',
    to: '#DB2777'
  });
  const [gradientDirection, setGradientDirection] = useState('br');
  const [hexText, setHexText] = useState('#FFFFFF');

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
          gradientColors={gradientColors}
          setGradientColors={setGradientColors}
          gradientDirection={gradientDirection}
          setGradientDirection={setGradientDirection}
          hexText={hexText}
          setHexText={setHexText}
          themes={[]} // Pass an empty array or fetch themes if available
        />
      </CardContent>
    </Card>
  );
}