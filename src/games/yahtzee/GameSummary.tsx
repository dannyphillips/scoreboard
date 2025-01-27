import { YahtzeePlayer, YahtzeeScore } from '../../types/yahtzee';
import { YAHTZEE_CATEGORIES } from './yahtzeeConfig';
import { motion } from 'framer-motion';

interface GameSummaryProps {
  players: YahtzeePlayer[];
  scores: YahtzeeScore[];
}

function GameSummary({ players, scores }: GameSummaryProps) {
  const calculateUpperTotal = (playerId: string) => {
    return Object.entries(YAHTZEE_CATEGORIES)
      .filter(([_, config]) => config.section === 'upper')
      .reduce((total, [category]) => {
        const score = scores.find(s => s.playerId === playerId && s.category === category)?.value || 0;
        return total + score;
      }, 0);
  };

  const calculateLowerTotal = (playerId: string) => {
    return Object.entries(YAHTZEE_CATEGORIES)
      .filter(([_, config]) => config.section === 'lower')
      .reduce((total, [category]) => {
        const score = scores.find(s => s.playerId === playerId && s.category === category)?.value || 0;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6"
    >
      <h2 className="font-cyber text-2xl mb-6 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
        Game Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border dark:border-scoreboard-dark-primary rounded-lg p-4"
            style={{ backgroundColor: `${player.color}10` }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <h3 className="font-cyber text-xl">{player.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Upper Section:</span>
                <span>{calculateUpperTotal(player.id)}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Bonus:</span>
                <span>+{getUpperBonus(player.id)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lower Section:</span>
                <span>{calculateLowerTotal(player.id)}</span>
              </div>
              <div className="border-t dark:border-scoreboard-dark-primary pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Grand Total:</span>
                  <span>{calculateGrandTotal(player.id)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default GameSummary; 