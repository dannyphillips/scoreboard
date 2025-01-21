import React, { useState } from 'react';
import { YahtzeePlayer } from '../types/yahtzee';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerManagementProps {
  players: YahtzeePlayer[];
  onSave: (player: YahtzeePlayer) => void;
  onClose: () => void;
  editingPlayer?: YahtzeePlayer;
}

const PLAYER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEEAD', // Yellow
  '#D4A5A5', // Pink
  '#9B59B6', // Purple
  '#3498DB'  // Light Blue
];

const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  onSave,
  onClose,
  editingPlayer
}) => {
  const [name, setName] = useState(editingPlayer?.name || '');
  const [selectedColor, setSelectedColor] = useState(editingPlayer?.color || PLAYER_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const player: YahtzeePlayer = {
      id: editingPlayer?.id || `player-${Date.now()}`,
      name,
      color: selectedColor
    };
    onSave(player);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-scoreboard-dark-surface rounded-xl p-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-cyber mb-4 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
            {editingPlayer ? 'Edit Player' : 'Add Player'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-cyber text-sm mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-scoreboard-dark-bg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block font-cyber text-sm mb-2">Color</label>
              <div className="grid grid-cols-4 gap-2">
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

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-cyber text-gray-600 dark:text-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white font-cyber rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PlayerManagement; 
