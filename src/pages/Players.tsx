import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { getAllPlayers, deletePlayer, createPlayer, updatePlayer } from '../services/playerService';
import PlayerManagement from '../components/PlayerManagement';
import DeleteConfirmationModal from '../components/shared/DeleteConfirmationModal';

function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const allPlayers = await getAllPlayers();
      setPlayers(allPlayers);
      setError(null);
    } catch (error) {
      console.error('Error loading players:', error);
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setShowPlayerModal(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setShowPlayerModal(true);
  };

  const handleSavePlayer = async (player: Player) => {
    try {
      if (editingPlayer) {
        await updatePlayer(player);
      } else {
        await createPlayer(player);
      }
      await loadPlayers();
      setShowPlayerModal(false);
      setEditingPlayer(null);
    } catch (error) {
      console.error('Error saving player:', error);
      setError('Failed to save player');
    }
  };

  const handleDeletePlayer = (player: Player) => {
    setPlayerToDelete(player);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePlayer = async () => {
    if (playerToDelete) {
      try {
        await deletePlayer(playerToDelete.id);
        await loadPlayers();
        setShowDeleteConfirmation(false);
        setPlayerToDelete(null);
      } catch (error) {
        console.error('Error deleting player:', error);
        setError('Failed to delete player');
      }
    }
  };

  const renderPlayerCard = (player: Player) => (
    <motion.div
      key={player.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div 
        className="h-24 w-full transition-all duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${player.color}40, ${player.color}20)`,
          borderBottom: `4px solid ${player.color}`
        }}
      >
        <div className="h-full w-full flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-full border-4 border-white dark:border-scoreboard-dark-surface shadow-lg transform group-hover:scale-110 transition-all duration-300"
              style={{ backgroundColor: player.color }}
            />
            <div>
              <h2 className="text-2xl font-cyber text-gray-800 dark:text-gray-200">
                {player.name}
              </h2>
              {player.createdAt && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Joined {new Date(player.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => handleEditPlayer(player)}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-scoreboard-dark-bg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Games Played</div>
            <div className="text-xl font-cyber text-scoreboard-light-tree dark:text-scoreboard-dark-primary">0</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-scoreboard-dark-bg">
            <div className="text-sm text-gray-600 dark:text-gray-400">High Score</div>
            <div className="text-xl font-cyber text-scoreboard-light-tree dark:text-scoreboard-dark-primary">-</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            to={`/players/${player.id}`}
            className="inline-flex items-center space-x-2 text-scoreboard-light-sky dark:text-scoreboard-dark-primary hover:underline group"
          >
            <span>View Stats</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <button
            onClick={() => handleDeletePlayer(player)}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 dark:text-gray-400">Loading players...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-cyber text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          Players
        </h1>
        <button
          onClick={handleAddPlayer}
          className="px-4 py-2 font-cyber bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white rounded-lg hover:bg-opacity-90"
        >
          Add Player
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map(renderPlayerCard)}
      </div>

      {showPlayerModal && (
        <PlayerManagement
          players={players}
          onSave={handleSavePlayer}
          onClose={() => {
            setShowPlayerModal(false);
            setEditingPlayer(null);
          }}
          onDelete={handleDeletePlayer}
          editingPlayer={editingPlayer}
        />
      )}

      {showDeleteConfirmation && playerToDelete && (
        <DeleteConfirmationModal
          title="Delete Player"
          message={`Are you sure you want to delete ${playerToDelete.name}? This action cannot be undone.`}
          onConfirm={confirmDeletePlayer}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setPlayerToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default Players; 
