import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Game } from '../games/types';

const GAMES: Record<string, Game> = {
  yahtzee: {
    id: 'yahtzee',
    name: 'Yahtzee',
    description: 'A classic dice game of luck and strategy',
    image: '/src/assets/images/yahtzee-hero.jpg',
    rules: [
      'Roll five dice up to three times per turn',
      'Score points by matching specific combinations',
      'Fill all categories to complete the game',
      'Bonus points for scoring 63+ in the upper section',
      'Yahtzee bonus for additional Yahtzees after the first'
    ],
    features: [
      'Multiple players support',
      'Automatic scoring calculation',
      'Score history tracking',
      'Player statistics',
      'Dark mode support'
    ]
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    description: 'Track basketball game scores and stats',
    image: '/src/assets/images/basketball-hero.jpg',
    rules: [
      'Add points for field goals, three-pointers, and free throws',
      'Track fouls and timeouts',
      'Manage player substitutions',
      'Monitor game clock and shot clock',
      'Record player statistics'
    ],
    features: [
      'Real-time scoring',
      'Player rotation management',
      'Team statistics',
      'Game clock with automatic timeouts',
      'Dark mode support'
    ]
  }
};

function GameDetails() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const game = gameId ? GAMES[gameId] : null;

  if (!game) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-500">Game not found</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative h-80">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">{game.name}</h1>
          </div>
        </div>

        <div className="p-8">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {game.description}
          </p>

          <div className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <span className="w-2 h-8 bg-cyan-500 rounded mr-3"></span>
              Rules
            </h2>
            <ul className="list-none space-y-3 text-gray-700 dark:text-gray-300">
              {game.rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <span className="w-2 h-8 bg-cyan-500 rounded mr-3"></span>
              Features
            </h2>
            <ul className="list-none space-y-3 text-gray-700 dark:text-gray-300">
              {game.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/games/${game.id}/play`)}
              className="px-8 py-4 bg-cyan-500 text-white rounded-lg font-bold text-lg hover:bg-cyan-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              Start Playing
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GameDetails; 
