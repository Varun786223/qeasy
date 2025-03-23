/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'qeasy-blue': '#3b82f6',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 