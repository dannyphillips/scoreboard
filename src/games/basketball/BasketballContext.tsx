import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GameMode, Team, BasketballPlayer, ScoringAction, GameEvent } from '../../types/basketball';
import { GAME_MODES, SCORING_ACTIONS } from './basketballConfig';
import { generateId } from '../../utils';

// Initial state for a new game
const initialState: GameState = {
  gameMode: 'FIRST_TO_21',
  timeRemaining: null,
  gameStarted: false,
  gamePaused: false,
  homeTeam: {
    name: 'Home Team',
    score: 0,
    timeouts: 2,
    players: [],
  },
  awayTeam: {
    name: 'Away Team',
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
  | { type: 'ADD_PLAYER'; team: Team; player: BasketballPlayer }
  | { type: 'UPDATE_PLAYER'; team: Team; player: BasketballPlayer }
  | { type: 'REMOVE_PLAYER'; team: Team; playerId: string }
  | { type: 'TOGGLE_PLAYER_ACTIVE'; team: Team; playerId: string }
  | { type: 'RECORD_ACTION'; event: Omit<GameEvent, 'id' | 'timestamp'> }
  | { type: 'CHANGE_POSSESSION' }
  | { type: 'USE_TIMEOUT'; team: Team }
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
        timeRemaining: gameMode.timeLimit,
        shotClock: action.gameMode === 'TOURNAMENT' ? 24 : null,
        gameStarted: true,
        gamePaused: false,
      };
    }

    case 'PAUSE_GAME':
      return { ...state, gamePaused: true };

    case 'RESUME_GAME':
      return { ...state, gamePaused: false };

    case 'RESET_GAME':
      return {
        ...initialState,
        homeTeam: { ...initialState.homeTeam, players: state.homeTeam.players },
        awayTeam: { ...initialState.awayTeam, players: state.awayTeam.players },
      };

    case 'UPDATE_TIME':
      return { ...state, timeRemaining: action.time };

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
          players: state[team].players.map(p =>
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
          players: state[team].players.filter(p => p.id !== action.playerId),
        },
      };
    }

    case 'TOGGLE_PLAYER_ACTIVE': {
      const team = action.team === 'HOME' ? 'homeTeam' : 'awayTeam';
      return {
        ...state,
        [team]: {
          ...state[team],
          players: state[team].players.map(p =>
            p.id === action.playerId ? { ...p, isActive: !p.isActive } : p
          ),
        },
      };
    }

    case 'RECORD_ACTION': {
      const event: GameEvent = {
        id: generateId(),
        timestamp: state.timeRemaining || 0,
        ...action.event,
      };

      const team = event.team === 'HOME' ? 'homeTeam' : 'awayTeam';
      const points = SCORING_ACTIONS[event.action].points;
      const updatedPlayers = state[team].players.map(player => {
        if (player.id === event.playerId) {
          const stats = { ...player.stats };
          
          // Update player stats based on action
          switch (event.action) {
            case 'THREE_POINTER':
              stats.points += 3;
              stats.threePointers += 1;
              break;
            case 'TWO_POINTER':
              stats.points += 2;
              stats.twoPointers += 1;
              break;
            case 'FREE_THROW':
              stats.points += 1;
              stats.freeThrows += 1;
              break;
            case 'FOUL':
              stats.fouls += 1;
              break;
            case 'ASSIST':
              stats.assists += 1;
              break;
            case 'REBOUND':
              stats.rebounds += 1;
              break;
            case 'BLOCK':
              stats.blocks += 1;
              break;
            case 'STEAL':
              stats.steals += 1;
              break;
          }
          
          return { ...player, stats };
        }
        return player;
      });

      return {
        ...state,
        [team]: {
          ...state[team],
          score: state[team].score + points,
          players: updatedPlayers,
        },
        gameEvents: [...state.gameEvents, event],
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
        gamePaused: true,
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

    if (state.gameStarted && !state.gamePaused && state.timeRemaining !== null) {
      interval = setInterval(() => {
        const currentTime = state.timeRemaining;
        if (currentTime !== null && currentTime > 0) {
          dispatch({ type: 'UPDATE_TIME', time: currentTime - 1 });
        } else {
          dispatch({ type: 'PAUSE_GAME' });
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.gameStarted, state.gamePaused, state.timeRemaining]);

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
