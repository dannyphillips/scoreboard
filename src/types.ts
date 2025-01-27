export interface BasePlayer {
  id: string;
  name: string;
  color: string;
  isActive?: boolean;
}

export type TeamSide = 'HOME' | 'AWAY';

export type GameMode = 
  | 'FIRST_TO_21'
  | 'TIMED_GAME'
  | 'TOURNAMENT';

export type ScoringActionType = 
  | 'TOUCHDOWN'
  | 'FIELD_GOAL'
  | 'EXTRA_POINT'
  | 'POINT_ADJUSTMENT';

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