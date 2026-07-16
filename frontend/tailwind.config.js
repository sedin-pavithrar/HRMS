/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        darkCard: "#151D30",
        darkBorder: "#222F4C",
        accentBlue: "#3B82F6",
        accentTeal: "#14B8A6",
        accentPurple: "#8B5CF6",
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
