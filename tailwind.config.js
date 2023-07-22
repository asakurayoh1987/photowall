/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'img-loading': "url('/src/assets/img/img_loading.png')",
      },
    },
  },
  plugins: [],
};
