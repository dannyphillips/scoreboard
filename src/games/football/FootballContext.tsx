import { createContext, useContext } from 'react';
import { SportsGameState, SportsGameAction, createGameContext, createSportsGameReducer, createGameProvider, createInitialState } from '../sports/SportsGameContext';
import { FootballGameMode } from './types';
import { TEAM_PRESETS } from '../sports/teamPresets';

export interface FootballGameState extends SportsGameState {
  gameMode: FootballGameMode;
  targetScore: number;
}

export type FootballGameAction = SportsGameAction;

const FootballGameContext = createGameContext<FootballGameState, FootballGameAction>();

const calculateScore = (state: FootballGameState, action: FootballGameAction): number => {
  if (action.type !== 'RECORD_ACTION') return 0;
  
  switch (action.event.action) {
    case 'TOUCHDOWN':
      return 6;
    case 'FIELD_GOAL':
      return 3;
    case 'EXTRA_POINT':
      return 1;
    case 'POINT_ADJUSTMENT':
      return -1;
    default:
      return 0;
  }
};

const footballGameReducer = createSportsGameReducer<FootballGameState, FootballGameAction>(
  calculateScore,
  (state, action) => {
    if (action.type === 'START_GAME') {
      return {
        ...state,
        isGameStarted: true,
        isPaused: true, // Start paused
        gameMode: action.gameMode as FootballGameMode
      };
    }

    if (action.type === 'LOAD_GAME') {
      const targetScore = action.state.targetScore || (action.state.settings?.finalScore as number) || state.targetScore;
      const newState = {
        ...state,
        ...action.state,
        targetScore, // Set target score
        settings: {
          ...state.settings,
          ...action.state.settings,
          finalScore: targetScore // Keep finalScore in sync with targetScore
        }
      };
      return newState as FootballGameState;
    }

    if (action.type === 'RECORD_ACTION') {
      const points = calculateScore(state, action);
      const team = action.event.teamSide === 'HOME' ? 'homeTeam' : 'awayTeam';
      const newScore = Math.max(0, state[team].score + points);
      
      // If target score is reached, end the game
      if (newScore >= state.targetScore) {
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
    }

    return null;
  }
);

const initialState = {
  ...createInitialState('quarter', 900),
  gameMode: 'FIRST_TO_21' as FootballGameMode,
  targetScore: 21,
  homeTeam: {
    id: TEAM_PRESETS[0].id,
    name: TEAM_PRESETS[0].name,
    color: TEAM_PRESETS[0].color,
    logo: TEAM_PRESETS[0].logo,
    score: 0,
    timeouts: 3,
    players: []
  },
  awayTeam: {
    id: TEAM_PRESETS[1].id,
    name: TEAM_PRESETS[1].name,
    color: TEAM_PRESETS[1].color,
    logo: TEAM_PRESETS[1].logo,
    score: 0,
    timeouts: 3,
    players: []
  },
  settings: {
    timeLength: 900,
    finalScore: 21,
    homeTeam: {
      id: TEAM_PRESETS[0].id,
      name: TEAM_PRESETS[0].name,
      color: TEAM_PRESETS[0].color,
      logo: TEAM_PRESETS[0].logo,
      score: 0,
      timeouts: 3,
      players: []
    },
    awayTeam: {
      id: TEAM_PRESETS[1].id,
      name: TEAM_PRESETS[1].name,
      color: TEAM_PRESETS[1].color,
      logo: TEAM_PRESETS[1].logo,
      score: 0,
      timeouts: 3,
      players: []
    }
  }
};

export const FootballGameProvider = createGameProvider(
  FootballGameContext,
  footballGameReducer,
  initialState
);

export function useFootballGame() {
  const context = useContext(FootballGameContext);
  if (!context) {
    throw new Error('useFootballGame must be used within a FootballGameProvider');
  }
  return context;
} 