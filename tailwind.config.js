/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '12': '70px',
        '32': '320px'
      },
      fontFamily: {
        sofia: ['Sofia Pro'],
        mooli: ['Mooli']
      }
    },
  },
  plugins: [],
}
