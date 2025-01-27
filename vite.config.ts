import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/scoreboard/' : '/',
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'games-basketball': [
            './src/games/basketball/Basketball.tsx',
            './src/games/basketball/BasketballContext.tsx',
            './src/games/basketball/basketballConfig.ts',
            './src/games/basketball/types.ts'
          ],
          'games-football': [
            './src/games/football/Football.tsx',
            './src/games/football/FootballContext.tsx',
            './src/games/football/footballConfig.ts',
            './src/games/football/types.ts'
          ],
          'games-yahtzee': [
            './src/games/yahtzee/Yahtzee.tsx',
            './src/games/yahtzee/YahtzeeContext.tsx',
            './src/games/yahtzee/yahtzeeConfig.ts',
            './src/games/yahtzee/types.ts'
          ],
          'games-shared': [
            './src/games/sports/SportsGame.tsx',
            './src/games/sports/SportsGameContext.tsx',
            './src/games/sports/SportsGameSettings.tsx'
          ]
        }
      }
    }
  }
}) 
