import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Game from './pages/Game';
import GameDetails from './pages/GameDetails';
import Players from './pages/Players';
import PlayerDetails from './pages/PlayerDetails';

// Lazy load game components
const Basketball = React.lazy(() => import('./games/basketball/Basketball'));
const Football = React.lazy(() => import('./games/football/Football'));
const Yahtzee = React.lazy(() => import('./games/yahtzee/Yahtzee'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-scoreboard-light-sky"></div>
  </div>
);

function App() {
  return (
    <Router basename="/scoreboard">
      <div className="min-h-screen bg-scoreboard-light-bg">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games/:gameId" element={<GameDetails />} />
              <Route path="/games/:gameId/play" element={<Game />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:id" element={<PlayerDetails />} />
              <Route path="/basketball" element={<Basketball />} />
              <Route path="/football" element={<Football />} />
              <Route path="/yahtzee" element={<Yahtzee />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App; 
