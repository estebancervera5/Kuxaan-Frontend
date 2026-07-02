/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        kuxaan: {
          jade:      '#1E3A2F',
          terracota: '#C16E4F',
          terracota_dark: '#9F5235',
          cream:     '#F2EBDD',
          ink:       '#1A1A17',
        },
      },
    },
  },
  plugins: [],
};
