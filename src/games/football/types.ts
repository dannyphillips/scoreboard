import { BasePlayer } from '../../types';
import { Preset } from '../sports/SportsGameSettings';

export interface FootballTeam {
  id: string;
  name: string;
  color: string;
  score: number;
  timeouts: number;
  players: BasePlayer[];
}

export interface FootballGameSettings {
  timeLength: number; // in seconds
  finalScore: number | null;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
}

export interface FootballGameState {
  settings: FootballGameSettings;
  timeRemaining: number | null;
  isGameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  gameMode: FootballGameMode;
  targetScore: number;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
}

export type FootballGameMode = 'FIRST_TO_21' | 'FIRST_TO_28' | 'FIRST_TO_35' | 'TIMED_GAME';

export const TIME_PRESETS: Preset[] = [
  { label: '12 min', value: 720 },
  { label: '15 min', value: 900 },
  { label: '20 min', value: 1200 }
];

export const SCORE_PRESETS: Preset[] = [
  { label: '21', value: 21 },
  { label: '28', value: 28 },
  { label: '35', value: 35 }
]; 