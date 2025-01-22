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

export interface TeamPreset {
  id: string;
  name: string;
  color: string;
  logo: string;
}

export const TEAM_PRESETS: TeamPreset[] = [
  { id: 'red-hawks', name: 'Red Hawks', color: '#FF4136', logo: '/src/assets/images/teams/red-hawks.png' },
  { id: 'blue-jays', name: 'Blue Jays', color: '#0074D9', logo: '/src/assets/images/teams/blue-jays.png' },
  { id: 'green-gators', name: 'Green Gators', color: '#2ECC40', logo: '/src/assets/images/teams/green-gators.png' },
  { id: 'yellow-yaks', name: 'Yellow Yaks', color: '#FFDC00', logo: '/src/assets/images/teams/yellow-yaks.png' },
  { id: 'purple-pumas', name: 'Purple Pumas', color: '#B10DC9', logo: '/src/assets/images/teams/purple-pumas.png' },
  { id: 'orange-otters', name: 'Orange Otters', color: '#FF851B', logo: '/src/assets/images/teams/orange-otters.png' },
  { id: 'teal-turtles', name: 'Teal Turtles', color: '#39CCCC', logo: '/src/assets/images/teams/teal-turtles.png' },
  { id: 'pink-poodles', name: 'Pink Poodles', color: '#F012BE', logo: '/src/assets/images/teams/pink-poodles.png' },
  { id: 'black-bears', name: 'Black Bears', color: '#111111', logo: '/src/assets/images/teams/black-bears.png' },
  { id: 'white-wolves', name: 'White Wolves', color: '#FFFFFF', logo: '/src/assets/images/teams/white-wolves.png' },
  { id: 'gold-gorillas', name: 'Gold Gorillas', color: '#DAA520', logo: '/src/assets/images/teams/gold-gorillas.png' },
  { id: 'silver-sharks', name: 'Silver Sharks', color: '#C0C0C0', logo: '/src/assets/images/teams/silver-sharks.png' }
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
