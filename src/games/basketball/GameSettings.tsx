import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BasketballGameSettings, BasketballTeam, TIME_PRESETS, SCORE_PRESETS, TEAM_COLORS } from './types';
import { generateId } from '../../utils';
import PlayerSelectionModal from '../../components/PlayerSelectionModal';

interface GameSettingsProps {
  settings: BasketballGameSettings;
  onSave: (settings: BasketballGameSettings) => void;
  onStart: () => void;
  isStarted: boolean;
}

export default function GameSettings({ settings, onSave, onStart, isStarted }: GameSettingsProps) {
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  const handleTimeSelect = (seconds: number) => {
    onSave({
      ...settings,
      timeLength: seconds
    });
  };

  const handleScoreSelect = (score: number | null) => {
    onSave({
      ...settings,
      finalScore: score
    });
  };

  const handleTeamColorChange = (team: 'home' | 'away', color: string) => {
    onSave({
      ...settings,
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...settings[team === 'home' ? 'homeTeam' : 'awayTeam'],
        color
      }
    });
  };

  const handleAddPlayer = (team: 'home' | 'away') => {
    setSelectedTeam(team);
    setShowPlayerModal(true);
  };

  const handlePlayerSelect = (player: { id: string; name: string; color: string }) => {
    const team = selectedTeam === 'home' ? 'homeTeam' : 'awayTeam';
    onSave({
      ...settings,
      [team]: {
        ...settings[team],
        players: [...settings[team].players, player]
      }
    });
    setShowPlayerModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-4xl w-full mx-4"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {isStarted ? 'Game Settings' : 'New Game'}
        </h2>

        {/* Time Settings */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Game Length</h3>
          <div className="flex gap-4">
            {TIME_PRESETS.map(preset => (
              <button
                key={preset.value}
                onClick={() => handleTimeSelect(preset.value)}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  settings.timeLength === preset.value
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Score Settings */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Win Score</h3>
          <div className="flex gap-4">
            {SCORE_PRESETS.map(preset => (
              <button
                key={preset.value}
                onClick={() => handleScoreSelect(preset.value)}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  settings.finalScore === preset.value
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => handleScoreSelect(null)}
              className={`px-6 py-3 rounded-lg font-semibold ${
                settings.finalScore === null
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              No Limit
            </button>
          </div>
        </div>

        {/* Team Settings */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Home Team */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Home Team</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TEAM_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => handleTeamColorChange('home', color.value)}
                      className={`w-full h-12 rounded-lg relative ${
                        settings.homeTeam.color === color.value 
                          ? 'ring-4 ring-white dark:ring-white ring-offset-2 ring-offset-gray-800 scale-110 z-10' 
                          : 'hover:scale-105 transform transition-transform'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    >
                      {settings.homeTeam.color === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Players
                  </label>
                  <button
                    onClick={() => handleAddPlayer('home')}
                    className="text-cyan-500 hover:text-cyan-600"
                  >
                    + Add Player
                  </button>
                </div>
                <div className="space-y-2">
                  {settings.homeTeam.players.map(player => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-gray-800 dark:text-gray-200">{player.name}</span>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Away Team</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TEAM_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => handleTeamColorChange('away', color.value)}
                      className={`w-full h-12 rounded-lg relative ${
                        settings.awayTeam.color === color.value 
                          ? 'ring-4 ring-white dark:ring-white ring-offset-2 ring-offset-gray-800 scale-110 z-10' 
                          : 'hover:scale-105 transform transition-transform'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    >
                      {settings.awayTeam.color === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Players
                  </label>
                  <button
                    onClick={() => handleAddPlayer('away')}
                    className="text-cyan-500 hover:text-cyan-600"
                  >
                    + Add Player
                  </button>
                </div>
                <div className="space-y-2">
                  {settings.awayTeam.players.map(player => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-gray-800 dark:text-gray-200">{player.name}</span>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onStart}
            className="px-8 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600"
          >
            {isStarted ? 'Resume Game' : 'Start Game'}
          </button>
        </div>
      </motion.div>

      {/* Player Selection Modal */}
      {showPlayerModal && (
        <PlayerSelectionModal
          onSelect={handlePlayerSelect}
          onClose={() => setShowPlayerModal(false)}
          excludePlayerIds={[
            ...settings.homeTeam.players.map(p => p.id),
            ...settings.awayTeam.players.map(p => p.id)
          ]}
          title="Add Player"
        />
      )}
    </div>
  );
} 
