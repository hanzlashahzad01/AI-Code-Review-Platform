/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Dark aesthetics
        secondary: "#1E293B",
        accent: "#38BDF8", // Sky blue for AI/Tech feel
      },
    },
  },
  plugins: [],
}
