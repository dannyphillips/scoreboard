import { BasePlayer } from '../types';

export interface BasketballTeam {
  id: string;
  name: string;
  color: string;
  score: number;
  players: BasePlayer[];
}

export interface BasketballPlayer {
  id: string;
  name: string;
  color: string;
}

export interface BasketballGameSettings {
  timeLength: number; // in seconds
  finalScore: number | null;
  homeTeam: BasketballTeam;
  awayTeam: BasketballTeam;
}

export interface BasketballGameState {
  settings: BasketballGameSettings;
  timeRemaining: number | null;
  isGameStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
}

interface Preset {
  label: string;
  value: number;
}

export const TEAM_COLORS = [
  { label: 'Red', value: '#FF6B6B' },
  { label: 'Blue', value: '#45B7D1' },
  { label: 'Green', value: '#96CEB4' },
  { label: 'Purple', value: '#9B59B6' },
  { label: 'Orange', value: '#FF8E3C' },
  { label: 'Cyan', value: '#4ECDC4' },
  { label: 'Yellow', value: '#FFD93D' },
  { label: 'Pink', value: '#FF69B4' }
];

export const TIME_PRESETS: Preset[] = [
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 }
];

export const SCORE_PRESETS: Preset[] = [
  { label: '5 points', value: 5 },
  { label: '11 points', value: 11 },
  { label: '21 points', value: 21 }
]; 
