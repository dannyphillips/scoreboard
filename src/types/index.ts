export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  scoreType: 'numeric' | 'points' | 'time';
  highScoreOrder: 'asc' | 'desc';
}

export interface Score {
  id: string;
  gameId: string;
  userId: string;
  value: number;
  timestamp: Date;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  createdAt?: Date;
}

export interface GameHistory {
  id: string;
  gameId: string;
  gameName: string;
  playerId: string;
  score: number;
  rank: number;
  playedAt: Date;
}

export interface PlayerStats {
  playerId: string;
  gameId: string;
  highScore: number;
  gamesPlayed: number;
  averageScore: number;
  lastPlayed: Date;
}

// Export basketball types
export * from './basketball';

// Export yahtzee types
export * from './yahtzee'; 
