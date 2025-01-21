export interface YahtzeePlayer {
  id: string;
  name: string;
  color: string;
}

export interface YahtzeeScore {
  playerId: string;
  category: YahtzeeCategory;
  value: number | null;
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
  | 'chance';

export interface YahtzeeCategoryConfig {
  name: string;
  description: string;
  maxScore: number;
  section: 'upper' | 'lower';
  calculatePossibleScores: (dice: number[]) => number[];
} 
