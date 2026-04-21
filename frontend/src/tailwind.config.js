/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E63939",
        secondary: "#FF8A65",
        accent: "#00B894",
        dark: "#1D1D1F",
        light: "#F8F9FA",
        gray: "#6B7280",
      },
    },
  },
  plugins: [],
}