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

export default function GameDetails() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = gameId ? GAMES[gameId] : null;

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Game not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-cyan-500 to-blue-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
                {game.name}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Description */}
            <div>
              <p className="text-gray-300 text-lg">{game.description}</p>
            </div>

            {/* Rules and Features in Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Rules */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Rules</h2>
                <ul className="space-y-2">
                  {game.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      <span className="text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Features</h2>
                <ul className="space-y-2">
                  {game.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => navigate(`/games/${game.id}/play`)}
                className="px-8 py-4 bg-cyan-500 text-white text-xl font-semibold rounded-xl hover:bg-cyan-600 transition-colors"
              >
                Start Playing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
