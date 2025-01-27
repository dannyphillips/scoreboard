import { GameMode, FootballScoringActionType, ScoringAction } from '../../types';

export const GAME_MODES: Record<GameMode, {
  name: string;
  description: string;
  targetScore: number | null;
  timeLimit: number | null;
  winBy: number;
  maxPlayers: number;
  allowSubstitutions: boolean;
}> = {
  FIRST_TO_11: {
    name: 'First to 11',
    description: 'Quick game to 11 points',
    targetScore: 11,
    timeLimit: null,
    winBy: 1,
    maxPlayers: 11,
    allowSubstitutions: true,
  },
  FIRST_TO_21: {
    name: 'First to 21',
    description: 'Classic game to 21 points',
    targetScore: 21,
    timeLimit: null,
    winBy: 1,
    maxPlayers: 11,
    allowSubstitutions: true,
  },
  FIRST_TO_28: {
    name: 'First to 28',
    description: 'Extended game to 28 points',
    targetScore: 28,
    timeLimit: null,
    winBy: 1,
    maxPlayers: 11,
    allowSubstitutions: true,
  },
  FIRST_TO_35: {
    name: 'First to 35',
    description: 'Long game to 35 points',
    targetScore: 35,
    timeLimit: null,
    winBy: 1,
    maxPlayers: 11,
    allowSubstitutions: true,
  },
  TIMED_GAME: {
    name: '60 Minute Game',
    description: '60 minute game with running clock',
    targetScore: null,
    timeLimit: 3600,
    winBy: 1,
    maxPlayers: 11,
    allowSubstitutions: true,
  },
  TOURNAMENT: {
    name: 'Tournament Mode',
    description: '30 minute game or first to 35',
    targetScore: 35,
    timeLimit: 1800,
    winBy: 1,
    maxPlayers: 11,
    allowSubstitutions: true,
  }
};

export const SCORING_ACTIONS: Record<FootballScoringActionType, ScoringAction> = {
  TOUCHDOWN: {
    type: 'TOUCHDOWN',
    points: 6,
    color: 'bg-emerald-500',
    icon: 'sports_football',
  },
  FIELD_GOAL: {
    type: 'FIELD_GOAL',
    points: 3,
    color: 'bg-sky-500',
    icon: 'sports_football',
  },
  EXTRA_POINT: {
    type: 'EXTRA_POINT',
    points: 1,
    color: 'bg-purple-500',
    icon: 'sports_football',
  },
  POINT_ADJUSTMENT: {
    type: 'POINT_ADJUSTMENT',
    points: -1,
    color: 'bg-red-500',
    icon: 'remove',
  }
}; 