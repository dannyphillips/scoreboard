import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { YahtzeeGameProvider } from './context/YahtzeeGameContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Users from './pages/Users';
import GameDetails from './pages/GameDetails';
import Yahtzee from './components/games/yahtzee/Yahtzee';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <ThemeProvider>
      <YahtzeeGameProvider>
        <Router>
          <div className="min-h-screen transition-colors duration-200 bg-scoreboard-light-bg dark:bg-scoreboard-dark-bg">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/game/:id" element={<GameDetails />} />
                <Route path="/game/:id/play" element={<Yahtzee />} />
                <Route path="/user/:id" element={<UserProfile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </YahtzeeGameProvider>
    </ThemeProvider>
  );
}

export default App; 
