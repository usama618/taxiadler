/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101416',
        gold: '#F2C55D',
        cream: '#F7F6F2'
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: [],
};
