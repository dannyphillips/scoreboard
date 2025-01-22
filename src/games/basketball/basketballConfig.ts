import { GameMode, ScoringAction } from '../../types/basketball';

export const GAME_MODES: Record<GameMode, {
  name: string;
  description: string;
  targetScore: number;
  timeLimit: number | null; // in seconds, null for no time limit
  winBy: number; // points needed to win by
  maxPlayers: number;
  allowSubstitutions: boolean;
}> = {
  FIRST_TO_11: {
    name: 'First to 11',
    description: 'Classic pickup game to 11 points, win by 2',
    targetScore: 11,
    timeLimit: null,
    winBy: 2,
    maxPlayers: 6, // 3v3
    allowSubstitutions: true,
  },
  FIRST_TO_21: {
    name: 'First to 21',
    description: 'Extended game to 21 points, win by 2',
    targetScore: 21,
    timeLimit: null,
    winBy: 2,
    maxPlayers: 10, // 5v5
    allowSubstitutions: true,
  },
  TIMED_GAME: {
    name: '20 Minute Game',
    description: '20 minute game with running clock, highest score wins',
    targetScore: null,
    timeLimit: 1200, // 20 minutes in seconds
    winBy: 1,
    maxPlayers: 10, // 5v5
    allowSubstitutions: true,
  },
  TOURNAMENT: {
    name: 'Tournament Mode',
    description: '10 minute game or first to 21, win by 2',
    targetScore: 21,
    timeLimit: 600, // 10 minutes in seconds
    winBy: 2,
    maxPlayers: 10, // 5v5
    allowSubstitutions: true,
  }
};

export const SCORING_ACTIONS: Record<ScoringAction, {
  name: string;
  points: number;
  color: string; // Tailwind color class
  icon: string; // Material icon name
}> = {
  THREE_POINTER: {
    name: '3-Pointer',
    points: 3,
    color: 'bg-emerald-500',
    icon: 'sports_basketball',
  },
  TWO_POINTER: {
    name: '2-Pointer',
    points: 2,
    color: 'bg-sky-500',
    icon: 'sports_basketball',
  },
  FREE_THROW: {
    name: 'Free Throw',
    points: 1,
    color: 'bg-purple-500',
    icon: 'sports_basketball',
  },
  FOUL: {
    name: 'Foul',
    points: 0,
    color: 'bg-red-500',
    icon: 'warning',
  },
  ASSIST: {
    name: 'Assist',
    points: 0,
    color: 'bg-amber-500',
    icon: 'handshake',
  },
  REBOUND: {
    name: 'Rebound',
    points: 0,
    color: 'bg-indigo-500',
    icon: 'replay',
  },
  BLOCK: {
    name: 'Block',
    points: 0,
    color: 'bg-rose-500',
    icon: 'block',
  },
  STEAL: {
    name: 'Steal',
    points: 0,
    color: 'bg-lime-500',
    icon: 'back_hand',
  }
}; 
