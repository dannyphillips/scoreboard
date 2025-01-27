import { Team } from '../sports/SportsGameContext';
import { GameSettings } from '../sports/SportsGameSettings';
import { GameMode, ScoringActionType } from '../../types';

export interface BasketballTeam extends Team {
  logo?: string;
}

export interface BasketballGameSettings extends GameSettings {
  // Add any basketball-specific settings here
}

export interface BasketballGameState {
  gameMode: GameMode;
  timeRemaining: number;
  isGameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  homeTeam: BasketballTeam;
  awayTeam: BasketballTeam;
  possession: 'HOME' | 'AWAY';
  shotClock: number | null;
  quarter: number;
  gameEvents: GameEvent[];
  settings?: BasketballGameSettings;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  teamSide: 'HOME' | 'AWAY';
  playerId: string;
  action: ScoringActionType;
}

export const TIME_PRESETS = [
  { label: '12 min', value: 720 },
  { label: '15 min', value: 900 },
  { label: '20 min', value: 1200 }
];

export const SCORE_PRESETS = [
  { label: '11', value: 11 },
  { label: '21', value: 21 },
  { label: '35', value: 35 }
]; 
