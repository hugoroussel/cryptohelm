/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    theme: {
      fontFamily: {
        'body': ['"Roboto"'],
      }
    },
    extend: {
      colors: {
        lblue: '#3498db',
        twitter: '#1da1f2',
      },
    },
  },
  plugins: [],
};