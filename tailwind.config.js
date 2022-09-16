/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: ({colors}) => ({
        primary: '#0E0040',
        primary_accent: '#322B4A',
        primary_light: '#2D0F90',
        secondary: '#F76F8E', // '#F76F8E'
        background: '#FDFFFC',
      }),
      boxShadow: {
        header_shadow: '0px 0px 3px 3px gray',
        card_shadow: '0px 5px 8px 3px gray',
      },
      height: {
        vh: '100vh',
      },
      width: {
        100: '420px',
      },
    },
  },
  plugins: [],
};
