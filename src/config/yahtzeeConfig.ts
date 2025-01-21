import { YahtzeeCategoryConfig } from '../types/yahtzee';

const countMatching = (dice: number[], value: number) => 
  dice.filter(d => d === value).reduce((a, b) => a + b, 0);

const hasNOfAKind = (dice: number[], n: number) => {
  const counts = new Array(7).fill(0);
  dice.forEach(d => counts[d]++);
  return counts.some(count => count >= n);
};

const hasFullHouse = (dice: number[]) => {
  const counts = new Array(7).fill(0);
  dice.forEach(d => counts[d]++);
  return counts.includes(2) && counts.includes(3);
};

const hasStraight = (dice: number[], length: number) => {
  const unique = [...new Set(dice)].sort((a, b) => a - b);
  for (let i = 0; i <= unique.length - length; i++) {
    let isSequential = true;
    for (let j = 0; j < length - 1; j++) {
      if (unique[i + j + 1] !== unique[i + j] + 1) {
        isSequential = false;
        break;
      }
    }
    if (isSequential) return true;
  }
  return false;
};

export const YAHTZEE_CATEGORIES: Record<string, YahtzeeCategoryConfig> = {
  ones: {
    name: 'Ones',
    description: 'Sum of all ones',
    maxScore: 5,
    section: 'upper',
    calculatePossibleScores: (dice) => [countMatching(dice, 1)]
  },
  twos: {
    name: 'Twos',
    description: 'Sum of all twos',
    maxScore: 10,
    section: 'upper',
    calculatePossibleScores: (dice) => [countMatching(dice, 2)]
  },
  threes: {
    name: 'Threes',
    description: 'Sum of all threes',
    maxScore: 15,
    section: 'upper',
    calculatePossibleScores: (dice) => [countMatching(dice, 3)]
  },
  fours: {
    name: 'Fours',
    description: 'Sum of all fours',
    maxScore: 20,
    section: 'upper',
    calculatePossibleScores: (dice) => [countMatching(dice, 4)]
  },
  fives: {
    name: 'Fives',
    description: 'Sum of all fives',
    maxScore: 25,
    section: 'upper',
    calculatePossibleScores: (dice) => [countMatching(dice, 5)]
  },
  sixes: {
    name: 'Sixes',
    description: 'Sum of all sixes',
    maxScore: 30,
    section: 'upper',
    calculatePossibleScores: (dice) => [countMatching(dice, 6)]
  },
  threeOfAKind: {
    name: 'Three of a Kind',
    description: 'Sum of all dice if you have 3 of the same number',
    maxScore: 30,
    section: 'lower',
    calculatePossibleScores: (dice) => 
      hasNOfAKind(dice, 3) ? [dice.reduce((a, b) => a + b, 0)] : [0]
  },
  fourOfAKind: {
    name: 'Four of a Kind',
    description: 'Sum of all dice if you have 4 of the same number',
    maxScore: 30,
    section: 'lower',
    calculatePossibleScores: (dice) => 
      hasNOfAKind(dice, 4) ? [dice.reduce((a, b) => a + b, 0)] : [0]
  },
  fullHouse: {
    name: 'Full House',
    description: 'Three of one number and two of another',
    maxScore: 25,
    section: 'lower',
    calculatePossibleScores: (dice) => [hasFullHouse(dice) ? 25 : 0]
  },
  smallStraight: {
    name: 'Small Straight',
    description: 'Four sequential dice (1-2-3-4, 2-3-4-5, or 3-4-5-6)',
    maxScore: 30,
    section: 'lower',
    calculatePossibleScores: (dice) => [hasStraight(dice, 4) ? 30 : 0]
  },
  largeStraight: {
    name: 'Large Straight',
    description: 'Five sequential dice (1-2-3-4-5 or 2-3-4-5-6)',
    maxScore: 40,
    section: 'lower',
    calculatePossibleScores: (dice) => [hasStraight(dice, 5) ? 40 : 0]
  },
  yahtzee: {
    name: 'Yahtzee',
    description: 'Five of a kind',
    maxScore: 50,
    section: 'lower',
    calculatePossibleScores: (dice) => [hasNOfAKind(dice, 5) ? 50 : 0]
  },
  chance: {
    name: 'Chance',
    description: 'Sum of all dice',
    maxScore: 30,
    section: 'lower',
    calculatePossibleScores: (dice) => [dice.reduce((a, b) => a + b, 0)]
  }
};

export const YAHTZEE_COLORS = [
  '#FF4D00', // Orange
  '#00FFFF', // Cyan
  '#FFD700', // Gold
  '#FF00FF', // Magenta
  '#00FF00', // Lime
  '#FF1493', // Deep Pink
]; 
