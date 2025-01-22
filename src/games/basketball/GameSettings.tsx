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

export default function GameSettings({
  settings,
  onSave,
  onStart,
  isStarted
}: GameSettingsProps) {
  const [localSettings, setLocalSettings] = useState<BasketballGameSettings>(settings);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onStart();
  };

  const handleTimeSelect = (seconds: number) => {
    setLocalSettings(prev => ({
      ...prev,
      timeLength: seconds
    }));
  };

  const handleScoreSelect = (score: number | null) => {
    setLocalSettings(prev => ({
      ...prev,
      finalScore: score
    }));
  };

  const handleTeamColorChange = (team: 'home' | 'away', color: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...prev[team === 'home' ? 'homeTeam' : 'awayTeam'],
        color
      }
    }));
  };

  const handleAddPlayer = (team: 'home' | 'away') => {
    setSelectedTeam(team);
    setShowPlayerModal(true);
  };

  const handlePlayerSelect = (player: { id: string; name: string; color: string }) => {
    const team = selectedTeam === 'home' ? 'homeTeam' : 'awayTeam';
    setLocalSettings(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: [...prev[team].players, player]
      }
    }));
    setShowPlayerModal(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Game Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Game Duration */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Game Duration</h3>
            <div className="grid grid-cols-3 gap-4">
              {TIME_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleTimeSelect(preset.value)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    localSettings.timeLength === preset.value
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Score */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Target Score</h3>
            <div className="grid grid-cols-3 gap-4">
              {SCORE_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleScoreSelect(preset.value)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    localSettings.finalScore === preset.value
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Team Settings */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Home Team */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Home Team</h3>
              <input
                type="text"
                value={localSettings.homeTeam.name}
                onChange={e => setLocalSettings(prev => ({
                  ...prev,
                  homeTeam: { ...prev.homeTeam, name: e.target.value }
                }))}
                placeholder="Home Team Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Team Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {TEAM_COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleTeamColorChange('home', color.value)}
                      className={`h-12 rounded-lg transition-all ${
                        localSettings.homeTeam.color === color.value
                          ? 'ring-4 ring-white scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {localSettings.homeTeam.color === color.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {/* Players Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-300">Players</label>
                  <button
                    type="button"
                    onClick={() => handleAddPlayer('home')}
                    className="text-cyan-500 hover:text-cyan-400 text-sm"
                  >
                    + Add Player
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {localSettings.homeTeam.players.map(player => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-200">{player.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSettings(prev => ({
                            ...prev,
                            homeTeam: {
                              ...prev.homeTeam,
                              players: prev.homeTeam.players.filter(p => p.id !== player.id)
                            }
                          }));
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Away Team</h3>
              <input
                type="text"
                value={localSettings.awayTeam.name}
                onChange={e => setLocalSettings(prev => ({
                  ...prev,
                  awayTeam: { ...prev.awayTeam, name: e.target.value }
                }))}
                placeholder="Away Team Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Team Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {TEAM_COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleTeamColorChange('away', color.value)}
                      className={`h-12 rounded-lg transition-all ${
                        localSettings.awayTeam.color === color.value
                          ? 'ring-4 ring-white scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {localSettings.awayTeam.color === color.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {/* Players Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-300">Players</label>
                  <button
                    type="button"
                    onClick={() => handleAddPlayer('away')}
                    className="text-cyan-500 hover:text-cyan-400 text-sm"
                  >
                    + Add Player
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {localSettings.awayTeam.players.map(player => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-200">{player.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSettings(prev => ({
                            ...prev,
                            awayTeam: {
                              ...prev.awayTeam,
                              players: prev.awayTeam.players.filter(p => p.id !== player.id)
                            }
                          }));
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="px-8 py-4 bg-cyan-500 text-white text-xl font-semibold rounded-xl hover:bg-cyan-600 transition-colors"
            >
              Start Game
            </button>
          </div>
        </form>
      </motion.div>

      {/* Player Selection Modal */}
      {showPlayerModal && (
        <PlayerSelectionModal
          onSelect={handlePlayerSelect}
          onClose={() => setShowPlayerModal(false)}
          excludePlayerIds={[
            ...localSettings.homeTeam.players.map(p => p.id),
            ...localSettings.awayTeam.players.map(p => p.id)
          ]}
          title="Add Player"
        />
      )}
    </div>
  );
} 
