/** @type {import('tailwindcss').Config} */
import { primary, primaryText, red, green } from './src/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [
    require('@headlessui/tailwindcss')
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        display: ['Geist', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Replace your old primary and primary classes with this new "primary" scale.
        primary: primary,
        'primary-text': primaryText,
        // Include full scales for red and green
        red: red,
        green: green,
        // Other colors (gray, white, black) can remain as Tailwind defaults.
      },
    },
  },
};