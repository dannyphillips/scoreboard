import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoLight from '../assets/images/logo-light.png';
import logoDark from '../assets/images/logo-dark.png';
import { useTheme } from '../context/ThemeContext';

function Navigation() {
  const { theme } = useTheme();

  return (
    <nav className="transition-all duration-300 bg-scoreboard-light-sky dark:bg-scoreboard-dark-bg shadow-lg dark:shadow-neon">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={theme === 'light' ? logoLight : logoDark}
              alt="Scoreboard" 
              className="w-14 h-14 drop-shadow-md dark:filter dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] dark:animate-pulse-slow"
            />
            <span className="font-display dark:font-cyber dark:font-black text-3xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary dark:shadow-neon-text uppercase tracking-wider">
              Scoreboard
            </span>
          </Link>
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="font-display dark:font-cyber dark:font-bold text-lg text-scoreboard-light-tree dark:text-scoreboard-dark-primary hover:text-scoreboard-light-wood dark:hover:text-scoreboard-dark-secondary transition-all tracking-wide dark:tracking-[0.2em] dark:shadow-neon-text hover:scale-105 transform"
            >
              GAMES
            </Link>
            <Link 
              to="/users" 
              className="font-display dark:font-cyber dark:font-bold text-lg text-scoreboard-light-tree dark:text-scoreboard-dark-primary hover:text-scoreboard-light-wood dark:hover:text-scoreboard-dark-secondary transition-all tracking-wide dark:tracking-[0.2em] dark:shadow-neon-text hover:scale-105 transform"
            >
              PLAYERS
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 
