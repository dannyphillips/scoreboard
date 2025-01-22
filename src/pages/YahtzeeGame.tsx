import React, { useState } from 'react';
import YahtzeeScoreGrid from '../components/YahtzeeScoreGrid';
import PlayerManagement from '../components/PlayerManagement';
import { useYahtzeeGame } from '../games/yahtzee/YahtzeeContext';
import { YahtzeePlayer, YahtzeeCategory } from '../types/yahtzee';
import GameSummary from '../components/GameSummary';
import YahtzeeCelebration from '../components/YahtzeeCelebration';

function YahtzeeGame() {
  const { state, dispatch } = useYahtzeeGame();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<YahtzeePlayer | undefined>();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingPlayer, setCelebratingPlayer] = useState<YahtzeePlayer | null>(null);

  const handleAddPlayer = () => {
    setEditingPlayer(undefined);
    setShowPlayerModal(true);
  };

  const handleEditPlayer = (player: YahtzeePlayer) => {
    setEditingPlayer(player);
    setShowPlayerModal(true);
  };

  const handleSavePlayer = (player: YahtzeePlayer) => {
    if (editingPlayer) {
      dispatch({ type: 'EDIT_PLAYER', player });
    } else {
      dispatch({ type: 'ADD_PLAYER', player });
    }
  };

  const handleScoreSelect = (playerId: string, category: YahtzeeCategory, value: number) => {
    if (category === 'yahtzee' && value === 50) {
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        setCelebratingPlayer(player);
        setShowCelebration(true);
      }
    }
    
    dispatch({
      type: 'ADD_SCORE',
      score: { playerId, category, value }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="font-display dark:font-cyber text-4xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          Yahtzee Scorecard
        </h1>
        {!state.gameStarted && state.players.length >= 2 && (
          <button
            onClick={() => dispatch({ type: 'START_GAME' })}
            className="px-6 py-3 font-cyber bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Start Game
          </button>
        )}
      </div>

      <YahtzeeScoreGrid
        players={state.players}
        scores={state.scores}
        onScoreSelect={handleScoreSelect}
        onAddPlayer={handleAddPlayer}
        onEditPlayer={handleEditPlayer}
      />

      {showPlayerModal && (
        <PlayerManagement
          players={state.players}
          onSave={handleSavePlayer}
          onClose={() => setShowPlayerModal(false)}
          editingPlayer={editingPlayer}
        />
      )}

      {state.gameStarted && (
        <>
          <div className="mt-4 p-4 bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg">
            <h2 className="font-cyber text-xl mb-2 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
              Current Turn
            </h2>
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: state.players[state.currentTurn]?.color }}
              />
              <span className="font-cyber">
                {state.players[state.currentTurn]?.name}'s turn
              </span>
            </div>
          </div>

          <div className="mt-8">
            <GameSummary players={state.players} scores={state.scores} />
          </div>
        </>
      )}

      {showCelebration && celebratingPlayer && (
        <YahtzeeCelebration
          player={celebratingPlayer}
          onComplete={() => {
            setShowCelebration(false);
            setCelebratingPlayer(null);
          }}
        />
      )}
    </div>
  );
}

export default YahtzeeGame; 
