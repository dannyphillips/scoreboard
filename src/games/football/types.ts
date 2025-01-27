import { BasePlayer } from '../../types';

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
}

interface Preset {
  label: string;
  value: number;
}

export interface TeamPreset {
  id: string;
  name: string;
  color: string;
  logo: string;
}

export const TEAM_PRESETS: TeamPreset[] = [
  { id: 'red-raiders', name: 'Red Raiders', color: '#FF4136', logo: '/images/football.png' },
  { id: 'blue-bombers', name: 'Blue Bombers', color: '#0074D9', logo: '/images/football.png' },
  { id: 'green-giants', name: 'Green Giants', color: '#2ECC40', logo: '/images/football.png' },
  { id: 'yellow-jackets', name: 'Yellow Jackets', color: '#FFDC00', logo: '/images/football.png' },
  { id: 'purple-pride', name: 'Purple Pride', color: '#B10DC9', logo: '/images/football.png' },
  { id: 'orange-crush', name: 'Orange Crush', color: '#FF851B', logo: '/images/football.png' },
  { id: 'teal-tigers', name: 'Teal Tigers', color: '#39CCCC', logo: '/images/football.png' },
  { id: 'pink-panthers', name: 'Pink Panthers', color: '#F012BE', logo: '/images/football.png' },
  { id: 'black-knights', name: 'Black Knights', color: '#111111', logo: '/images/football.png' },
  { id: 'white-wolves', name: 'White Wolves', color: '#FFFFFF', logo: '/images/football.png' },
  { id: 'gold-gladiators', name: 'Gold Gladiators', color: '#DAA520', logo: '/images/football.png' },
  { id: 'silver-stallions', name: 'Silver Stallions', color: '#C0C0C0', logo: '/images/football.png' }
];

export const TIME_PRESETS: Preset[] = [
  { label: '15 min', value: 900 },
  { label: '30 min', value: 1800 },
  { label: '60 min', value: 3600 }
];

export const SCORE_PRESETS: Preset[] = [
  { label: '21 points', value: 21 },
  { label: '35 points', value: 35 },
  { label: '49 points', value: 49 }
]; 