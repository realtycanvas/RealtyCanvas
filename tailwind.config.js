/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#feb711',
          'secondary': '#14314b',
          'accent': '#feb711',
          'dark': '#14314b'
        },
        'primary': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fed7aa',
          300: '#feb711',
          400: '#feb711',
          500: '#feb711',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'secondary': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#94a3b8',
          400: '#64748b',
          500: '#14314b',
          600: '#14314b',
          700: '#0f2a3d',
          800: '#0a1f2e',
          900: '#05141f',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),require('tailwind-scrollbar-hide')
  ],
};