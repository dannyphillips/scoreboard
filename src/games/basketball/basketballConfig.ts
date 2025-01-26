import { GameMode, ScoringAction, ScoringActionType } from '../../types';

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
    description: 'Classic pickup game to 11 points, win by 2',
    targetScore: 11,
    timeLimit: null,
    winBy: 2,
    maxPlayers: 6,
    allowSubstitutions: true,
  },
  FIRST_TO_21: {
    name: 'First to 21',
    description: 'Extended game to 21 points, win by 2',
    targetScore: 21,
    timeLimit: null,
    winBy: 2,
    maxPlayers: 10,
    allowSubstitutions: true,
  },
  TIMED_GAME: {
    name: '20 Minute Game',
    description: '20 minute game with running clock, highest score wins',
    targetScore: null,
    timeLimit: 1200,
    winBy: 1,
    maxPlayers: 10,
    allowSubstitutions: true,
  },
  TOURNAMENT: {
    name: 'Tournament Mode',
    description: '10 minute game or first to 21, win by 2',
    targetScore: 21,
    timeLimit: 600,
    winBy: 2,
    maxPlayers: 10,
    allowSubstitutions: true,
  }
};

export const SCORING_ACTIONS: Record<ScoringActionType, ScoringAction> = {
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
    color: 'bg-red-500',
    icon: 'warning',
  },
  ASSIST: {
    type: 'ASSIST',
    points: 0,
    color: 'bg-amber-500',
    icon: 'handshake',
  },
  REBOUND: {
    type: 'REBOUND',
    points: 0,
    color: 'bg-indigo-500',
    icon: 'replay',
  },
  BLOCK: {
    type: 'BLOCK',
    points: 0,
    color: 'bg-rose-500',
    icon: 'block',
  },
  STEAL: {
    type: 'STEAL',
    points: 0,
    color: 'bg-lime-500',
    icon: 'back_hand',
  }
}; 
