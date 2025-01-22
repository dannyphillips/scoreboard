import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBasketballGame } from './BasketballContext';
import { GAME_MODES, SCORING_ACTIONS } from './basketballConfig';
import { Team, GameMode, ScoringAction, BasketballPlayer } from '../../types/basketball';
import PlayerSelectionModal from '../../components/PlayerSelectionModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

function formatTime(seconds: number | null): string {
  if (seconds === null) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function Scoreboard() {
  const { state } = useBasketballGame();
  const gameMode = GAME_MODES[state.gameMode];

  return (
    <div className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-3 gap-4">
        {/* Home Team */}
        <div className="text-center">
          <h2 className="font-cyber text-2xl text-black dark:text-white mb-2">{state.homeTeam.name}</h2>
          <div className="text-6xl font-cyber font-bold text-scoreboard-light-sky dark:text-scoreboard-dark-primary">
            {state.homeTeam.score}
          </div>
          <div className="mt-2 text-sm">
            <span className="font-cyber text-gray-600 dark:text-gray-400">
              Timeouts: {state.homeTeam.timeouts}
            </span>
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center flex flex-col justify-between">
          <div className="text-4xl font-cyber font-bold text-black dark:text-white mb-2">
            {formatTime(state.timeRemaining)}
          </div>
          <div className="text-lg font-cyber text-gray-600 dark:text-gray-400">
            {gameMode.name}
          </div>
          {state.shotClock !== null && (
            <div className="text-2xl font-cyber text-red-500 dark:text-red-400">
              {state.shotClock}
            </div>
          )}
          <div className="text-lg font-cyber text-gray-600 dark:text-gray-400">
            Quarter {state.quarter}
          </div>
        </div>

        {/* Away Team */}
        <div className="text-center">
          <h2 className="font-cyber text-2xl text-black dark:text-white mb-2">{state.awayTeam.name}</h2>
          <div className="text-6xl font-cyber font-bold text-scoreboard-light-sky dark:text-scoreboard-dark-primary">
            {state.awayTeam.score}
          </div>
          <div className="mt-2 text-sm">
            <span className="font-cyber text-gray-600 dark:text-gray-400">
              Timeouts: {state.awayTeam.timeouts}
            </span>
          </div>
        </div>
      </div>

      {/* Possession Indicator */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${state.possession === 'HOME' ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="font-cyber text-sm text-gray-600 dark:text-gray-400">Possession</span>
          <div className={`w-4 h-4 rounded-full ${state.possession === 'AWAY' ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>
    </div>
  );
}

function GameControls() {
  const { state, dispatch } = useBasketballGame();
  const [selectedTeam, setSelectedTeam] = useState<Team>('HOME');

  const handleAction = (action: ScoringAction, playerId: string) => {
    dispatch({
      type: 'RECORD_ACTION',
      event: {
        action,
        playerId,
        team: selectedTeam,
      },
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {/* Team Selection */}
      <div className="col-span-2 flex justify-center space-x-4 mb-4">
        <button
          className={`px-6 py-3 rounded-lg font-cyber ${
            selectedTeam === 'HOME'
              ? 'bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white'
              : 'border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setSelectedTeam('HOME')}
        >
          Home Team
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-cyber ${
            selectedTeam === 'AWAY'
              ? 'bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white'
              : 'border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setSelectedTeam('AWAY')}
        >
          Away Team
        </button>
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 grid grid-cols-4 gap-4">
        {Object.entries(SCORING_ACTIONS).map(([action, details]) => {
          const team = selectedTeam === 'HOME' ? state.homeTeam : state.awayTeam;
          const activePlayers = team.players.filter(p => p.isActive);

          return (
            <div key={action} className="flex flex-col items-center">
              <button
                className={`w-full px-4 py-3 rounded-lg font-cyber text-white ${details.color} hover:opacity-90`}
                onClick={() => {
                  if (activePlayers.length > 0) {
                    handleAction(action as ScoringAction, activePlayers[0].id);
                  }
                }}
                disabled={activePlayers.length === 0}
              >
                <span className="material-icons mb-1">{details.icon}</span>
                <div className="text-sm">{details.name}</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Game Control Buttons */}
      <div className="col-span-2 flex justify-center space-x-4 mt-4">
        <button
          className="px-6 py-3 rounded-lg font-cyber bg-amber-500 text-white hover:bg-opacity-90"
          onClick={() => dispatch({ type: 'USE_TIMEOUT', team: selectedTeam })}
          disabled={
            (selectedTeam === 'HOME' ? state.homeTeam.timeouts : state.awayTeam.timeouts) === 0
          }
        >
          Call Timeout
        </button>
        <button
          className="px-6 py-3 rounded-lg font-cyber bg-indigo-500 text-white hover:bg-opacity-90"
          onClick={() => dispatch({ type: 'CHANGE_POSSESSION' })}
        >
          Change Possession
        </button>
        {state.gamePaused ? (
          <button
            className="px-6 py-3 rounded-lg font-cyber bg-green-500 text-white hover:bg-opacity-90"
            onClick={() => dispatch({ type: 'RESUME_GAME' })}
          >
            Resume Game
          </button>
        ) : (
          <button
            className="px-6 py-3 rounded-lg font-cyber bg-red-500 text-white hover:bg-opacity-90"
            onClick={() => dispatch({ type: 'PAUSE_GAME' })}
          >
            Pause Game
          </button>
        )}
      </div>
    </div>
  );
}

function TeamRoster({ team, onEditPlayer }: { team: Team; onEditPlayer: (player: BasketballPlayer) => void }) {
  const { state } = useBasketballGame();
  const teamData = team === 'HOME' ? state.homeTeam : state.awayTeam;

  return (
    <div className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6">
      <h3 className="font-cyber text-xl text-black dark:text-white mb-4">{teamData.name} Roster</h3>
      <div className="space-y-4">
        {teamData.players.map(player => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-scoreboard-dark-bg rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <span className="font-cyber text-black dark:text-white">
                {player.name} {player.number && `#${player.number}`}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-cyber">
                <span className="text-gray-600 dark:text-gray-400">PTS: </span>
                <span className="text-black dark:text-white">{player.stats.points}</span>
              </div>
              <button
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-scoreboard-dark-primary"
                onClick={() => onEditPlayer(player)}
              >
                <span className="material-icons">edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Basketball() {
  const { state, dispatch } = useBasketballGame();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<BasketballPlayer | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team>('HOME');

  const handleAddPlayer = (team: Team) => {
    setSelectedTeam(team);
    setEditingPlayer(null);
    setShowPlayerModal(true);
  };

  const handleEditPlayer = (player: BasketballPlayer, team: Team) => {
    setSelectedTeam(team);
    setEditingPlayer(player);
    setShowPlayerModal(true);
  };

  const handlePlayerSelect = (player: BasketballPlayer) => {
    if (editingPlayer) {
      dispatch({
        type: 'UPDATE_PLAYER',
        team: selectedTeam,
        player: { ...player, id: editingPlayer.id },
      });
    } else {
      dispatch({
        type: 'ADD_PLAYER',
        team: selectedTeam,
        player,
      });
    }
    setShowPlayerModal(false);
    setEditingPlayer(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="font-display dark:font-cyber text-4xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          Basketball Scoreboard
        </h1>
        <div className="flex items-center space-x-4">
          {!state.gameStarted && (
            <select
              className="px-4 py-2 rounded-lg font-cyber bg-white dark:bg-scoreboard-dark-surface text-black dark:text-white border-2 border-gray-300 dark:border-gray-600"
              value={state.gameMode}
              onChange={(e) => dispatch({ type: 'START_GAME', gameMode: e.target.value as GameMode })}
            >
              {Object.entries(GAME_MODES).map(([mode, details]) => (
                <option key={mode} value={mode}>
                  {details.name}
                </option>
              ))}
            </select>
          )}
          {state.gameStarted && (
            <button
              onClick={() => dispatch({ type: 'RESET_GAME' })}
              className="px-6 py-3 font-cyber border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-500/10"
            >
              Reset Game
            </button>
          )}
        </div>
      </div>

      {/* Scoreboard */}
      <Scoreboard />

      {/* Game Controls */}
      {state.gameStarted && <GameControls />}

      {/* Team Management */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-cyber text-2xl text-black dark:text-white">Home Team</h2>
            <button
              onClick={() => handleAddPlayer('HOME')}
              className="p-2 rounded-full bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white"
            >
              <span className="material-icons">add</span>
            </button>
          </div>
          <TeamRoster
            team="HOME"
            onEditPlayer={(player) => handleEditPlayer(player, 'HOME')}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-cyber text-2xl text-black dark:text-white">Away Team</h2>
            <button
              onClick={() => handleAddPlayer('AWAY')}
              className="p-2 rounded-full bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white"
            >
              <span className="material-icons">add</span>
            </button>
          </div>
          <TeamRoster
            team="AWAY"
            onEditPlayer={(player) => handleEditPlayer(player, 'AWAY')}
          />
        </div>
      </div>

      {/* Modals */}
      {showPlayerModal && (
        <PlayerSelectionModal
          onSelect={handlePlayerSelect}
          onClose={() => {
            setShowPlayerModal(false);
            setEditingPlayer(null);
          }}
          excludePlayerIds={
            editingPlayer
              ? state.homeTeam.players
                  .concat(state.awayTeam.players)
                  .filter(p => p.id !== editingPlayer.id)
                  .map(p => p.id)
              : state.homeTeam.players.concat(state.awayTeam.players).map(p => p.id)
          }
          title={editingPlayer ? 'Edit Player' : 'Add Player'}
          editingPlayer={editingPlayer}
        />
      )}
    </div>
  );
}

export default Basketball; 
