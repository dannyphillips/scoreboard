import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../../types';
import PlayerManagement from '../PlayerManagement';
import { getAllPlayers } from '../../services/playerService';

interface PlayerSelectionModalProps {
  onSelect: (player: Player) => void;
  onClose: () => void;
  onDelete?: (player: Player) => void;
  excludePlayerIds?: string[];
  title?: string;
  editingPlayer?: Player | null;
}

function PlayerSelectionModal({ 
  onSelect, 
  onClose, 
  onDelete,
  excludePlayerIds = [], 
  title = 'Add Player',
  editingPlayer = null
}: PlayerSelectionModalProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlayer) {
      setShowCreateNew(true);
    } else {
      loadPlayers();
    }
  }, [editingPlayer]);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const allPlayers = await getAllPlayers();
      // Filter out excluded players
      const availablePlayers = allPlayers.filter(
        player => !excludePlayerIds.includes(player.id)
      );
      setPlayers(availablePlayers);
    } catch (error) {
      console.error('Error loading players:', error);
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewPlayer = async (player: Player) => {
    await loadPlayers(); // Refresh the player list
    onSelect(player);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <AnimatePresence>
        {!showCreateNew ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-cyber text-2xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                Loading players...
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={loadPlayers}
                  className="px-4 py-2 bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white rounded hover:bg-opacity-90"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {players.length > 0 ? (
                    players.map(player => (
                      <button
                        key={player.id}
                        onClick={() => onSelect(player)}
                        className="w-full p-3 flex items-center space-x-3 rounded-lg hover:bg-gray-50 dark:hover:bg-scoreboard-dark-bg transition-colors"
                      >
                        <div 
                          className="w-10 h-10 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="font-cyber text-lg text-gray-800 dark:text-gray-200">
                          {player.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                      No available players
                    </div>
                  )}
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <button
                    onClick={() => setShowCreateNew(true)}
                    className="w-full py-3 font-cyber text-center text-scoreboard-light-sky dark:text-scoreboard-dark-primary hover:bg-scoreboard-dark-primary/10 rounded transition-all"
                  >
                    Create New Player
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <PlayerManagement
            players={players}
            onSave={handleCreateNewPlayer}
            onClose={() => {
              setShowCreateNew(false);
              if (editingPlayer) {
                onClose();
              }
            }}
            editingPlayer={editingPlayer}
            onDelete={onDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PlayerSelectionModal; 
