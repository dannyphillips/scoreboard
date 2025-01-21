/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        'scoreboard': {
          light: {
            'sky': '#87CEEB',    // Light blue from the sky
            'grass': '#90B77D',  // Green from the grass
            'wood': '#CD8D4F',   // Brown from the scoreboard
            'sun': '#FFD700',    // Yellow from the sun
            'tree': '#2E5A1C',   // Dark green from the trees
            'bg': '#F0F9FF',     // Light background
            'text': '#2E5A1C'    // Text color
          },
          dark: {
            'primary': '#00FFFF', // Cyan
            'secondary': '#FF4D00', // Neon orange
            'accent': '#FFD700',  // Bright yellow
            'bg': '#0A0A1F',     // Deep navy
            'surface': '#1A1A3A', // Slightly lighter navy
            'text': '#00FFFF',   // Cyan text
            'glow': '#FF4D00'    // Orange glow
          }
        }
      },
      fontFamily: {
        'display': ['Bangers', 'system-ui'],
        'body': ['Comic Neue', 'system-ui'],
        'cyber': ['Orbitron', 'Share Tech Mono', 'monospace']
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.scoreboard.dark.primary), 0 0 20px theme(colors.scoreboard.dark.glow)',
        'neon-text': '0 0 2px theme(colors.scoreboard.dark.primary), 0 0 10px theme(colors.scoreboard.dark.primary)',
        'neon-strong': '0 0 5px theme(colors.scoreboard.dark.primary), 0 0 20px theme(colors.scoreboard.dark.primary), 0 0 40px theme(colors.scoreboard.dark.glow)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} 
