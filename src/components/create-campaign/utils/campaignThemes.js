import { themes as sharedThemes } from '../../../components/survey/themes';

// Extend the shared themes with the custom theme option
export const themes = {
  ...sharedThemes,
  // Add custom theme which is specific to the campaign creation flow
  custom: {
    background: '', // Will be set dynamically
    text: 'text-white',
    subtext: 'text-white/80',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Custom Theme'
  }
}; 