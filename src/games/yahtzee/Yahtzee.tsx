import { useState, useEffect } from 'react';
import { useYahtzeeGame } from './YahtzeeContext';
import { YahtzeePlayer, YahtzeeCategory } from './types';
import { YAHTZEE_CATEGORIES } from './yahtzeeConfig';
import PlayerSelectionModal from '../../components/PlayerSelectionModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';

// Score Grid Component
interface ScoreGridProps {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
  onScoreSelect: (playerId: string, category: YahtzeeCategory, value: number | null) => void;
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
        className={`block
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

  return (
    <div className="relative h-full flex flex-col bg-white text-gray-800">
      <div className="overflow-auto flex-grow">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-8 border-b border-gray-300"></th>
              <th className="w-full border-b border-gray-300"></th>
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
              <th className="p-2 w-12 border-b border-gray-300">
                <button
                  onClick={onAddPlayer}
                  className="w-8 h-8 rounded-full bg-gray-800 text-white font-bold text-lg hover:bg-gray-700 transition-colors"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="border-2 border-gray-300">
            {/* Upper Section */}
            <tr>
              <td rowSpan={8} className="border-r border-gray-300 font-mono font-bold text-sm text-gray-800 text-center align-middle w-8 [writing-mode:vertical-lr] rotate-180">
                Upper Section
              </td>
            </tr>
            {['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].map((category) => (
              <tr key={category} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-3 font-mono">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-800">
                        {YAHTZEE_CATEGORIES[category].name}
                      </span>
                      <div className="text-sm text-gray-600">
                        {YAHTZEE_CATEGORIES[category].description}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {YAHTZEE_CATEGORIES[category].maxScore} pts
                    </div>
                  </div>
                </td>
                {players.map(player => (
                  <td key={player.id} className="p-2 flex-row justify-center font-mono w-24">
                    {renderScoreCell(player.id, category as YahtzeeCategory)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Bonus Row */}
            <tr className="bg-gray-50 border-b border-gray-300">
              <td className="p-3 font-mono">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-800">Bonus</span>
                    <div className="text-sm text-gray-600">
                      Score 63+ to get 35 points bonus
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-800">35 pts</div>
                </div>
              </td>
              {players.map(player => {
                const upperTotal = calculateUpperSubtotal(player.id);
                const pointsNeeded = Math.max(0, 63 - upperTotal);
                const hasBonus = upperTotal >= 63;
                
                return (
                  <td key={player.id} className="p-2 text-center font-mono w-24">
                    {hasBonus ? (
                      <span className="text-green-600 font-bold">35</span>
                    ) : (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-800 bg-red-100 rounded-full border border-red-200">
                        {pointsNeeded} needed
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Lower Section */}
            <tr>
              <td rowSpan={8} className="border-r border-gray-300 font-mono font-bold text-sm text-gray-800 text-center align-middle w-8 [writing-mode:vertical-lr] rotate-180">
                Lower Section
              </td>
            </tr>
            {['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'].map((category) => (
              <tr key={category} className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-3 font-mono">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-800">
                        {YAHTZEE_CATEGORIES[category].name}
                      </span>
                      <div className="text-sm text-gray-600">
                        {YAHTZEE_CATEGORIES[category].description}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {YAHTZEE_CATEGORIES[category].maxScore} pts
                    </div>
                  </div>
                </td>
                {players.map(player => (
                  <td key={player.id} className="p-2 flex-row justify-center font-mono w-24">
                    {renderScoreCell(player.id, category as YahtzeeCategory)}
                  </td>
                ))}
                <td className="w-12"></td>
              </tr>
            ))}

            {/* Totals Section */}
            <tr>
              <td rowSpan={3} className="border-r border-gray-300 font-mono font-bold text-sm text-gray-800 text-center align-middle w-8 [writing-mode:vertical-lr] rotate-180">
                Totals
              </td>
              <td className="p-3 font-mono font-bold text-gray-800">
                Upper Section Total (with bonus)
              </td>
              {players.map(player => (
                <td key={player.id} className="p-2 text-center font-mono font-bold text-gray-800 w-24">
                  {calculateUpperSubtotal(player.id) + getUpperBonus(player.id)}
                </td>
              ))}
              <td className="w-12"></td>
            </tr>
            <tr>
              <td className="p-3 font-mono font-bold text-gray-800">
                Lower Section Total
              </td>
              {players.map(player => (
                <td key={player.id} className="p-2 text-center font-mono font-bold text-gray-800 w-24">
                  {calculateLowerSubtotal(player.id)}
                </td>
              ))}
              <td className="w-12"></td>
            </tr>
            <tr className="border-t-2 border-gray-300">
              <td className="p-3 font-mono font-bold text-xl text-gray-800">
                Grand Total
              </td>
              {players.map(player => (
                <td key={player.id} className="p-2 text-center font-mono font-bold text-xl text-gray-800 w-24">
                  {calculateTotal(player.id)}
                </td>
              ))}
              <td className="w-12"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Game Component
export default function Yahtzee() {
  const { state, dispatch } = useYahtzeeGame();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<YahtzeePlayer | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<YahtzeePlayer | null>(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const navigate = useNavigate();

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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex flex-col items-center justify-start p-8">
      {/* Exit Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Exit Game
      </button>


      {/* Scoreboard */}
      <div className="w-full max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
      {/* Logo */}
      <div className="mb-8 mt-4">
        <img 
          src="/src/assets/images/games/yahtzee-card.jpg" 
          alt="Shake N' Score" 
          className="h-24 object-contain"
        />
      </div>
          <h1 className="font-display dark:blue text-6xl text-blue dark:text-blue">
            Shake N' Score Scorecard
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
    </div>
  );
} 
