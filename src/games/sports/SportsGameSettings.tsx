import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Team } from './SportsGameContext';

export interface GameSettings {
  timeLength: number;
  finalScore: number | null;
  homeTeam: Team;
  awayTeam: Team;
}

export interface TeamPreset {
  id: string;
  name: string;
  color: string;
  logo: string;
}

export interface Preset {
  label: string;
  value: number;
}

interface SportsGameSettingsProps {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onStart: () => void;
  isStarted: boolean;
  teamPresets: TeamPreset[];
  timePresets: Preset[];
  scorePresets: Preset[];
  sportName: string;
  defaultLogo: string;
}

export default function SportsGameSettings({
  settings,
  onSave,
  onStart,
  isStarted,
  teamPresets,
  timePresets,
  scorePresets,
  sportName,
  defaultLogo
}: SportsGameSettingsProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);
  const navigate = useNavigate();

  const handleTeamChange = (team: 'home' | 'away', preset: TeamPreset) => {
    const teamKey = `${team}Team` as keyof GameSettings;
    const currentTeam = localSettings[teamKey] as Team;
    const newSettings = {
      ...localSettings,
      [teamKey]: {
        ...currentTeam,
        id: preset.id,
        name: preset.name,
        color: preset.color
      }
    };
    setLocalSettings(newSettings);
    onSave(newSettings);
  };

  const handleTimeChange = (preset: Preset) => {
    const newSettings = {
      ...localSettings,
      timeLength: preset.value
    };
    setLocalSettings(newSettings);
    onSave(newSettings);
  };

  const handleScoreChange = (preset: Preset) => {
    const newSettings = {
      ...localSettings,
      finalScore: preset.value
    };
    setLocalSettings(newSettings);
    onSave(newSettings);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {sportName} Game Settings
        </h2>
        
        {/* Team Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Home Team */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Home Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {teamPresets.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleTeamChange('home', preset)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.homeTeam.id === preset.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Away Team */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Away Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {teamPresets.slice(6, 12).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleTeamChange('away', preset)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.awayTeam.id === preset.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Game Length</h3>
          <div className="flex space-x-4">
            {timePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleTimeChange(preset)}
                className={`px-6 py-3 rounded-lg border-2 transition-all ${
                  settings.timeLength === preset.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Score Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Target Score</h3>
          <div className="flex space-x-4">
            {scorePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleScoreChange(preset)}
                className={`px-6 py-3 rounded-lg border-2 transition-all ${
                  settings.finalScore === preset.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-end">
          <button
            onClick={onStart}
            disabled={isStarted}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
} 