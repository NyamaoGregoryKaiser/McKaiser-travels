/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',    // blue-600
          light: '#60A5FA',   // blue-400
        },
        secondary: {
          DEFAULT: '#1F2937', // gray-800
          dark: '#111827',    // gray-900
          light: '#374151',   // gray-700
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-playfair)', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
} 