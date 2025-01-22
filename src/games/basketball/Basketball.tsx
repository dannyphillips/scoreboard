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
  const [showSettings, setShowSettings] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(settings.timeLength);
  const [winner, setWinner] = useState<BasketballTeam | null>(null);

  // Timer effect
  useEffect(() => {
    let timer: number | undefined;
    if (!isPaused && timeRemaining > 0 && !winner) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, timeRemaining, winner]);

  // Check for winner
  useEffect(() => {
    if (settings.finalScore) {
      if (settings.homeTeam.score >= settings.finalScore) {
        setWinner(settings.homeTeam);
        setIsPaused(true);
      } else if (settings.awayTeam.score >= settings.finalScore) {
        setWinner(settings.awayTeam);
        setIsPaused(true);
      }
    }
    if (timeRemaining === 0) {
      setIsPaused(true);
      if (settings.homeTeam.score > settings.awayTeam.score) {
        setWinner(settings.homeTeam);
      } else if (settings.awayTeam.score > settings.homeTeam.score) {
        setWinner(settings.awayTeam);
      }
    }
  }, [settings.homeTeam.score, settings.awayTeam.score, settings.finalScore, timeRemaining]);

  const handleSaveSettings = (newSettings: BasketballGameSettings) => {
    setSettings(newSettings);
    setTimeRemaining(newSettings.timeLength);
    setShowSettings(false);
    setIsStarted(true);
    setIsPaused(true);
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
    setSettings(prev => ({
      ...prev,
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
        score: Math.max(0, prev[team === 'home' ? 'homeTeam' : 'awayTeam'].score + points)
      }
    }));
  };

  const handleAddTime = (seconds: number) => {
    setTimeRemaining(prev => Math.max(0, prev + seconds));
  };

  const handleReset = () => {
    setSettings(prev => ({
      ...prev,
      homeTeam: { ...prev.homeTeam, score: 0 },
      awayTeam: { ...prev.awayTeam, score: 0 }
    }));
    setTimeRemaining(settings.timeLength);
    setIsPaused(true);
    setWinner(null);
  };

  if (showSettings) {
    return (
      <GameSettings
        settings={settings}
        onSave={handleSaveSettings}
        onStart={() => setShowSettings(false)}
        isStarted={isStarted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
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
              winner={winner}
              onPause={handlePause}
              onResume={handleResume}
              onAddPoints={handleAddPoints}
              onAddTime={handleAddTime}
              onShowSettings={() => setShowSettings(true)}
              onReset={handleReset}
            />

            {/* Winner Display */}
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h2 className="text-4xl font-bold mb-4" style={{ color: settings[`${winner.id}Team`].color }}>
                  {winner.name} Team Wins!
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
