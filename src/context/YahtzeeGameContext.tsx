import React, { createContext, useContext, useReducer } from 'react';
import { YahtzeePlayer, YahtzeeCategory } from '../types/yahtzee';
import { createPlayer, updatePlayer, deletePlayer } from '../services/playerService';

interface YahtzeeGameState {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
  currentTurn: number;
  gameStarted: boolean;
}

type YahtzeeGameAction =
  | { type: 'ADD_PLAYER'; player: YahtzeePlayer }
  | { type: 'UPDATE_PLAYER'; player: YahtzeePlayer }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'ADD_SCORE'; score: { playerId: string; category: YahtzeeCategory; value: number | null } }
  | { type: 'START_GAME' }
  | { type: 'NEXT_TURN' }
  | { type: 'RESET_GAME' };

const initialState: YahtzeeGameState = {
  players: [],
  scores: {},
  currentTurn: 0,
  gameStarted: false,
};

const YahtzeeGameContext = createContext<{
  state: YahtzeeGameState;
  dispatch: React.Dispatch<YahtzeeGameAction>;
} | undefined>(undefined);

async function yahtzeeGameReducer(state: YahtzeeGameState, action: YahtzeeGameAction): Promise<YahtzeeGameState> {
  switch (action.type) {
    case 'ADD_PLAYER':
      // Check if player is already in the game
      if (state.players.some(p => p.id === action.player.id)) {
        return state;
      }

      // Create or update player in Firebase
      try {
        const player = await createPlayer(action.player);
        return {
          ...state,
          players: [...state.players, player],
          scores: {
            ...state.scores,
            [player.id]: {} as Record<YahtzeeCategory, number>,
          },
        };
      } catch (error) {
        console.error('Error adding player:', error);
        return state;
      }

    case 'UPDATE_PLAYER':
      // Update player in Firebase
      try {
        await updatePlayer(action.player);
        return {
          ...state,
          players: state.players.map(p =>
            p.id === action.player.id ? action.player : p
          ),
        };
      } catch (error) {
        console.error('Error updating player:', error);
        return state;
      }

    case 'REMOVE_PLAYER':
      // Delete player from Firebase
      try {
        await deletePlayer(action.playerId);
        return {
          ...state,
          players: state.players.filter(p => p.id !== action.playerId),
          scores: Object.fromEntries(
            Object.entries(state.scores).filter(([id]) => id !== action.playerId)
          ),
        };
      } catch (error) {
        console.error('Error removing player:', error);
        return state;
      }

    case 'ADD_SCORE':
      const { playerId, category, value } = action.score;
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
      return {
        ...state,
        gameStarted: true,
      };

    case 'NEXT_TURN':
      return {
        ...state,
        currentTurn: (state.currentTurn + 1) % state.players.length,
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

export function YahtzeeGameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    (state: YahtzeeGameState, action: YahtzeeGameAction) => {
      yahtzeeGameReducer(state, action).then(newState => {
        return newState;
      });
      return state;
    },
    initialState
  );

  return (
    <YahtzeeGameContext.Provider value={{ state, dispatch }}>
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
