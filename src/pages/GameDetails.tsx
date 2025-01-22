import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Game } from '../games/types';

const GAMES: Record<string, Game> = {
  yahtzee: {
    id: 'yahtzee',
    name: "Shake N' Score",
    description: 'A thrilling dice game where strategy meets luck',
    image: '../src/assets/images/games/yahtzee-card.jpg',
    rules: [
      'Roll five dice up to three times per turn',
      'Score points by matching specific combinations',
      'Fill all categories to complete the game',
      'Bonus points for scoring 63+ in the upper section',
      'Extra points for additional five-of-a-kind after the first'
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
    image: '../src/assets/images/games/basketball-card.jpg',
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Game not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Cover Photo */}
        <div className="relative">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-[500px] object-cover rounded-xl"
          />
          <button
            onClick={() => navigate(`/games/${gameId}/play`)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Start Playing
          </button>
        </div>

        {/* Right Column - Game Info */}
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
          <p className="text-gray-300 text-lg mb-8">{game.description}</p>
          
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Rules</h2>
            <ul className="list-disc list-inside space-y-2">
              {game.rules.map((rule, index) => (
                <li key={index} className="text-gray-300">{rule}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              {game.features.map((feature, index) => (
                <li key={index} className="text-gray-300">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
