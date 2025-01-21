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
