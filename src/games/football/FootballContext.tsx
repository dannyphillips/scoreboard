import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameMode, GameEvent, TeamSide, ScoringActionType } from '../../types';
import { GAME_MODES } from './footballConfig';
import { generateId } from '../../utils';
import { FootballTeam } from './types';

interface FootballGameState {
  gameMode: GameMode;
  timeRemaining: number | null;
  isGameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
  possession: TeamSide;
  quarter: number;
  gameEvents: GameEvent[];
}

type GameAction =
  | { type: 'START_GAME'; gameMode: GameMode }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_TIME'; time: number }
  | { type: 'RECORD_ACTION'; event: Omit<GameEvent, 'id' | 'timestamp'> }
  | { type: 'CHANGE_POSSESSION' }
  | { type: 'USE_TIMEOUT'; team: TeamSide }
  | { type: 'NEXT_QUARTER' }
  | { type: 'LOAD_GAME'; state: FootballGameState };

const initialState: FootballGameState = {
  gameMode: 'TIMED_GAME',
  timeRemaining: 900, // 15 minutes
  isGameStarted: false,
  isPaused: true,
  isGameOver: false,
  homeTeam: {
    id: 'home',
    name: 'Home Team',
    color: '#FF4136',
    score: 0,
    timeouts: 3,
    players: []
  },
  awayTeam: {
    id: 'away',
    name: 'Away Team',
    color: '#0074D9',
    score: 0,
    timeouts: 3,
    players: []
  },
  possession: 'HOME',
  quarter: 1,
  gameEvents: []
};

const FootballGameContext = createContext<{
  state: FootballGameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

function footballGameReducer(state: FootballGameState, action: GameAction): FootballGameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        isGameStarted: true,
        isPaused: false,
        gameMode: action.gameMode
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        isPaused: true
      };

    case 'RESUME_GAME':
      return {
        ...state,
        isPaused: false
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        homeTeam: {
          ...initialState.homeTeam,
          players: state.homeTeam.players
        },
        awayTeam: {
          ...initialState.awayTeam,
          players: state.awayTeam.players
        }
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.time,
        isGameOver: action.time <= 0
      };

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
        case 'TOUCHDOWN':
          points = 6;
          break;
        case 'FIELD_GOAL':
          points = 3;
          break;
        case 'EXTRA_POINT':
          points = 1;
          break;
        case 'POINT_ADJUSTMENT':
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

export function FootballGameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(footballGameReducer, initialState);

  useEffect(() => {
    let timer: number;
    if (state.isGameStarted && !state.isPaused && state.timeRemaining !== null && state.timeRemaining > 0) {
      timer = window.setInterval(() => {
        if (state.timeRemaining !== null) {
          dispatch({ type: 'UPDATE_TIME', time: state.timeRemaining - 1 });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.isGameStarted, state.isPaused, state.timeRemaining]);

  return (
    <FootballGameContext.Provider value={{ state, dispatch }}>
      {children}
    </FootballGameContext.Provider>
  );
}

export function useFootballGame() {
  const context = useContext(FootballGameContext);
  if (!context) {
    throw new Error('useFootballGame must be used within a FootballGameProvider');
  }
  return context;
} 