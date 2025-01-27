/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'scoreboard': {
          'sky': '#87CEEB',    // Light blue from the sky
          'grass': '#90B77D',  // Green from the grass
          'wood': '#CD8D4F',   // Brown from the scoreboard
          'sun': '#FFD700',    // Yellow from the sun
          'tree': '#2E5A1C',   // Dark green from the trees
          'bg': '#F0F9FF',     // Light background
          'text': '#2E5A1C'    // Text color
        }
      },
      fontFamily: {
        'display': ['Bangers', 'system-ui'],
        'body': ['Comic Neue', 'system-ui']
      }
    },
  },
  plugins: [],
} 
