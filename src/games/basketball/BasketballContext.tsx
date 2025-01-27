import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GameMode, TeamSide, BasePlayer, GameEvent } from '../../types';
import { GAME_MODES } from './basketballConfig';
import { generateId } from '../../utils';

// Initial state for a new game
const initialState: GameState = {
  gameMode: 'FIRST_TO_21',
  timeRemaining: 300, // Default to 5 minutes
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
type GameAction =
  | { type: 'START_GAME'; gameMode: GameMode }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_TIME'; time: number }
  | { type: 'ADD_PLAYER'; team: TeamSide; player: BasePlayer }
  | { type: 'UPDATE_PLAYER'; team: TeamSide; player: BasePlayer }
  | { type: 'REMOVE_PLAYER'; team: TeamSide; playerId: string }
  | { type: 'TOGGLE_PLAYER_ACTIVE'; team: TeamSide; playerId: string }
  | { type: 'RECORD_ACTION'; event: Omit<GameEvent, 'id' | 'timestamp'> }
  | { type: 'CHANGE_POSSESSION' }
  | { type: 'USE_TIMEOUT'; team: TeamSide }
  | { type: 'NEXT_QUARTER' }
  | { type: 'LOAD_GAME'; state: GameState };

// Create context
const BasketballGameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Reducer function
function basketballGameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const gameMode = GAME_MODES[action.gameMode];
      return {
        ...state,
        gameMode: action.gameMode,
        timeRemaining: gameMode.timeLimit ?? state.timeRemaining, // Use existing time if no time limit
        shotClock: action.gameMode === 'TOURNAMENT' ? 24 : null,
        isGameStarted: true,
        isPaused: true, // Start paused
        isGameOver: false
      };
    }

    case 'PAUSE_GAME':
      return { ...state, isPaused: true };

    case 'RESUME_GAME':
      return { ...state, isPaused: false };

    case 'RESET_GAME':
      return {
        ...initialState,
        homeTeam: { ...initialState.homeTeam, players: state.homeTeam.players },
        awayTeam: { ...initialState.awayTeam, players: state.awayTeam.players },
      };

    case 'UPDATE_TIME': {
      const newTime = Math.max(0, action.time);
      const isGameOver = newTime === 0;
      return { 
        ...state, 
        timeRemaining: newTime,
        isGameOver: isGameOver || state.isGameOver,
        isPaused: isGameOver ? true : state.isPaused
      };
    }

    case 'ADD_PLAYER': {
      const team = action.team === 'HOME' ? 'homeTeam' : 'awayTeam';
      const newPlayer = {
        ...action.player,
        stats: {
          points: 0,
          threePointers: 0,
          twoPointers: 0,
          freeThrows: 0,
          fouls: 0,
          assists: 0,
          rebounds: 0,
          blocks: 0,
          steals: 0,
        },
        isActive: true,
      };
      return {
        ...state,
        [team]: {
          ...state[team],
          players: [...state[team].players, newPlayer],
        },
      };
    }

    case 'UPDATE_PLAYER': {
      const team = action.team === 'HOME' ? 'homeTeam' : 'awayTeam';
      return {
        ...state,
        [team]: {
          ...state[team],
          players: state[team].players.map((p: BasePlayer) =>
            p.id === action.player.id ? { ...p, ...action.player } : p
          ),
        },
      };
    }

    case 'REMOVE_PLAYER': {
      const team = action.team === 'HOME' ? 'homeTeam' : 'awayTeam';
      return {
        ...state,
        [team]: {
          ...state[team],
          players: state[team].players.filter((p: BasePlayer) => p.id !== action.playerId),
        },
      };
    }

    case 'TOGGLE_PLAYER_ACTIVE': {
      const team = action.team === 'HOME' ? 'homeTeam' : 'awayTeam';
      return {
        ...state,
        [team]: {
          ...state[team],
          players: state[team].players.map((p: BasePlayer) =>
            p.id === action.playerId ? { ...p, isActive: !p.isActive } : p
          ),
        },
      };
    }

    case 'RECORD_ACTION': {
      const newEvent: GameEvent = {
        id: generateId(),
        timestamp: Date.now(),
        teamSide: action.event.teamSide,
        playerId: action.event.playerId,
        action: action.event.action,
      };

      // Calculate points based on action type
      let points = 0;
      switch (action.event.action) {
        case 'THREE_POINTER':
          points = 3;
          break;
        case 'TWO_POINTER':
          points = 2;
          break;
        case 'FREE_THROW':
          points = 1;
          break;
        case 'FOUL':
          points = -1;
          break;
        default:
          points = 0;
      }

      // Update team score
      const team = action.event.teamSide === 'HOME' ? 'homeTeam' : 'awayTeam';
      const newScore = Math.max(0, state[team].score + points);

      // Check if target score is reached
      const gameMode = GAME_MODES[state.gameMode];
      const targetScore = gameMode.targetScore;
      const isGameOver = targetScore ? newScore >= targetScore : state.isGameOver;

      return {
        ...state,
        gameEvents: [...state.gameEvents, newEvent],
        [team]: {
          ...state[team],
          score: newScore
        },
        isGameOver,
        isPaused: isGameOver ? true : state.isPaused
      };
    }

    case 'CHANGE_POSSESSION':
      return {
        ...state,
        possession: state.possession === 'HOME' ? 'AWAY' : 'HOME',
        shotClock: state.shotClock ? 24 : null,
      };

    case 'USE_TIMEOUT': {
      const team = action.team === 'HOME' ? 'homeTeam' : 'awayTeam';
      return {
        ...state,
        [team]: {
          ...state[team],
          timeouts: Math.max(0, state[team].timeouts - 1),
        },
        isPaused: true,
      };
    }

    case 'NEXT_QUARTER':
      return {
        ...state,
        quarter: state.quarter + 1,
        possession: state.quarter % 2 === 0 ? 'HOME' : 'AWAY',
      };

    case 'LOAD_GAME':
      return action.state;

    default:
      return state;
  }
}

// Provider component
export function BasketballGameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(basketballGameReducer, initialState);

  // Game clock effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isGameStarted && !state.isPaused && state.timeRemaining !== null && !state.isGameOver) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME', time: state.timeRemaining! - 1 });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isGameStarted, state.isPaused, state.timeRemaining, state.isGameOver]);

  return (
    <BasketballGameContext.Provider value={{ state, dispatch }}>
      {children}
    </BasketballGameContext.Provider>
  );
}

// Custom hook for using the basketball game context
export function useBasketballGame() {
  const context = useContext(BasketballGameContext);
  if (!context) {
    throw new Error('useBasketballGame must be used within a BasketballGameProvider');
  }
  return context;
} 
