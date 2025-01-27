import { YahtzeePlayer, YahtzeeCategory } from '../../types';
import { YAHTZEE_CATEGORIES } from './yahtzeeConfig';
import { useYahtzeeGame } from './YahtzeeContext';

interface ScoreGridProps {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
  onScore: (category: YahtzeeCategory) => void;
  onAddPlayer: () => void;
  onEditPlayer: (player: YahtzeePlayer) => void;
  dice: number[];
}

function ScoreGrid({ players, scores, onScore, onAddPlayer, onEditPlayer, dice }: ScoreGridProps) {
  const renderScoreCell = (playerId: string, category: YahtzeeCategory) => {
    const score = scores[playerId]?.[category];
    if (score !== undefined) {
      return <div className="text-center">{score}</div>;
    }
    
    const possibleScores = YAHTZEE_CATEGORIES[category].calculatePossibleScores(dice);
    return (
      <button
        onClick={() => onScore(category)}
        className="w-full h-full flex items-center justify-center hover:bg-gray-100"
      >
        {possibleScores[0] || 0}
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-scoreboard-dark-surface rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-cyber text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          Score Sheet
        </h2>
        <button
          onClick={onAddPlayer}
          className="px-4 py-2 bg-scoreboard-light-sky dark:bg-scoreboard-dark-primary text-white font-cyber rounded hover:bg-opacity-90"
        >
          Add Player
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left">Category</th>
              {players.map(player => (
                <th 
                  key={player.id}
                  className="p-2 text-center cursor-pointer hover:bg-gray-50 w-24 border-b border-gray-300"
                  onClick={() => onEditPlayer(player)}
                >
                  <div className="flex flex-col items-center group">
                    <div 
                      className="w-6 h-6 rounded-full mb-1 group-hover:ring-2 group-hover:ring-gray-800 group-hover:ring-offset-2 transition-all"
                      style={{ backgroundColor: player.color }}
                    />
                    <span className="font-mono text-sm text-gray-800 group-hover:text-gray-600 truncate max-w-[80px]">
                      {player.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(YAHTZEE_CATEGORIES).map(([category, config]) => {
              const categoryKey = category as YahtzeeCategory;
              return (
                <tr key={categoryKey} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-2 px-3 font-mono">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-800 text-sm">
                          {config.name}
                        </span>
                        <div className="text-xs text-gray-600">
                          {config.description}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-gray-800">
                        {config.maxScore} pts
                      </div>
                    </div>
                  </td>
                  {players.map(player => (
                    <td key={player.id} className="p-1 flex-row justify-center font-mono w-24">
                      {renderScoreCell(player.id, categoryKey)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Yahtzee() {
  const { state, dispatch } = useYahtzeeGame();

  const handleAddPlayer = () => {
    // TODO: Implement player addition
  };

  const handleEditPlayer = (player: YahtzeePlayer) => {
    // TODO: Implement player editing
    console.log(player);
  };

  const handleScore = (category: YahtzeeCategory) => {
    if (!state.dice) return;

    const possibleScores = YAHTZEE_CATEGORIES[category].calculatePossibleScores(state.dice);
    if (possibleScores.length > 0) {
      dispatch({
        type: 'ADD_SCORE',
        score: {
          playerId: state.players[state.currentTurn].id,
          category,
          value: possibleScores[0]
        }
      });
    }
  };

  // Convert YahtzeeScore to Record<YahtzeeCategory, number>
  const convertedScores: Record<string, Record<YahtzeeCategory, number>> = {};
  Object.entries(state.scores).forEach(([playerId, score]) => {
    convertedScores[playerId] = Object.entries(score).reduce((acc, [category, value]) => ({
      ...acc,
      [category]: value ?? 0
    }), {} as Record<YahtzeeCategory, number>);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ScoreGrid
        players={state.players}
        scores={convertedScores}
        onScore={handleScore}
        onAddPlayer={handleAddPlayer}
        onEditPlayer={handleEditPlayer}
        dice={state.dice}
      />
    </div>
  );
} 
