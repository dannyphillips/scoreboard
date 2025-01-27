import React from 'react';
import { createGameContext, createGameProvider, createSportsGameReducer, SportsGameAction } from '../sports/SportsGameContext';
import { BasketballGameState } from './types';
import { GAME_MODES } from './basketballConfig';

// Initial state for a new game
const initialState: BasketballGameState = {
  gameMode: 'FIRST_TO_21',
  timeRemaining: 900, // Default to 15 minutes
  isGameStarted: false,
  isPaused: false,
  isGameOver: false,
  homeTeam: {
    id: 'home-team',
    name: 'Home Team',
    color: '#FF4136',
    score: 0,
    timeouts: 2,
    players: [],
  },
  awayTeam: {
    id: 'away-team',
    name: 'Away Team',
    color: '#0074D9',
    score: 0,
    timeouts: 2,
    players: [],
  },
  possession: 'HOME',
  shotClock: null,
  quarter: 1,
  gameEvents: [],
};

// Action types
export type BasketballGameAction = SportsGameAction;

// Calculate score based on action type
const calculateScore = (state: BasketballGameState, action: BasketballGameAction): number => {
  if (action.type !== 'RECORD_ACTION' || !action.event) return 0;

  switch (action.event.action) {
    case 'THREE_POINTER': return 3;
    case 'TWO_POINTER': return 2;
    case 'FREE_THROW': return 1;
    case 'POINT_ADJUSTMENT': return -1;
    default: return 0;
  }
};

// Custom reducer for basketball-specific logic
const customReducer = (state: BasketballGameState, action: BasketballGameAction): BasketballGameState | null => {
  switch (action.type) {
    case 'START_GAME': {
      const gameMode = GAME_MODES[state.gameMode];
      return {
        ...state,
        gameMode: state.gameMode,
        timeRemaining: gameMode.timeLimit ?? state.timeRemaining,
        shotClock: state.gameMode === 'TOURNAMENT' ? 24 : null,
        isGameStarted: true,
        isPaused: true,
        isGameOver: false
      };
    }

    case 'RECORD_ACTION': {
      if (action.type !== 'RECORD_ACTION' || !action.event) return null;
      
      const points = calculateScore(state, action);
      const team = action.event.teamSide === 'HOME' ? 'homeTeam' : 'awayTeam';
      const newScore = Math.max(0, state[team].score + points);
      
      // Get target score from game mode
      const gameMode = GAME_MODES[state.gameMode];
      const targetScore = gameMode.targetScore;
      
      // If target score is reached, end the game
      if (targetScore && newScore >= targetScore) {
        return {
          ...state,
          [team]: {
            ...state[team],
            score: newScore
          },
          isGameOver: true,
          isPaused: true
        };
      }
      
      return null;
    }

    case 'CHANGE_POSSESSION':
      return {
        ...state,
        possession: state.possession === 'HOME' ? 'AWAY' : 'HOME',
        shotClock: state.shotClock ? 24 : null,
      };

    case 'NEXT_PERIOD':
      return {
        ...state,
        quarter: state.quarter + 1,
        possession: state.quarter % 2 === 0 ? 'HOME' : 'AWAY',
      };

    default:
      return null;
  }
};

// Create the basketball game reducer
const basketballGameReducer = createSportsGameReducer<BasketballGameState, BasketballGameAction>(
  calculateScore,
  customReducer
);

// Create the context
const BasketballGameContext = createGameContext<BasketballGameState, BasketballGameAction>();

// Create the provider
export const BasketballGameProvider = createGameProvider(
  BasketballGameContext,
  basketballGameReducer,
  initialState
);

// Custom hook for using the basketball game context
export function useBasketballGame() {
  const context = React.useContext(BasketballGameContext);
  if (!context) {
    throw new Error('useBasketballGame must be used within a BasketballGameProvider');
  }
  return context;
} 
