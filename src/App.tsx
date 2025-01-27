import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Game from './pages/Game';
import GameDetails from './pages/GameDetails';
import Players from './pages/Players';
import PlayerDetails from './pages/PlayerDetails';

function App() {
  return (
    <Router basename="/scoreboard">
      <div className="min-h-screen bg-scoreboard-light-bg">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games/:gameId" element={<GameDetails />} />
            <Route path="/games/:gameId/play" element={<Game />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
