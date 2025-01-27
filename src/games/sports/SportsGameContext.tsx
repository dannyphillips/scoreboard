import React, { createContext, useReducer, useEffect } from 'react';
import { GameMode, GameEvent, TeamSide, BasePlayer } from '../../types';

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  timeouts: number;
  players: BasePlayer[];
}

export interface SportsGameState {
  gameMode: GameMode;
  timeRemaining: number | null;
  isGameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  homeTeam: Team;
  awayTeam: Team;
  possession: TeamSide;
  quarter: number;
  gameEvents: GameEvent[];
  targetScore?: number;
  settings?: {
    timeLength: number;
    finalScore: number | null;
    homeTeam: Team;
    awayTeam: Team;
  };
}

export type SportsGameAction =
  | { type: 'START_GAME'; gameMode: GameMode }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_TIME'; time: number }
  | { type: 'RECORD_ACTION'; event: Omit<GameEvent, 'id' | 'timestamp'> }
  | { type: 'CHANGE_POSSESSION' }
  | { type: 'USE_TIMEOUT'; team: TeamSide }
  | { type: 'NEXT_PERIOD' }
  | { type: 'LOAD_GAME'; state: SportsGameState };

export const createInitialState = (
  periodName: string = 'quarter',
  initialTimeInSeconds: number = 900
): SportsGameState => ({
  gameMode: 'TIMED_GAME',
  timeRemaining: initialTimeInSeconds,
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
});

export function createSportsGameReducer<T extends SportsGameState, A extends SportsGameAction>(
  calculateScore: (state: T, action: A) => number,
  customReducer?: (state: T, action: A) => T | null
) {
  return (state: T, action: A): T => {
    // Try custom reducer first
    if (customReducer) {
      const result = customReducer(state, action);
      if (result !== null) {
        return result;
      }
    }

    // Default reducer logic
    switch (action.type) {
      case 'START_GAME':
        return {
          ...state,
          isGameStarted: true,
          isPaused: false,
          gameMode: action.gameMode
        } as T;

      case 'PAUSE_GAME':
        return {
          ...state,
          isPaused: true
        } as T;

      case 'RESUME_GAME':
        return {
          ...state,
          isPaused: false
        } as T;

      case 'UPDATE_TIME':
        return {
          ...state,
          timeRemaining: action.time,
          isGameOver: action.time <= 0
        } as T;

      case 'RECORD_ACTION': {
        const points = calculateScore(state, action);
        const team = action.event.teamSide === 'HOME' ? 'homeTeam' : 'awayTeam';
        const newScore = Math.max(0, state[team].score + points);

        return {
          ...state,
          gameEvents: [...state.gameEvents, {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...action.event
          }],
          [team]: {
            ...state[team],
            score: newScore
          }
        } as T;
      }

      case 'CHANGE_POSSESSION':
        return {
          ...state,
          possession: state.possession === 'HOME' ? 'AWAY' : 'HOME'
        } as T;

      case 'USE_TIMEOUT': {
        const team = action.team === 'HOME' ? 'homeTeam' : 'awayTeam';
        return {
          ...state,
          [team]: {
            ...state[team],
            timeouts: Math.max(0, state[team].timeouts - 1)
          },
          isPaused: true
        } as T;
      }

      case 'NEXT_PERIOD':
        return {
          ...state,
          quarter: state.quarter + 1,
          possession: state.quarter % 2 === 0 ? 'HOME' : 'AWAY'
        } as T;

      case 'LOAD_GAME':
        return action.state as T;

      default:
        return state;
    }
  };
}

export function createGameContext<T extends SportsGameState, A extends SportsGameAction>() {
  return createContext<{
    state: T;
    dispatch: React.Dispatch<A>;
  } | null>(null);
}

export function createGameProvider<T extends SportsGameState, A extends SportsGameAction>(
  Context: React.Context<{ state: T; dispatch: React.Dispatch<A> } | null>,
  reducer: (state: T, action: A) => T,
  initialState: T
) {
  return function GameProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
      let timer: number;
      if (state.isGameStarted && !state.isPaused && state.timeRemaining !== null && state.timeRemaining > 0) {
        timer = window.setInterval(() => {
          if (state.timeRemaining !== null) {
            dispatch({ type: 'UPDATE_TIME', time: state.timeRemaining - 1 } as A);
          }
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [state.isGameStarted, state.isPaused, state.timeRemaining]);

    return (
      <Context.Provider value={{ state, dispatch }}>
        {children}
      </Context.Provider>
    );
  };
} 