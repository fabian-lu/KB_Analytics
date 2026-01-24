/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Teal accent (from your logo)
        accent: {
          DEFAULT: '#14b8a6',
          light: '#2dd4bf',
          dark: '#0d9488',
        },
        // Dark mode surfaces (true black)
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0a0a0a',
        },
        card: {
          DEFAULT: '#f5f5f5',
          dark: '#141414',
        },
      },
    },
  },
  plugins: [],
}
