/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#FE1132',
          teal: '#14B8A6',
          red: '#FE1132',
          'light-gray': '#F7FAFC',
          'text-gray': '#4A5568'
        }
      }
    },
  },
  plugins: [],
};
