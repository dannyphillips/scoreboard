import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  logo?: string;
}

export interface ScoringOption {
  points: number;
  label: string;
  color?: string;
}

interface ScoreboardProps {
  homeTeam: Team;
  awayTeam: Team;
  timeRemaining: number;
  isPaused: boolean;
  finalScore: number | null;
  winner: Team | null;
  scoringOptions: ScoringOption[];
  periodLabel?: string;
  defaultTeamLogos: {
    home: string;
    away: string;
  };
  onPause: () => void;
  onResume: () => void;
  onAddPoints: (team: 'home' | 'away', points: number) => void;
  onAddTime: (seconds: number) => void;
  onShowSettings: () => void;
  onReset: () => void;
  scoreLabel?: string;
}

export default function Scoreboard({
  homeTeam,
  awayTeam,
  timeRemaining,
  isPaused,
  finalScore,
  winner,
  scoringOptions,
  periodLabel = 'PERIOD',
  defaultTeamLogos,
  onPause,
  onResume,
  onAddPoints,
  onAddTime,
  onShowSettings,
  onReset,
  scoreLabel = 'GOAL'
}: ScoreboardProps) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNewGameClick = (): void => {
    setShowConfirmDialog(true);
  };

  const handleConfirmNewGame = (): void => {
    setShowConfirmDialog(false);
    onReset();
    onShowSettings();
  };

  const handlePlayAgain = (): void => {
    onReset();
    onShowSettings();
  };

  const TeamSection = ({ team, side }: { team: Team; side: 'home' | 'away' }) => (
    <div className="flex flex-col items-center">
      <img 
        src={team.logo || defaultTeamLogos[side]} 
        alt={team.name}
        className="w-16 h-16 sm:w-24 md:w-32 sm:h-24 md:h-32 object-contain mb-2 sm:mb-4"
      />
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">{team.name}</h2>
      <div className="text-4xl sm:text-5xl md:text-[6rem] font-['Wallpoet'] text-white leading-none">
        {String(team.score).padStart(2, '0')}
      </div>
      {/* Point Buttons */}
      <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-4">
        {scoringOptions.map((option) => (
          <button
            key={option.points}
            onClick={() => onAddPoints(side, option.points)}
            className={`bg-gray-700 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full hover:bg-gray-600 text-xl sm:text-2xl ${
              option.color ? `bg-${option.color}` : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="w-full p-2 sm:p-4">
        {/* Header with Team Names and Goal Score */}
        <div className="flex justify-between items-center h-[15vh] relative">
          <div className="w-[30vw] h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: homeTeam.color }}>
            <h2 className="text-4xl font-bold text-white">
              {homeTeam.name || 'Home Team'}
            </h2>
          </div>
          
          {/* Goal Score Display */}
          {finalScore && (
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <div className="bg-gray-800/80 backdrop-blur px-8 py-4 rounded-xl border-2 border-yellow-500 text-center">
                <div className="text-yellow-500 text-base font-semibold uppercase tracking-wider mb-1">
                  {scoreLabel}
                </div>
                <div className="text-4xl font-bold text-yellow-500">
                  {finalScore}
                </div>
                <div className="text-yellow-500 text-base uppercase tracking-wider mt-1">
                  Points
                </div>
              </div>
            </div>
          )}

          <div className="w-[30vw] h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: awayTeam.color }}>
            <h2 className="text-4xl font-bold text-white">
              {awayTeam.name || 'Away Team'}
            </h2>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-2 sm:top-6 right-2 sm:right-6 bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-xl font-semibold flex items-center gap-2 transition-colors text-base sm:text-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Exit Game
        </button>

        {/* Main Score and Timer Section */}
        <div className="flex justify-between items-center gap-2 sm:gap-8 px-2 sm:px-12">
          {/* Home Team */}
          <TeamSection team={homeTeam} side="home" />

          {/* Timer and Game Info */}
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl md:text-3xl text-gray-400 mb-2 sm:mb-4">{periodLabel} 2</div>
            <div className="font-['Wallpoet'] text-4xl sm:text-5xl md:text-[7rem] text-white mb-4 sm:mb-6">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center gap-2 sm:gap-6">
              <button
                onClick={() => onAddTime(-60)}
                className="bg-gray-800 text-white w-16 h-16 sm:w-24 sm:h-24 rounded-full hover:bg-gray-700 text-xl sm:text-2xl"
              >
                -1m
              </button>
              <button
                onClick={isPaused ? onResume : onPause}
                className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full text-xl sm:text-2xl font-semibold ${
                  isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                {isPaused ? 'Start' : 'Stop'}
              </button>
              <button
                onClick={() => onAddTime(60)}
                className="bg-gray-800 text-white w-16 h-16 sm:w-24 sm:h-24 rounded-full hover:bg-gray-700 text-xl sm:text-2xl"
              >
                +1m
              </button>
            </div>
          </div>

          {/* Away Team */}
          <TeamSection team={awayTeam} side="away" />
        </div>

        {/* New Game Button */}
        <div className="absolute bottom-8 sm:bottom-24 left-1/2 -translate-x-1/2">
          <button
            onClick={handleNewGameClick}
            className="bg-red-500 hover:bg-red-600 text-white text-xl sm:text-2xl font-semibold rounded-2xl px-6 sm:px-10 py-2 sm:py-4 shadow-lg transform transition-transform hover:scale-105"
          >
            New Game
          </button>
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
                  {winner.name}
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
    </div>
  );
} 