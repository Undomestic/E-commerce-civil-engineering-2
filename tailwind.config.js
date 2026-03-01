/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/**/*.js"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        accent: '#3b82f6',
      }
    },
  },
  plugins: [],
}