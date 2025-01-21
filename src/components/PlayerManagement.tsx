import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { generateId } from '../utils';

interface PlayerManagementProps {
  players: Player[];
  onSave: (player: Player) => void;
  onClose: () => void;
  onDelete?: (player: Player) => void;
  editingPlayer?: Player | null;
}

const PLAYER_COLORS = [
  // Neons
  '#FF6B6B', // Neon Red
  '#4ECDC4', // Neon Teal
  '#45B7D1', // Neon Blue
  '#96CEB4', // Soft Jade
  '#FFD93D', // Neon Yellow
  '#FF8E3C', // Neon Orange
  '#9B59B6', // Neon Purple
  '#3498DB', // Electric Blue
  // Cyberpunk Accents
  '#00FF9F', // Matrix Green
  '#FF00FF', // Magenta
  '#7B61FF', // Violet
  '#00FFFF'  // Cyan
];

function PlayerManagement({
  players,
  onSave,
  onClose,
  onDelete,
  editingPlayer = null
}: PlayerManagementProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name);
      setSelectedColor(editingPlayer.color);
    }
  }, [editingPlayer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    // Check for duplicate names
    const isDuplicate = players.some(
      p => p.name.toLowerCase() === trimmedName.toLowerCase() && p.id !== editingPlayer?.id
    );
    if (isDuplicate) {
      setError('A player with this name already exists');
      return;
    }

    const player: Player = {
      id: editingPlayer?.id || generateId(),
      name: trimmedName,
      color: selectedColor,
      createdAt: editingPlayer?.createdAt || new Date()
    };

    onSave(player);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-cyber text-2xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
            {editingPlayer ? 'Edit Player' : 'Create Player'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-scoreboard-dark-bg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-scoreboard-dark-primary"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-4 gap-4">
              {PLAYER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-4 ring-scoreboard-dark-primary ring-offset-2 dark:ring-offset-scoreboard-dark-surface'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t dark:border-gray-700">
            {editingPlayer && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(editingPlayer)}
                className="px-4 py-2 font-cyber text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                Delete
              </button>
            )}
            <div className="flex space-x-4 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-cyber text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-scoreboard-dark-bg rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-cyber bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white rounded hover:bg-opacity-90"
              >
                {editingPlayer ? 'Save Changes' : 'Create Player'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default PlayerManagement; 
