import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import useSound from 'use-sound';
import { useYahtzeeGame } from '../../../context/YahtzeeGameContext';
import { YahtzeePlayer, YahtzeeCategory, YahtzeeScore } from '../../../types/yahtzee';
import { YAHTZEE_CATEGORIES } from '../../../config/yahtzeeConfig';

// Player Management Component
interface PlayerManagementProps {
  players: YahtzeePlayer[];
  onSave: (player: YahtzeePlayer) => void;
  onClose: () => void;
  editingPlayer?: YahtzeePlayer;
}

const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

function PlayerManagement({ players, onSave, onClose, editingPlayer }: PlayerManagementProps) {
  const [name, setName] = useState(editingPlayer?.name || '');
  const [selectedColor, setSelectedColor] = useState(editingPlayer?.color || PLAYER_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingPlayer?.id || `player-${Date.now()}`,
      name,
      color: selectedColor
    });
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
}

// Score Grid Component
interface ScoreGridProps {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
  onScoreSelect: (playerId: string, category: YahtzeeCategory, value: number) => void;
  onAddPlayer: () => void;
  onEditPlayer: (player: YahtzeePlayer) => void;
}

function ScoreGrid({
  players,
  scores,
  onScoreSelect,
  onAddPlayer,
  onEditPlayer,
}: ScoreGridProps) {
  const [selectedCell, setSelectedCell] = useState<{
    playerId: string;
    category: YahtzeeCategory;
  } | null>(null);

  const getScore = (playerId: string, category: YahtzeeCategory) => {
    return scores[playerId]?.[category] ?? 0;
  };

  const calculateUpperSubtotal = (playerId: string) => {
    return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce((total, category) => {
      return total + (scores[playerId]?.[category as YahtzeeCategory] ?? 0);
    }, 0);
  };

  const calculateLowerSubtotal = (playerId: string) => {
    return ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance']
      .reduce((total, category) => {
        return total + (scores[playerId]?.[category as YahtzeeCategory] ?? 0);
      }, 0);
  };

  const getUpperBonus = (playerId: string) => {
    const subtotal = calculateUpperSubtotal(playerId);
    return subtotal >= 63 ? 35 : 0;
  };

  const calculateTotal = (playerId: string) => {
    return calculateUpperSubtotal(playerId) + getUpperBonus(playerId) + calculateLowerSubtotal(playerId);
  };

  const getPossibleScores = (category: YahtzeeCategory) => {
    switch (category) {
      case 'threeOfAKind':
      case 'fourOfAKind':
      case 'chance':
        // Generate array of possible values from 0 to 30
        return Array.from({ length: 31 }, (_, i) => i);
      case 'fullHouse':
        return [0, 25];
      case 'smallStraight':
        return [0, 30];
      case 'largeStraight':
        return [0, 40];
      case 'yahtzee':
        return [0, 50];
      default:
        // For number categories (ones through sixes)
        if (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].includes(category)) {
          const value = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(category) + 1;
          return [0, value, value * 2, value * 3, value * 4, value * 5];
        }
        return [0];
    }
  };

  const renderScoreCell = (playerId: string, category: YahtzeeCategory) => {
    const isSelected = selectedCell?.playerId === playerId && selectedCell?.category === category;
    const currentScore = getScore(playerId, category);

    return (
      <td
        key={`${playerId}-${category}`}
        className="p-2 border dark:border-scoreboard-dark-primary text-center cursor-pointer hover:bg-scoreboard-dark-surface/10"
        onClick={() => setSelectedCell({ playerId, category })}
      >
        {isSelected ? (
          <div className="relative">
            <div className="absolute z-10 bg-white dark:bg-scoreboard-dark-surface shadow-lg rounded-lg p-2 -mt-20 max-h-48 overflow-y-auto">
              {getPossibleScores(category).map(score => (
                <div
                  key={score}
                  className="p-1 hover:bg-scoreboard-dark-primary/20 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onScoreSelect(playerId, category, score);
                    setSelectedCell(null);
                  }}
                >
                  {score === 0 ? 'Scratch' : score}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <span className="font-cyber text-gray-700 dark:text-gray-300">
            {currentScore === 0 ? '/' : currentScore}
          </span>
        )}
      </td>
    );
  };

  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="p-4 text-left font-cyber text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
              Category
            </th>
            {players.map(player => (
              <th 
                key={player.id}
                className="p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-scoreboard-dark-bg"
                onClick={() => onEditPlayer(player)}
              >
                <div className="flex flex-col items-center">
                  <div 
                    className="w-4 h-4 rounded-full mb-2"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="font-cyber text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
                    {player.name}
                  </span>
                </div>
              </th>
            ))}
            <th className="p-4">
              <button
                onClick={onAddPlayer}
                className="w-8 h-8 rounded-full bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white font-bold hover:bg-opacity-90"
              >
                +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Upper Section Header */}
          <tr className="bg-gray-100 dark:bg-scoreboard-dark-bg/50">
            <td colSpan={players.length + 2} className="p-2 font-cyber font-bold text-lg text-gray-800 dark:text-gray-100">
              Upper Section
            </td>
          </tr>

          {/* Upper Section */}
          {['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].map(category => (
            <tr key={category}>
              <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-800 dark:text-gray-100">
                      {YAHTZEE_CATEGORIES[category].name}
                    </span>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {YAHTZEE_CATEGORIES[category].description}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700 dark:text-scoreboard-dark-primary">
                    {YAHTZEE_CATEGORIES[category].maxScore} pts
                  </div>
                </div>
              </td>
              {players.map(player => renderScoreCell(player.id, category as YahtzeeCategory))}
              <td></td>
            </tr>
          ))}

          {/* Upper Section Subtotal */}
          <tr className="bg-gray-50 dark:bg-scoreboard-dark-bg">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold">
              Upper Section Subtotal
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {calculateUpperSubtotal(player.id)}
              </td>
            ))}
            <td></td>
          </tr>

          {/* Bonus Row */}
          <tr className="bg-green-50 dark:bg-green-900/20">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
              <div className="flex justify-between items-center">
                <div>
                  Bonus
                  <div className="text-xs opacity-50">Score 63+ to get bonus</div>
                </div>
                <div className="text-sm font-bold text-scoreboard-dark-primary">35 pts</div>
              </div>
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {getUpperBonus(player.id)}
              </td>
            ))}
            <td></td>
          </tr>

          {/* Upper Section Total */}
          <tr className="bg-gray-100 dark:bg-scoreboard-dark-bg font-bold">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
              Upper Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {calculateUpperSubtotal(player.id) + getUpperBonus(player.id)}
              </td>
            ))}
            <td></td>
          </tr>

          {/* Lower Section Header */}
          <tr className="bg-gray-100 dark:bg-scoreboard-dark-bg/50">
            <td colSpan={players.length + 2} className="p-2 font-cyber font-bold text-lg text-gray-800 dark:text-gray-100">
              Lower Section
            </td>
          </tr>

          {/* Lower Section */}
          {['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'].map(category => (
            <tr key={category}>
              <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-800 dark:text-gray-100">
                      {YAHTZEE_CATEGORIES[category].name}
                    </span>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {YAHTZEE_CATEGORIES[category].description}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700 dark:text-scoreboard-dark-primary">
                    {YAHTZEE_CATEGORIES[category].maxScore} pts
                  </div>
                </div>
              </td>
              {players.map(player => renderScoreCell(player.id, category as YahtzeeCategory))}
              <td></td>
            </tr>
          ))}

          {/* Lower Section Subtotal */}
          <tr className="bg-gray-50 dark:bg-scoreboard-dark-bg">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold">
              Lower Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {calculateLowerSubtotal(player.id)}
              </td>
            ))}
            <td></td>
          </tr>

          {/* Grand Total Section */}
          <tr className="bg-scoreboard-dark-primary/10 dark:bg-scoreboard-dark-primary/20">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
              Upper Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {calculateUpperSubtotal(player.id) + getUpperBonus(player.id)}
              </td>
            ))}
            <td></td>
          </tr>
          <tr className="bg-scoreboard-dark-primary/10 dark:bg-scoreboard-dark-primary/20">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
              Lower Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {calculateLowerSubtotal(player.id)}
              </td>
            ))}
            <td></td>
          </tr>
          <tr className="bg-scoreboard-dark-primary/20 dark:bg-scoreboard-dark-primary/30 font-bold text-lg">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
              Grand Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {calculateTotal(player.id)}
              </td>
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Game Summary Component
interface SummaryProps {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
}

function Summary({ players, scores }: SummaryProps) {
  const calculateUpperTotal = (playerId: string) => {
    return Object.entries(YAHTZEE_CATEGORIES)
      .filter(([_, config]) => config.section === 'upper')
      .reduce((total, [category]) => {
        const score = scores[playerId]?.[category as YahtzeeCategory] || 0;
        return total + score;
      }, 0);
  };

  const calculateLowerTotal = (playerId: string) => {
    return Object.entries(YAHTZEE_CATEGORIES)
      .filter(([_, config]) => config.section === 'lower')
      .reduce((total, [category]) => {
        const score = scores[playerId]?.[category as YahtzeeCategory] || 0;
        return total + score;
      }, 0);
  };

  const getUpperBonus = (playerId: string) => {
    const upperTotal = calculateUpperTotal(playerId);
    return upperTotal >= 63 ? 35 : 0;
  };

  const calculateGrandTotal = (playerId: string) => {
    return calculateUpperTotal(playerId) + getUpperBonus(playerId) + calculateLowerTotal(playerId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upper Section Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6"
      >
        <h3 className="font-cyber text-xl mb-4 text-gray-800 dark:text-gray-100">
          Upper Section
        </h3>
        {players.map((player, index) => (
          <motion.div
            key={`upper-${player.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-4 last:mb-0 p-3 rounded-lg border dark:border-scoreboard-dark-primary"
            style={{ backgroundColor: `${player.color}10` }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <h4 className="font-cyber text-gray-800 dark:text-gray-100">
                {player.name}
              </h4>
            </div>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{calculateUpperTotal(player.id)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Bonus:</span>
                <span>+{getUpperBonus(player.id)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t dark:border-gray-700">
                <span>Total:</span>
                <span>{calculateUpperTotal(player.id) + getUpperBonus(player.id)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lower Section Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6"
      >
        <h3 className="font-cyber text-xl mb-4 text-gray-800 dark:text-gray-100">
          Lower Section
        </h3>
        {players.map((player, index) => (
          <motion.div
            key={`lower-${player.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-4 last:mb-0 p-3 rounded-lg border dark:border-scoreboard-dark-primary"
            style={{ backgroundColor: `${player.color}10` }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <h4 className="font-cyber text-gray-800 dark:text-gray-100">
                {player.name}
              </h4>
            </div>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{calculateLowerTotal(player.id)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Grand Total Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6"
      >
        <h3 className="font-cyber text-xl mb-4 text-gray-800 dark:text-gray-100">
          Grand Total
        </h3>
        {players.map((player, index) => (
          <motion.div
            key={`total-${player.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-4 last:mb-0 p-3 rounded-lg border dark:border-scoreboard-dark-primary"
            style={{ backgroundColor: `${player.color}10` }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <h4 className="font-cyber text-gray-800 dark:text-gray-100">
                {player.name}
              </h4>
            </div>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Upper:</span>
                <span>{calculateUpperTotal(player.id) + getUpperBonus(player.id)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lower:</span>
                <span>{calculateLowerTotal(player.id)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-1 border-t dark:border-gray-700">
                <span>Total:</span>
                <span>{calculateGrandTotal(player.id)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Main Game Component
function Yahtzee() {
  const { state, dispatch } = useYahtzeeGame();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<YahtzeePlayer | undefined>();

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
    setShowPlayerModal(false);
  };

  const handleScoreSelect = (playerId: string, category: YahtzeeCategory, value: number) => {
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

      <ScoreGrid
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
      )}

      {state.gameStarted && (
        <div className="mt-8">
          <Summary players={state.players} scores={state.scores} />
        </div>
      )}
    </div>
  );
}

export default Yahtzee; 
