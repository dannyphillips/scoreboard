import React, { createContext, useContext, useReducer } from 'react';
import { YahtzeePlayer, YahtzeeCategory } from '../types/yahtzee';

interface GameState {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
  currentTurn: number;
  gameStarted: boolean;
  gameFinished: boolean;
}

type GameAction =
  | { type: 'ADD_PLAYER'; player: YahtzeePlayer }
  | { type: 'EDIT_PLAYER'; player: YahtzeePlayer }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'ADD_SCORE'; score: { playerId: string; category: YahtzeeCategory; value: number } }
  | { type: 'START_GAME' }
  | { type: 'NEXT_TURN' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  players: [],
  scores: {},
  currentTurn: 0,
  gameStarted: false,
  gameFinished: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.player],
        scores: {
          ...state.scores,
          [action.player.id]: {} as Record<YahtzeeCategory, number>
        }
      };
    case 'EDIT_PLAYER':
      return {
        ...state,
        players: state.players.map(p => 
          p.id === action.player.id ? action.player : p
        ),
      };
    case 'REMOVE_PLAYER': {
      const { [action.playerId]: _, ...remainingScores } = state.scores;
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.playerId),
        scores: remainingScores,
      };
    }
    case 'ADD_SCORE':
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.score.playerId]: {
            ...state.scores[action.score.playerId],
            [action.score.category]: action.score.value
          }
        },
        currentTurn: (state.currentTurn + 1) % state.players.length,
      };
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true,
        currentTurn: 0,
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        players: state.players,
      };
    default:
      return state;
  }
}

const YahtzeeGameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function YahtzeeGameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <YahtzeeGameContext.Provider value={{ state, dispatch }}>
      {children}
    </YahtzeeGameContext.Provider>
  );
}

export function useYahtzeeGame() {
  const context = useContext(YahtzeeGameContext);
  if (!context) {
    throw new Error('useYahtzeeGame must be used within a YahtzeeGameProvider');
  }
  return context;
} 
