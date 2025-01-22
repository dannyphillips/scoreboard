import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BasketballTeam, TEAM_PRESETS, TeamPreset } from './types';
import { useNavigate } from 'react-router-dom';

interface ScoreboardProps {
  homeTeam: BasketballTeam;
  awayTeam: BasketballTeam;
  timeRemaining: number;
  isPaused: boolean;
  finalScore: number | null;
  winner: BasketballTeam | null;
  onPause: () => void;
  onResume: () => void;
  onAddPoints: (team: 'home' | 'away', points: number) => void;
  onAddTime: (seconds: number) => void;
  onShowSettings: () => void;
  onReset: () => void;
}

export default function Scoreboard({
  homeTeam,
  awayTeam,
  timeRemaining,
  isPaused,
  finalScore,
  winner,
  onPause,
  onResume,
  onAddPoints,
  onAddTime,
  onShowSettings,
  onReset
}: ScoreboardProps) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNewGameClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmNewGame = () => {
    setShowConfirmDialog(false);
    onReset();
    onShowSettings();
  };

  const handlePlayAgain = () => {
    onReset();
    onShowSettings();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-7xl p-8">
        {/* Header with Team Names and Goal Score */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="w-96 h-16 rounded-full" style={{ backgroundColor: homeTeam.color }}>
            <h2 className="text-4xl font-bold text-white text-center leading-[4rem]">
              {homeTeam.name || 'Home Team'}
            </h2>
          </div>
          
          {/* Goal Score Display */}
          {finalScore && (
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <div className="bg-gray-800/80 backdrop-blur px-8 py-4 rounded-xl border-2 border-yellow-500 text-center">
                <div className="text-yellow-500 text-sm font-semibold uppercase tracking-wider mb-1">
                  Goal
                </div>
                <div className="text-4xl font-bold text-yellow-500">
                  {finalScore}
                </div>
                <div className="text-yellow-500 text-sm uppercase tracking-wider mt-1">
                  Points
                </div>
              </div>
            </div>
          )}

          <div className="w-96 h-16 rounded-full" style={{ backgroundColor: awayTeam.color }}>
            <h2 className="text-4xl font-bold text-white text-center leading-[4rem]">
              {awayTeam.name || 'Away Team'}
            </h2>
          </div>
        </div>

        {/* Main Score and Timer Section */}
        <div className="flex justify-between items-center gap-8">
          {/* Home Team */}
          <div className="flex flex-col items-center">
            <img 
              src={TEAM_PRESETS.find(t => t.color === homeTeam.color)?.logo} 
              alt={homeTeam.name}
              className="w-24 h-24 object-contain mb-2"
            />
            <h2 className="text-4xl font-bold text-white mb-4">{homeTeam.name}</h2>
            <div className="text-[8rem] font-['Wallpoet'] text-white leading-none">
              {String(homeTeam.score).padStart(2, '0')}
            </div>
            {/* Point Buttons */}
            <div className="mt-8 space-y-4">
              <button
                onClick={() => onAddPoints('home', -1)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                -1
              </button>
              <button
                onClick={() => onAddPoints('home', 1)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                +1
              </button>
              <button
                onClick={() => onAddPoints('home', 2)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                +2
              </button>
              <button
                onClick={() => onAddPoints('home', 3)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                +3
              </button>
            </div>
          </div>

          {/* Timer and Game Info */}
          <div className="flex flex-col items-center">
            <div className="text-2xl text-gray-400 mb-2">PERIOD 2</div>
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-[7rem] font-bold mb-8 tabular-nums tracking-[0.15em]"
              style={{ color: '#E0E0E0', fontFamily: "'Wallpoet', monospace" }}
            >
              {/* Timer display */}
              <div className="font-['Wallpoet'] text-[7rem] text-white mb-4">
                {formatTime(timeRemaining)}
              </div>
            </motion.div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => onAddTime(-60)}
                className="bg-gray-800 text-white w-20 h-20 rounded-full hover:bg-gray-700 text-xl"
              >
                -1m
              </button>
              <button
                onClick={isPaused ? onResume : onPause}
                className={`w-20 h-20 rounded-full text-xl font-semibold ${
                  isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                {isPaused ? 'Start' : 'Stop'}
              </button>
              <button
                onClick={() => onAddTime(60)}
                className="bg-gray-800 text-white w-20 h-20 rounded-full hover:bg-gray-700 text-xl"
              >
                +1m
              </button>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center">
            <img 
              src={TEAM_PRESETS.find(t => t.color === awayTeam.color)?.logo} 
              alt={awayTeam.name}
              className="w-24 h-24 object-contain mb-2"
            />
            <h2 className="text-4xl font-bold text-white mb-4">{awayTeam.name}</h2>
            <div className="text-[8rem] font-['Wallpoet'] text-white leading-none">
              {String(awayTeam.score).padStart(2, '0')}
            </div>
            {/* Point Buttons */}
            <div className="mt-8 space-y-4">
              <button
                onClick={() => onAddPoints('away', -1)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                -1
              </button>
              <button
                onClick={() => onAddPoints('away', 1)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                +1
              </button>
              <button
                onClick={() => onAddPoints('away', 2)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                +2
              </button>
              <button
                onClick={() => onAddPoints('away', 3)}
                className="bg-gray-700 text-white w-14 h-14 rounded-full hover:bg-gray-600 text-xl"
              >
                +3
              </button>
            </div>
          </div>
        </div>

        {/* New Game Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={handleNewGameClick}
            className="bg-red-500 hover:bg-red-600 text-white text-xl font-semibold rounded-2xl px-8 py-4 shadow-lg transform transition-transform hover:scale-105"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-gray-800 p-8 rounded-2xl max-w-md w-full mx-4"
            >
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Start New Game?
              </h3>
              <p className="text-gray-300 mb-8 text-center">
                Current game progress will be lost.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmNewGame}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-xl"
                >
                  Start New Game
                </button>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winner Modal */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 p-8 rounded-2xl max-w-lg w-full mx-4 text-center">
              <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-6xl font-bold mb-4"
                style={{ color: winner.color }}
              >
                Winner!
              </motion.div>
              <motion.h2 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-4xl font-bold mb-8 text-white"
              >
                {winner === homeTeam ? 'Home Team' : 'Away Team'}
              </motion.h2>
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-3xl text-white mb-4"
              >
                Final Score
              </motion.div>
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="flex justify-center items-center gap-8 mb-12"
              >
                <div className="text-center">
                  <div className="text-2xl text-gray-400">Home</div>
                  <div className="text-6xl font-bold" style={{ color: homeTeam.color }}>
                    {homeTeam.score}
                  </div>
                </div>
                <div className="text-4xl text-gray-400">-</div>
                <div className="text-center">
                  <div className="text-2xl text-gray-400">Away</div>
                  <div className="text-6xl font-bold" style={{ color: awayTeam.color }}>
                    {awayTeam.score}
                  </div>
                </div>
              </motion.div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handlePlayAgain}
                  className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white text-xl font-semibold rounded-xl"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-xl font-semibold rounded-xl"
                >
                  Exit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
