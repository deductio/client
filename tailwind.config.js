/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
       Plex: ["IBM Plex Sans", "sans-serif"],
       "Plex-Italic": ["IBM Plex Sans"]
      },
    },
  },
  plugins: [],
}