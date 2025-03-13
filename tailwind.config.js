/** @type {import('tailwindcss').Config} */
import { primary, primaryText, red, green } from './src/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [require('@headlessui/tailwindcss')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        display: ['Geist', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: primary,
        'primary-text': primaryText,
        red: red,
        green: green,
      },
    },
  },
};