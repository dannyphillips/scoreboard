export interface BasePlayer {
  id: string;
  name: string;
  color: string;
  isActive?: boolean;
}

export type TeamSide = 'HOME' | 'AWAY';

export type GameMode = 'TIMED_GAME' | 'TOURNAMENT' | 'FIRST_TO_11' | 'FIRST_TO_21' | 'FIRST_TO_28' | 'FIRST_TO_35';

// Base scoring action type
export type BaseScoringActionType = 'POINT_ADJUSTMENT';

// Football-specific scoring actions
export type FootballScoringActionType = BaseScoringActionType | 'TOUCHDOWN' | 'FIELD_GOAL' | 'EXTRA_POINT';

// Basketball-specific scoring actions
export type BasketballScoringActionType = BaseScoringActionType | 'THREE_POINTER' | 'TWO_POINTER' | 'FREE_THROW' | 'FOUL' | 'ASSIST' | 'REBOUND' | 'BLOCK' | 'STEAL';

// Use this type for the shared sports components
export type ScoringActionType = FootballScoringActionType | BasketballScoringActionType;

export interface ScoringAction {
  type: ScoringActionType;
  points: number;
  color: string;
  icon: string;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  teamSide: TeamSide;
  playerId: string;
  action: ScoringActionType;
}

export interface GameState {
  gameMode: GameMode;
  timeRemaining: number | null;
  isGameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  homeTeam: {
    id: string;
    name: string;
    color: string;
    score: number;
    timeouts: number;
    players: BasePlayer[];
  };
  awayTeam: {
    id: string;
    name: string;
    color: string;
    score: number;
    timeouts: number;
    players: BasePlayer[];
  };
  possession: TeamSide;
  shotClock: number | null;
  quarter: number;
  gameEvents: GameEvent[];
} 