import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameSettings from './GameSettings';
import Scoreboard from './Scoreboard';
import { BasketballGameSettings, BasketballTeam, TIME_PRESETS, SCORE_PRESETS } from './types';

const initialSettings: BasketballGameSettings = {
  timeLength: TIME_PRESETS[1].value, // 5 minutes
  finalScore: SCORE_PRESETS[1].value, // 11 points
  homeTeam: {
    id: 'home',
    name: 'Home',
    color: '#FF6B6B',
    score: 0,
    players: []
  },
  awayTeam: {
    id: 'away',
    name: 'Away',
    color: '#4ECDC4',
    score: 0,
    players: []
  }
};

export default function Basketball() {
  const [settings, setSettings] = useState<BasketballGameSettings>(initialSettings);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(settings.timeLength);
  const [winner, setWinner] = useState<'home' | 'away' | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStarted && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsPaused(true);
            checkWinner();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isStarted, isPaused, timeRemaining]);

  // Check for winner
  const checkWinner = () => {
    if (!settings.finalScore) return;

    if (settings.homeTeam.score >= settings.finalScore) {
      setWinner('home');
      setIsPaused(true);
    } else if (settings.awayTeam.score >= settings.finalScore) {
      setWinner('away');
      setIsPaused(true);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleAddPoints = (team: 'home' | 'away', points: number) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [team === 'home' ? 'homeTeam' : 'awayTeam']: {
          ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
          score: Math.max(0, prev[team === 'home' ? 'homeTeam' : 'awayTeam'].score + points)
        }
      };
      return newSettings;
    });
    checkWinner();
  };

  const handleAddTime = (seconds: number) => {
    setTimeRemaining(prev => prev + seconds);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setIsStarted(false);
    setIsPaused(true);
    setTimeRemaining(initialSettings.timeLength);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {!isStarted ? (
          <GameSettings
            settings={settings}
            onSave={setSettings}
            onStart={handleStart}
            isStarted={isStarted}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Scoreboard
              homeTeam={settings.homeTeam}
              awayTeam={settings.awayTeam}
              timeRemaining={timeRemaining}
              isPaused={isPaused}
              finalScore={settings.finalScore}
              onPause={handlePause}
              onResume={handleResume}
              onAddPoints={handleAddPoints}
              onAddTime={handleAddTime}
            />

            {/* Winner Display */}
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h2 className="text-4xl font-bold mb-4" style={{ color: settings[`${winner}Team`].color }}>
                  {winner === 'home' ? 'Home' : 'Away'} Team Wins!
                </h2>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                >
                  Reset Game
                </button>
              </motion.div>
            )}

            {/* Settings Button */}
            {!winner && (
              <div className="text-center">
                <button
                  onClick={() => setIsPaused(true)}
                  className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                >
                  Game Settings
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 
