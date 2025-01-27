import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TIME_PRESETS, SCORE_PRESETS, TEAM_PRESETS } from './types';
import PlayerSelectionModal from '../../components/PlayerSelectionModal';
import { useNavigate } from 'react-router-dom';
import { FootballGameSettings } from './types';

interface GameSettingsProps {
  settings: FootballGameSettings;
  onSave: (settings: FootballGameSettings) => void;
  onStart: () => void;
  isStarted: boolean;
}

export default function GameSettings({
  settings,
  onSave,
  onStart,
  isStarted
}: GameSettingsProps) {
  const [localSettings, setLocalSettings] = useState<FootballGameSettings>(settings);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onStart();
  };

  const handleTeamChange = (team: 'home' | 'away', preset: typeof TEAM_PRESETS[0]) => {
    const newSettings = {
      ...localSettings,
      [`${team}Team`]: {
        ...localSettings[`${team}Team` as keyof FootballGameSettings],
        id: preset.id,
        name: preset.name,
        color: preset.color
      }
    };
    setLocalSettings(newSettings);
    onSave(newSettings);
  };

  const handleTimeChange = (preset: typeof TIME_PRESETS[0]) => {
    const newSettings = {
      homeTeam: settings.homeTeam,
      awayTeam: settings.awayTeam,
      timeLength: preset.value,
      finalScore: settings.finalScore
    } as FootballGameSettings;
    onSave(newSettings);
  };

  const handleScoreChange = (preset: typeof SCORE_PRESETS[0]) => {
    const newSettings = {
      ...localSettings,
      finalScore: preset.value
    };
    setLocalSettings(newSettings);
    onSave(newSettings);
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
        className="bg-gray-800 rounded-2xl p-8 w-full"
      >
        {/* Exit Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-colors text-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Exit Game
        </button>

        <h2 className="text-3xl font-bold text-white mb-8 text-center">Game Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-8">
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
                className="text-3xl w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Select Team</label>
                <div className="grid grid-cols-4 gap-2">
                  {TEAM_PRESETS.slice(0, 6).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleTeamChange('home', preset)}
                      className={`aspect-square rounded-lg transition-all overflow-hidden relative ${
                        localSettings.homeTeam.id === preset.id
                          ? 'ring-4 ring-white scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.color }}
                    >
                      <img 
                        src={preset.logo} 
                        alt={preset.name}
                        className="w-full h-full object-contain p-2"
                      />
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
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-gray-200">{player.name}</span>
                      </div>
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

            {/* Game Settings */}
            <div className="space-y-6 self-start">
              {/* Game Duration */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white text-center">Game Duration</h3>
                <div className="flex flex-col gap-2">
                  {TIME_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleTimeChange(preset)}
                      className={`px-4 py-2 rounded-lg text-center transition-all ${
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
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white text-center">Target Score</h3>
                <div className="flex flex-col gap-2">
                  {SCORE_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleScoreChange(preset)}
                      className={`px-4 py-2 rounded-lg text-center transition-all ${
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
                className="text-3xl w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Select Team</label>
                <div className="grid grid-cols-4 gap-2">
                  {TEAM_PRESETS.slice(6, 12).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleTeamChange('away', preset)}
                      className={`aspect-square rounded-lg transition-all overflow-hidden relative ${
                        localSettings.awayTeam.id === preset.id
                          ? 'ring-4 ring-white scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.color }}
                    >
                      <img 
                        src={preset.logo} 
                        alt={preset.name}
                        className="w-full h-full object-contain p-2"
                      />
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
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-gray-200">{player.name}</span>
                      </div>
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