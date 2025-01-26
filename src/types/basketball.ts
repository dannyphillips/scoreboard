export type GameMode = 'FIRST_TO_11' | 'FIRST_TO_21' | 'TIMED_GAME' | 'TOURNAMENT';

export type TeamSide = 'HOME' | 'AWAY';

export interface BasePlayer {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  stats: PlayerStats;
}

export interface PlayerStats {
  points: number;
  threePointers: number;
  twoPointers: number;
  freeThrows: number;
  fouls: number;
  assists: number;
  rebounds: number;
  blocks: number;
  steals: number;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  timeouts: number;
  players: BasePlayer[];
}

export interface GameState {
  gameMode: GameMode;
  timeRemaining: number | null;
  isGameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  homeTeam: Team;
  awayTeam: Team;
  possession: TeamSide;
  shotClock: number | null;
  quarter: number;
  gameEvents: GameEvent[];
}

export type ScoringActionType = 
  | 'THREE_POINTER'
  | 'TWO_POINTER'
  | 'FREE_THROW'
  | 'FOUL'
  | 'ASSIST'
  | 'REBOUND'
  | 'BLOCK'
  | 'STEAL';

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
