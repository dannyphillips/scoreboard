import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useYahtzeeGame } from './YahtzeeContext';
import { YahtzeePlayer, YahtzeeCategory } from '../../types/yahtzee';
import { YAHTZEE_CATEGORIES } from './yahtzeeConfig';
import PlayerSelectionModal from '../../components/PlayerSelectionModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

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
  onScoreSelect: (playerId: string, category: YahtzeeCategory, value: number | null) => void;
  onAddPlayer: () => void;
  onEditPlayer: (player: YahtzeePlayer) => void;
}

function TurnsTracker({ 
  players, 
  currentTurn,
  scores 
}: { 
  players: YahtzeePlayer[]; 
  currentTurn: number;
  scores: Record<string, Record<YahtzeeCategory, number>>;
}) {
  const totalTurns = 13; // 13 categories to fill
  const turnsPerPlayer = players.map(player => {
    const filledCategories = Object.values(scores[player.id] || {}).filter(score => score !== null).length;
    return {
      player,
      completed: filledCategories,
      remaining: totalTurns - filledCategories
    };
  });

  return (
    <div className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-4 mb-4">
      <h3 className="font-cyber text-lg mb-2 text-black dark:text-white">Turns Remaining</h3>
      <div className="space-y-2">
        {turnsPerPlayer.map(({ player, completed, remaining }) => (
          <div key={player.id} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: player.color }}
            />
            <span className="font-cyber text-sm text-black dark:text-white">
              {player.name}: {remaining} turns
            </span>
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary rounded-full transition-all duration-500"
                style={{ width: `${(completed / totalTurns) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
    return scores[playerId]?.[category] ?? null;
  };

  const calculateUpperSubtotal = (playerId: string) => {
    return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].reduce((total, category) => {
      const score = scores[playerId]?.[category as YahtzeeCategory] ?? 0;
      return total + score;
    }, 0);
  };

  const calculateLowerSubtotal = (playerId: string) => {
    return ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance']
      .reduce((total, category) => {
        const score = scores[playerId]?.[category as YahtzeeCategory] ?? 0;
        return total + score;
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
        // Generate array of possible values from 0 to 30, ensuring 0 is first for clearing
        return [0, ...Array.from({ length: 30 }, (_, i) => i + 1)];
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
    const hasScore = currentScore !== null;
    const isScratched = currentScore === 0;

    return (
      <td
        key={`${playerId}-${category}`}
        className={`
          p-3 border dark:border-scoreboard-dark-primary text-center cursor-pointer transition-all
          ${hasScore ? 'bg-gray-200 dark:bg-scoreboard-dark-bg/70' : 'hover:bg-scoreboard-dark-surface/10'}
          text-lg font-cyber
        `}
        onClick={() => setSelectedCell({ playerId, category })}
      >
        {isSelected ? (
          <div className="relative">
            <div className="absolute z-10 bg-white dark:bg-scoreboard-dark-surface shadow-lg rounded-lg p-2 -translate-x-1/2 left-1/2 min-w-[100px]">
              <div
                className="p-2 hover:bg-scoreboard-dark-primary/20 cursor-pointer border-b dark:border-gray-700 text-black dark:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onScoreSelect(playerId, category, 0);
                  setSelectedCell(null);
                }}
              >
                Scratch
              </div>
              {currentScore !== null && (
                <div
                  className="p-2 hover:bg-scoreboard-dark-primary/20 cursor-pointer border-b dark:border-gray-700 text-black dark:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onScoreSelect(playerId, category, null);
                    setSelectedCell(null);
                  }}
                >
                  Clear Score
                </div>
              )}
              {getPossibleScores(category)
                .filter(score => score !== 0)
                .map(score => (
                  <div
                    key={score}
                    className="p-2 hover:bg-scoreboard-dark-primary/20 cursor-pointer text-black dark:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onScoreSelect(playerId, category, score);
                      setSelectedCell(null);
                    }}
                  >
                    {score}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <span className={`
            text-xl font-cyber
            ${isScratched ? 'text-gray-400 dark:text-gray-600' : 'text-black dark:text-white'}
          `}>
            {isScratched ? '/' : currentScore ?? '0'}
          </span>
        )}
      </td>
    );
  };

  // Add function to calculate total turns remaining
  const calculateTurnsRemaining = () => {
    const totalCategories = 13; // Total number of categories
    const filledCategories = Object.values(scores).reduce((total, playerScores) => {
      return total + Object.values(playerScores).filter(score => score !== null).length;
    }, 0);
    return totalCategories * players.length - filledCategories;
  };

  return (
    <div className="overflow-x-auto mb-8 max-h-[calc(100vh-20rem)] overflow-y-auto">
      <table className="w-full bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg text-lg">
        <thead className="sticky top-0 bg-white dark:bg-scoreboard-dark-surface z-10">
          <tr className="border-b-2 dark:border-gray-700">
            <th className="p-4 text-left font-cyber text-xl text-black dark:text-white min-w-[200px]">
              <div className="flex justify-between items-center">
                <span>Category</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-cyber text-gray-600 dark:text-gray-400">
                    {calculateTurnsRemaining()} turns left
                  </span>
                  <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary rounded-full transition-all duration-500"
                      style={{ 
                        width: `${100 - (calculateTurnsRemaining() / (13 * players.length)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </th>
            {players.map(player => (
              <th 
                key={player.id}
                className="p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-scoreboard-dark-bg min-w-[120px]"
                onClick={() => onEditPlayer(player)}
              >
                <div className="flex flex-col items-center group">
                  <div 
                    className="w-6 h-6 rounded-full mb-2 group-hover:ring-2 group-hover:ring-scoreboard-dark-primary group-hover:ring-offset-2 transition-all shadow-lg"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="font-cyber text-lg text-black dark:text-white group-hover:text-scoreboard-dark-primary">
                    {player.name}
                  </span>
                </div>
              </th>
            ))}
            <th className="p-4 w-16">
              <button
                onClick={onAddPlayer}
                className="w-10 h-10 rounded-full bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white font-bold text-xl hover:bg-opacity-90 shadow-lg"
              >
                +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Upper Section Header */}
          <tr className="bg-gray-100 dark:bg-scoreboard-dark-bg/50">
            <td colSpan={players.length + 1} className="p-2 font-cyber font-bold text-lg text-gray-800 dark:text-gray-100">
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
            </tr>
          ))}

          {/* Upper Section Subtotal */}
          <tr className="bg-gray-50 dark:bg-scoreboard-dark-bg/50">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold text-black dark:text-white">
              Upper Section Subtotal
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber text-black dark:text-white">
                {calculateUpperSubtotal(player.id)}
              </td>
            ))}
          </tr>

          {/* Bonus Row */}
          <tr className="bg-green-50 dark:bg-green-900/30">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber text-black dark:text-white">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">Bonus</span>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Score 63+ to get 35 points bonus
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">35 pts</div>
              </div>
            </td>
            {players.map(player => {
              const upperTotal = calculateUpperSubtotal(player.id);
              const pointsNeeded = Math.max(0, 63 - upperTotal);
              const hasBonus = upperTotal >= 63;
              
              return (
                <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                  {hasBonus ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">35</span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {pointsNeeded} needed
                    </span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Upper Section Total */}
          <tr className="bg-gray-100 dark:bg-scoreboard-dark-bg/70">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold text-black dark:text-white">
              Upper Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber font-bold text-black dark:text-white">
                {calculateUpperSubtotal(player.id) + getUpperBonus(player.id)}
              </td>
            ))}
          </tr>

          {/* Lower Section Header */}
          <tr className="bg-gray-100 dark:bg-scoreboard-dark-bg/50">
            <td colSpan={players.length + 1} className="p-2 font-cyber font-bold text-lg text-gray-800 dark:text-gray-100">
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
            </tr>
          ))}

          {/* Lower Section Subtotal */}
          <tr className="bg-gray-50 dark:bg-scoreboard-dark-bg/50">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold text-black dark:text-white">
              Lower Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber font-bold text-black dark:text-white">
                {calculateLowerSubtotal(player.id)}
              </td>
            ))}
          </tr>

          {/* Grand Total Section */}
          <tr className="bg-scoreboard-dark-primary/10 dark:bg-scoreboard-dark-primary/30">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold text-black dark:text-white">
              Upper Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber font-bold text-black dark:text-white">
                {calculateUpperSubtotal(player.id) + getUpperBonus(player.id)}
              </td>
            ))}
          </tr>
          <tr className="bg-scoreboard-dark-primary/10 dark:bg-scoreboard-dark-primary/30">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold text-black dark:text-white">
              Lower Section Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber font-bold text-black dark:text-white">
                {calculateLowerSubtotal(player.id)}
              </td>
            ))}
          </tr>
          <tr className="bg-scoreboard-dark-primary/20 dark:bg-scoreboard-dark-primary/50 font-bold text-lg">
            <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber font-bold text-black dark:text-white">
              Grand Total
            </td>
            {players.map(player => (
              <td key={player.id} className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber font-bold text-black dark:text-white">
                {calculateTotal(player.id)}
              </td>
            ))}
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
  const [editingPlayer, setEditingPlayer] = useState<YahtzeePlayer | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<YahtzeePlayer | null>(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Autosave whenever state changes
  useEffect(() => {
    if (state.gameStarted) {
      const gameState = {
        players: state.players,
        scores: state.scores,
        currentTurn: state.currentTurn,
        gameStarted: state.gameStarted,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('yahtzeeGameState', JSON.stringify(gameState));
    }
  }, [state]);

  // Load saved game on component mount
  useEffect(() => {
    const savedGame = localStorage.getItem('yahtzeeGameState');
    if (savedGame) {
      try {
        const gameState = JSON.parse(savedGame);
        dispatch({ type: 'LOAD_GAME', state: gameState });
      } catch (error) {
        console.error('Error loading saved game:', error);
        localStorage.removeItem('yahtzeeGameState');
      }
    }
  }, []);

  const handleResetGame = () => {
    setShowResetConfirmation(true);
  };

  const confirmResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    localStorage.removeItem('yahtzeeGameState');
    setShowResetConfirmation(false);
  };

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setShowPlayerModal(true);
  };

  const handleEditPlayer = (player: YahtzeePlayer) => {
    setEditingPlayer(player);
    setShowPlayerModal(true);
  };

  const handlePlayerSelect = (player: YahtzeePlayer) => {
    if (editingPlayer) {
      dispatch({ type: 'UPDATE_PLAYER', player: { ...player, id: editingPlayer.id } });
    } else {
      dispatch({ type: 'ADD_PLAYER', player });
    }
    setShowPlayerModal(false);
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (player: YahtzeePlayer) => {
    setPlayerToDelete(player);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePlayer = () => {
    if (playerToDelete) {
      dispatch({ type: 'REMOVE_PLAYER', playerId: playerToDelete.id });
      setShowDeleteConfirmation(false);
      setPlayerToDelete(null);
      setShowPlayerModal(false);
    }
  };

  const handleScoreSelect = (playerId: string, category: YahtzeeCategory, value: number | null) => {
    if (value === null) {
      // Clear the score
      dispatch({
        type: 'ADD_SCORE',
        score: { playerId, category, value: 0 }
      });
    } else {
      dispatch({
        type: 'ADD_SCORE',
        score: { playerId, category, value }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="font-display dark:font-cyber text-4xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          Yahtzee Scorecard
        </h1>
        <div className="flex items-center space-x-4">
          {!state.gameStarted && state.players.length >= 2 && (
            <button
              onClick={() => dispatch({ type: 'START_GAME' })}
              className="px-6 py-3 font-cyber bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Start Game
            </button>
          )}
          {state.gameStarted && (
            <button
              onClick={handleResetGame}
              className="px-6 py-3 font-cyber border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-400/10"
            >
              Reset Game
            </button>
          )}
        </div>
      </div>

      <ScoreGrid
        players={state.players}
        scores={state.scores}
        onScoreSelect={handleScoreSelect}
        onAddPlayer={handleAddPlayer}
        onEditPlayer={handleEditPlayer}
      />

      {showPlayerModal && (
        <PlayerSelectionModal
          onSelect={handlePlayerSelect}
          onClose={() => {
            setShowPlayerModal(false);
            setEditingPlayer(null);
          }}
          excludePlayerIds={editingPlayer ? state.players.filter(p => p.id !== editingPlayer.id).map(p => p.id) : state.players.map(p => p.id)}
          title={editingPlayer ? 'Edit Player' : 'Add Player to Game'}
          editingPlayer={editingPlayer}
          onDelete={handleDeletePlayer}
        />
      )}

      {showDeleteConfirmation && playerToDelete && (
        <DeleteConfirmationModal
          title="Delete Player"
          message={`Are you sure you want to remove ${playerToDelete.name} from the game? This action cannot be undone.`}
          onConfirm={confirmDeletePlayer}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setPlayerToDelete(null);
          }}
        />
      )}

      {showResetConfirmation && (
        <DeleteConfirmationModal
          title="Reset Game"
          message="Are you sure you want to reset the game? All scores will be cleared, but players will remain. This action cannot be undone."
          onConfirm={confirmResetGame}
          onCancel={() => setShowResetConfirmation(false)}
        />
      )}
    </div>
  );
}

export default Yahtzee; 
