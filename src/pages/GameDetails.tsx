import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Game } from '../types/index';

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGame() {
      if (!id) return;
      
      try {
        const gameDoc = await getDoc(doc(db, 'games', id));
        if (gameDoc.exists()) {
          setGame({ id: gameDoc.id, ...gameDoc.data() } as Game);
        } else {
          setError('Game not found');
        }
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [id]);

  const handleStartGame = () => {
    navigate(`/games/${id}/play`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-cyber text-gray-600 dark:text-gray-400">
          Loading game details...
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-cyber text-red-600">
          {error || 'Game not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-scoreboard-dark-surface rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-64 md:h-96">
            <img 
              src={game.imageUrl}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-6 left-6 text-4xl md:text-6xl font-display dark:font-cyber text-white">
              {game.name}
            </h1>
          </div>
          
          <div className="p-6 md:p-8">
            <p className="text-lg md:text-xl font-body dark:font-cyber mb-8 text-gray-700 dark:text-gray-300">
              {game.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-scoreboard-dark-bg p-4 rounded-lg">
                <h3 className="font-cyber text-lg mb-2 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
                  Scoring
                </h3>
                <p className="font-body dark:font-cyber text-gray-600 dark:text-gray-400">
                  {game.scoreType === 'points' ? 'Highest score wins.' : 'Lowest score wins.'} 
                  {game.name === 'Yahtzee' && ' Includes upper section bonus and multiple Yahtzee bonuses.'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-scoreboard-dark-bg p-4 rounded-lg">
                <h3 className="font-cyber text-lg mb-2 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
                  Players
                </h3>
                <p className="font-body dark:font-cyber text-gray-600 dark:text-gray-400">
                  2+ players. Take turns and compete for the {game.highScoreOrder === 'desc' ? 'highest' : 'lowest'} score!
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartGame}
                className="px-8 py-4 bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white font-cyber text-xl rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all"
              >
                Start Playing
              </button>
            </div>
          </div>
        </div>

        {/* High Scores Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white dark:bg-scoreboard-dark-surface rounded-2xl shadow-xl p-6 md:p-8"
        >
          <h2 className="text-3xl font-display dark:font-cyber mb-6 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
            High Scores
          </h2>
          {/* We'll implement the high scores table in a future update */}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default GameDetails; 
