export interface BasketballPlayer {
  id: string;
  name: string;
  color: string;
  number?: string;
  position?: string;
  stats: BasketballPlayerStats;
}

export interface BasketballPlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fouls: number;
  turnovers: number;
  minutesPlayed: number;
}

export interface BasketballGameState {
  players: BasketballPlayer[];
  timeRemaining: number | null;
  quarter: number;
  isGameStarted: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  shotClockTime: number | null;
}

export type BasketballAction = 
  | 'FG_MADE'
  | 'FG_MISSED'
  | 'THREE_MADE'
  | 'THREE_MISSED'
  | 'FT_MADE'
  | 'FT_MISSED'
  | 'REBOUND'
  | 'ASSIST'
  | 'STEAL'
  | 'BLOCK'
  | 'FOUL'
  | 'TURNOVER';

export interface BasketballGameMode {
  name: string;
  description: string;
  duration: number;
  quarters: number;
  shotClock: number | null;
} 
