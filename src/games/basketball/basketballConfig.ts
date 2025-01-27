import { GameMode, BasketballScoringActionType, ScoringAction } from '../../types';

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
    winBy: 2,
    maxPlayers: 5,
    allowSubstitutions: true,
  },
  FIRST_TO_21: {
    name: 'First to 21',
    description: 'Classic game to 21 points',
    targetScore: 21,
    timeLimit: null,
    winBy: 2,
    maxPlayers: 5,
    allowSubstitutions: true,
  },
  FIRST_TO_28: {
    name: 'First to 28',
    description: 'Extended game to 28 points',
    targetScore: 28,
    timeLimit: null,
    winBy: 2,
    maxPlayers: 5,
    allowSubstitutions: true,
  },
  FIRST_TO_35: {
    name: 'First to 35',
    description: 'Long game to 35 points',
    targetScore: 35,
    timeLimit: null,
    winBy: 2,
    maxPlayers: 5,
    allowSubstitutions: true,
  },
  TIMED_GAME: {
    name: '48 Minute Game',
    description: '48 minute game with running clock',
    targetScore: null,
    timeLimit: 2880,
    winBy: 1,
    maxPlayers: 5,
    allowSubstitutions: true,
  },
  TOURNAMENT: {
    name: 'Tournament Mode',
    description: '20 minute game or first to 35',
    targetScore: 35,
    timeLimit: 1200,
    winBy: 1,
    maxPlayers: 5,
    allowSubstitutions: true,
  }
};

export const SCORING_ACTIONS: Record<BasketballScoringActionType, ScoringAction> = {
  THREE_POINTER: {
    type: 'THREE_POINTER',
    points: 3,
    color: 'bg-emerald-500',
    icon: 'sports_basketball',
  },
  TWO_POINTER: {
    type: 'TWO_POINTER',
    points: 2,
    color: 'bg-sky-500',
    icon: 'sports_basketball',
  },
  FREE_THROW: {
    type: 'FREE_THROW',
    points: 1,
    color: 'bg-purple-500',
    icon: 'sports_basketball',
  },
  FOUL: {
    type: 'FOUL',
    points: 0,
    color: 'bg-yellow-500',
    icon: 'warning',
  },
  ASSIST: {
    type: 'ASSIST',
    points: 0,
    color: 'bg-blue-500',
    icon: 'handshake',
  },
  REBOUND: {
    type: 'REBOUND',
    points: 0,
    color: 'bg-orange-500',
    icon: 'refresh',
  },
  BLOCK: {
    type: 'BLOCK',
    points: 0,
    color: 'bg-red-500',
    icon: 'block',
  },
  STEAL: {
    type: 'STEAL',
    points: 0,
    color: 'bg-indigo-500',
    icon: 'swipe',
  },
  POINT_ADJUSTMENT: {
    type: 'POINT_ADJUSTMENT',
    points: -1,
    color: 'bg-red-500',
    icon: 'remove',
  }
}; 
