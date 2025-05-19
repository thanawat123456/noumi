/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
      "./src/app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          orange: {
            400: '#FF9F66',
            500: '#FF8A45',
            600: '#FF7522',
          },
          pink: {
            50: '#FFF5F7',
            100: '#FFF0F3',
            200: '#FFD7E0',
            300: '#FFB9CA',
            400: '#FF8DAD',
            500: '#FF6B93',
            600: '#FF3D73',
          },
          purple: {
            700: '#6C3483',
          }
        },
      },
    },
    plugins: [],
  }