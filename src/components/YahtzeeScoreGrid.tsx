import React, { useState } from 'react';
import { YahtzeePlayer, YahtzeeScore, YahtzeeCategory } from '../types/yahtzee';
import { YAHTZEE_CATEGORIES } from '../config/yahtzeeConfig';

interface YahtzeeScoreGridProps {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
  onScoreSelect: (playerId: string, category: YahtzeeCategory, value: number) => void;
  onAddPlayer: () => void;
  onEditPlayer: (player: YahtzeePlayer) => void;
  currentDice?: number[];
}

const YahtzeeScoreGrid: React.FC<YahtzeeScoreGridProps> = ({
  players,
  scores,
  onScoreSelect,
  onAddPlayer,
  onEditPlayer,
  currentDice = []
}) => {
  const [selectedCell, setSelectedCell] = useState<{
    playerId: string;
    category: YahtzeeCategory;
  } | null>(null);

  const getScore = (playerId: string, category: YahtzeeCategory) => {
    return scores[playerId]?.[category] ?? null;
  };

  const getPossibleScores = (category: YahtzeeCategory) => {
    if (!currentDice.length) return [];
    return YAHTZEE_CATEGORIES[category].calculatePossibleScores(currentDice);
  };

  return (
    <div className="overflow-x-auto">
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
          {Object.entries(YAHTZEE_CATEGORIES).map(([category, config]) => (
            <tr key={category}>
              <td className="p-2 border dark:border-scoreboard-dark-primary font-cyber">
                {config.name}
                <div className="text-xs opacity-50">{config.description}</div>
              </td>
              {players.map(player => (
                <td
                  key={`${player.id}-${category}`}
                  className="p-2 border dark:border-scoreboard-dark-primary text-center cursor-pointer hover:bg-scoreboard-dark-surface/10"
                  onClick={() => setSelectedCell({ playerId: player.id, category: category as YahtzeeCategory })}
                >
                  {selectedCell?.playerId === player.id && selectedCell?.category === category ? (
                    <div className="relative">
                      <div className="absolute z-10 bg-white dark:bg-scoreboard-dark-surface shadow-lg rounded-lg p-2">
                        {getPossibleScores(category as YahtzeeCategory).map(score => (
                          <div
                            key={score}
                            className="p-1 hover:bg-scoreboard-dark-primary/20 cursor-pointer"
                            onClick={() => {
                              onScoreSelect(player.id, category as YahtzeeCategory, score);
                              setSelectedCell(null);
                            }}
                          >
                            {score}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="font-cyber">{getScore(player.id, category as YahtzeeCategory) ?? '-'}</span>
                  )}
                </td>
              ))}
              <td className="p-2 border dark:border-scoreboard-dark-primary text-center font-cyber">
                {config.maxScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YahtzeeScoreGrid; 
