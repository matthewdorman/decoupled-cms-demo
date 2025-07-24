/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1B2A41',
          teal: '#FE1132',
          red: '#FE1132',
          'light-gray': '#F7FAFC',
          'text-gray': '#4A5568'
        }
      }
    },
  },
  plugins: [],
};
