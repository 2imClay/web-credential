/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        display: ['Inter', 'Arial', 'sans-serif']
      },
      colors: {
        ink: '#050a12',
        navy: '#03162b',
        blue: '#087fc2',
        cyan: '#21b6e6',
        mist: '#dceaf2'
      }
    }
  },
  plugins: []
}
