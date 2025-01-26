import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { YahtzeePlayer, YahtzeeCategory, YahtzeeGameState } from '../../types';
import { createPlayer, updatePlayer, deletePlayer, getPlayer, updateGameHistory } from '../../services/playerService';

type YahtzeeAction =
  | { type: 'ADD_PLAYER'; player: YahtzeePlayer }
  | { type: 'UPDATE_PLAYER'; player: YahtzeePlayer }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'ADD_SCORE'; score: { playerId: string; category: YahtzeeCategory; value: number } }
  | { type: 'START_GAME' }
  | { type: 'NEXT_TURN' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; state: YahtzeeGameState };

const initialState: YahtzeeGameState = {
  players: [],
  scores: {},
  currentTurn: 0,
  gameStarted: false,
  isGameOver: false,
  dice: [1, 1, 1, 1, 1],
};

// Initialize an empty score record for a player
const initializePlayerScores = (): Record<YahtzeeCategory, number> => {
  return {} as Record<YahtzeeCategory, number>;
};

const YahtzeeGameContext = createContext<{
  state: YahtzeeGameState;
  dispatch: React.Dispatch<YahtzeeAction>;
} | undefined>(undefined);

function yahtzeeGameReducer(state: YahtzeeGameState, action: YahtzeeAction): YahtzeeGameState {
  switch (action.type) {
    case 'ADD_PLAYER':
      // Check if player is already in the game
      if (state.players.some(p => p.id === action.player.id)) {
        return state;
      }

      return {
        ...state,
        players: [...state.players, action.player],
        scores: {
          ...state.scores,
          [action.player.id]: initializePlayerScores(),
        },
      };

    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.player.id ? action.player : p
        ),
      };

    case 'REMOVE_PLAYER':
      const { [action.playerId]: removedScores, ...remainingScores } = state.scores;
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.playerId),
        scores: remainingScores,
        currentTurn: state.currentTurn >= state.players.length - 1 ? 0 : state.currentTurn,
      };

    case 'ADD_SCORE':
      const { playerId, category, value } = action.score;
      if (!state.scores[playerId]) {
        state.scores[playerId] = initializePlayerScores();
      }
      return {
        ...state,
        scores: {
          ...state.scores,
          [playerId]: {
            ...state.scores[playerId],
            [category]: value ?? 0,
          },
        },
      };

    case 'START_GAME':
      // Initialize scores for all players if not already initialized
      const initializedScores = state.players.reduce((scores, player) => ({
        ...scores,
        [player.id]: state.scores[player.id] || initializePlayerScores(),
      }), {});

      return {
        ...state,
        scores: initializedScores,
        gameStarted: true,
      };

    case 'NEXT_TURN':
      return {
        ...state,
        currentTurn: (state.currentTurn + 1) % state.players.length,
      };

    case 'END_GAME':
      return {
        ...state,
        gameStarted: false,
      };

    case 'RESET_GAME':
      // Keep players but reset their scores
      const resetScores = state.players.reduce((scores, player) => ({
        ...scores,
        [player.id]: initializePlayerScores(),
      }), {});

      return {
        ...initialState,
        players: state.players,
        scores: resetScores,
      };

    case 'LOAD_GAME':
      return {
        ...action.state,
        players: action.state.players,
        scores: action.state.scores,
        currentTurn: action.state.currentTurn,
        gameStarted: action.state.gameStarted
      };

    default:
      return state;
  }
}

export function YahtzeeGameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(yahtzeeGameReducer, initialState);
  const [pendingAction, setPendingAction] = useState<YahtzeeAction | null>(null);

  useEffect(() => {
    const handleAction = async () => {
      if (!pendingAction) return;

      try {
        switch (pendingAction.type) {
          case 'ADD_PLAYER':
            const existingPlayer = await getPlayer(pendingAction.player.id);
            const player = existingPlayer || await createPlayer(pendingAction.player);
            dispatch({ ...pendingAction, player });
            break;

          case 'UPDATE_PLAYER':
            await updatePlayer(pendingAction.player);
            dispatch(pendingAction);
            break;

          case 'REMOVE_PLAYER':
            await deletePlayer(pendingAction.playerId);
            dispatch(pendingAction);
            break;

          case 'END_GAME':
            await Promise.all(state.players.map(async (player) => {
              const playerScores = state.scores[player.id] || initializePlayerScores();
              const totalScore = Object.values(playerScores).reduce((sum, score) => sum + score, 0);
              
              await updateGameHistory({
                gameId: 'yahtzee',
                gameName: 'Yahtzee',
                playerId: player.id,
                score: totalScore,
                rank: 0,
                playedAt: new Date()
              });
            }));
            dispatch(pendingAction);
            break;

          default:
            dispatch(pendingAction);
            break;
        }
      } catch (error) {
        console.error('Error handling action:', error);
      } finally {
        setPendingAction(null);
      }
    };

    handleAction();
  }, [pendingAction, state.players, state.scores]);

  const dispatchWithAsync = (action: YahtzeeAction) => {
    if (['ADD_PLAYER', 'UPDATE_PLAYER', 'REMOVE_PLAYER', 'END_GAME'].includes(action.type)) {
      setPendingAction(action);
    } else {
      dispatch(action);
    }
  };

  return (
    <YahtzeeGameContext.Provider value={{ state, dispatch: dispatchWithAsync }}>
      {children}
    </YahtzeeGameContext.Provider>
  );
}

export function useYahtzeeGame() {
  const context = useContext(YahtzeeGameContext);
  if (context === undefined) {
    throw new Error('useYahtzeeGame must be used within a YahtzeeGameProvider');
  }
  return context;
} 
