import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../types';
import { getAllPlayers } from '../services/playerService';

const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFD93D', '#FF8E3C', '#9B59B6', '#3498DB',
  '#00FF9F', '#FF00FF', '#7B61FF', '#00FFFF'
];

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
  
  // Player Management State
  const [name, setName] = useState(editingPlayer?.name || '');
  const [selectedColor, setSelectedColor] = useState(editingPlayer?.color || PLAYER_COLORS[0]);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlayer) {
      setShowCreateNew(true);
      setName(editingPlayer.name);
      setSelectedColor(editingPlayer.color);
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

  const handleCreateNewPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);

    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    // Check for duplicate names
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase() && p.id !== editingPlayer?.id)) {
      setNameError('A player with this name already exists');
      return;
    }

    const player: Player = {
      id: editingPlayer?.id || `player-${Date.now()}`,
      name: name.trim(),
      color: selectedColor,
      createdAt: editingPlayer?.createdAt || new Date()
    };

    onSelect(player);
    setShowCreateNew(false);
    setName('');
    setSelectedColor(PLAYER_COLORS[0]);
  };

  const renderPlayerList = () => (
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
  );

  const renderPlayerForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-scoreboard-dark-surface rounded-xl p-6 w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-cyber text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          {editingPlayer ? 'Edit Player' : 'Create New Player'}
        </h2>
        <button
          onClick={() => {
            setShowCreateNew(false);
            if (editingPlayer) {
              onClose();
            }
          }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleCreateNewPlayer}>
        <div className="mb-4">
          <label className="block font-cyber text-sm mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-scoreboard-dark-bg"
            required
          />
          {nameError && (
            <p className="mt-1 text-sm text-red-500">{nameError}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-cyber text-sm mb-2">Color</label>
          <div className="grid grid-cols-6 gap-2">
            {PLAYER_COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full ${
                  color === selectedColor ? 'ring-2 ring-offset-2 ring-scoreboard-dark-primary' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          {editingPlayer && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(editingPlayer)}
              className="px-4 py-2 text-red-500 hover:text-red-600 font-cyber"
            >
              Delete
            </button>
          )}
          <div className="flex space-x-2 ml-auto">
            <button
              type="button"
              onClick={() => {
                setShowCreateNew(false);
                if (editingPlayer) {
                  onClose();
                }
              }}
              className="px-4 py-2 font-cyber text-gray-600 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white font-cyber rounded-lg hover:bg-opacity-90"
            >
              {editingPlayer ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {showCreateNew ? renderPlayerForm() : renderPlayerList()}
      </AnimatePresence>
    </div>
  );
}

export default PlayerSelectionModal; 
