/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          deep:   '#0A2540',
          mid:    '#1A4A7A',
          bright: '#1E6FBF',
        },
        teal: {
          DEFAULT: '#0D9488',
          light:   '#CCFBF1',
          dark:    '#0B7A71',
        },
        gold: '#C9922A',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
