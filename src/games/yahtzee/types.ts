export interface YahtzeePlayer {
  id: string;
  name: string;
  color: string;
}

export interface YahtzeeScore {
  ones?: number;
  twos?: number;
  threes?: number;
  fours?: number;
  fives?: number;
  sixes?: number;
  threeOfAKind?: number;
  fourOfAKind?: number;
  fullHouse?: number;
  smallStraight?: number;
  largeStraight?: number;
  yahtzee?: number;
  chance?: number;
  yahtzeeBonus?: number;
}

export interface YahtzeeGameState {
  players: YahtzeePlayer[];
  scores: Record<string, YahtzeeScore>;
  currentTurn: number;
  isGameStarted: boolean;
  isGameOver: boolean;
}

export type YahtzeeCategory = keyof YahtzeeScore;

export interface YahtzeeCategoryConfig {
  name: string;
  description: string;
  maxScore: number;
  section: 'upper' | 'lower';
} 
