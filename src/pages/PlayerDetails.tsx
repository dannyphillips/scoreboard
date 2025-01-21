import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Player, GameHistory, PlayerStats } from '../types';
import { getPlayer, getPlayerGameHistory, getPlayerStats } from '../services/playerService';

function PlayerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadPlayerData(id);
  }, [id]);

  const loadPlayerData = async (playerId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [playerData, history, stats] = await Promise.all([
        getPlayer(playerId),
        getPlayerGameHistory(playerId),
        getPlayerStats(playerId)
      ]);

      if (!playerData) {
        setError('Player not found');
        return;
      }

      setPlayer(playerData);
      setGameHistory(history);
      setPlayerStats(stats);
    } catch (error) {
      console.error('Error loading player data:', error);
      setError('Failed to load player data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading player data...
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/players')}
            className="px-4 py-2 font-cyber bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white rounded hover:bg-opacity-90"
          >
            Back to Players
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Player Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg overflow-hidden mb-8"
      >
        <div 
          className="h-32 w-full"
          style={{ 
            background: `linear-gradient(45deg, ${player.color}40, ${player.color}20)`,
            borderBottom: `4px solid ${player.color}`
          }}
        />
        <div className="p-6 relative">
          <div 
            className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white dark:border-scoreboard-dark-surface shadow-lg"
            style={{ backgroundColor: player.color }}
          />
          <div className="ml-32">
            <h1 className="font-display dark:font-cyber text-4xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary mb-2">
              {player.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Member since {new Date(player.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6"
        >
          <h2 className="font-cyber text-2xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary mb-4">
            High Scores
          </h2>
          <div className="space-y-4">
            {playerStats.length > 0 ? (
              playerStats.map(stat => (
                <div 
                  key={stat.gameId}
                  className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-scoreboard-dark-bg hover:bg-gray-100 dark:hover:bg-scoreboard-dark-bg/70 transition-colors"
                >
                  <div>
                    <h3 className="font-cyber text-lg text-gray-800 dark:text-gray-200">
                      {stat.gameId}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.gamesPlayed} games played
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-cyber text-xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
                      {stat.highScore}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg: {Math.round(stat.averageScore)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                No games played yet
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6"
        >
          <h2 className="font-cyber text-2xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary mb-4">
            Recent Games
          </h2>
          <div className="space-y-4">
            {gameHistory.length > 0 ? (
              gameHistory.map(game => (
                <div 
                  key={game.id}
                  className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-scoreboard-dark-bg hover:bg-gray-100 dark:hover:bg-scoreboard-dark-bg/70 transition-colors"
                >
                  <div>
                    <h3 className="font-cyber text-lg text-gray-800 dark:text-gray-200">
                      {game.gameName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(game.playedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-cyber text-xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
                      {game.score}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Rank: #{game.rank}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                No recent games
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PlayerDetails; 
