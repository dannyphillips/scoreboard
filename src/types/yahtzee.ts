export interface YahtzeePlayer {
  id: string;
  name: string;
  color: string;
}

export type YahtzeeCategory = 
  | 'ones' 
  | 'twos' 
  | 'threes' 
  | 'fours' 
  | 'fives' 
  | 'sixes'
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yahtzee'
  | 'chance'
  | 'yahtzeeBonus';

export interface YahtzeeCategoryConfig {
  name: string;
  description: string;
  maxScore: number;
  section: 'upper' | 'lower';
  calculatePossibleScores: (dice: number[]) => number[];
}

export interface YahtzeeScore {
  playerId: string;
  category: YahtzeeCategory;
  value: number;
}

export interface YahtzeeGameState {
  players: YahtzeePlayer[];
  scores: Record<string, Record<YahtzeeCategory, number>>;
  currentTurn: number;
  gameStarted: boolean;
  isGameOver: boolean;
  dice: number[];
} 
