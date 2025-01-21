import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { YahtzeeGameProvider } from './context/YahtzeeGameContext';
import Navigation from './components/Navigation';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import Yahtzee from './components/games/yahtzee/Yahtzee';
import Players from './pages/Players';
import PlayerDetails from './pages/PlayerDetails';

function App() {
  return (
    <ThemeProvider>
      <YahtzeeGameProvider>
        <Router>
          <div className="min-h-screen transition-colors duration-200 bg-scoreboard-light-bg dark:bg-scoreboard-dark-bg">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Games />} />
                <Route path="/games/:id" element={<GameDetails />} />
                <Route path="/games/:id/play" element={<Yahtzee />} />
                <Route path="/players" element={<Players />} />
                <Route path="/players/:id" element={<PlayerDetails />} />
              </Routes>
            </main>
          </div>
        </Router>
      </YahtzeeGameProvider>
    </ThemeProvider>
  );
}

export default App; 
