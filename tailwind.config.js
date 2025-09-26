/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clickup: {
          primary: '#7B68EE',
          secondary: '#2C2F36',
          accent: '#FF6B35',
          success: '#00C851',
          warning: '#ffbb33',
          danger: '#ff4444',
        }
      }
    },
  },
  plugins: [],
}