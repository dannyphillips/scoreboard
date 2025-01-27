import { describe, test, expect } from 'bun:test';
import { YAHTZEE_CATEGORIES } from '../yahtzeeConfig';

describe('Yahtzee Scoring', () => {
  describe('Upper Section', () => {
    test('Ones calculation', () => {
      const dice = [1, 1, 2, 3, 4];
      const score = YAHTZEE_CATEGORIES.ones.calculatePossibleScores(dice)[0];
      expect(score).toBe(2); // Two ones = 2 points
    });

    test('Sixes calculation', () => {
      const dice = [6, 6, 6, 3, 4];
      const score = YAHTZEE_CATEGORIES.sixes.calculatePossibleScores(dice)[0];
      expect(score).toBe(18); // Three sixes = 18 points
    });
  });

  describe('Lower Section', () => {
    test('Three of a kind calculation', () => {
      const dice = [2, 2, 2, 3, 4];
      const score = YAHTZEE_CATEGORIES.threeOfAKind.calculatePossibleScores(dice)[0];
      expect(score).toBe(13); // Sum of all dice: 2+2+2+3+4 = 13
    });

    test('Four of a kind calculation', () => {
      const dice = [5, 5, 5, 5, 2];
      const score = YAHTZEE_CATEGORIES.fourOfAKind.calculatePossibleScores(dice)[0];
      expect(score).toBe(22); // Sum of all dice: 5+5+5+5+2 = 22
    });

    test('Full house calculation', () => {
      const dice = [3, 3, 3, 4, 4];
      const score = YAHTZEE_CATEGORIES.fullHouse.calculatePossibleScores(dice)[0];
      expect(score).toBe(25); // Fixed score for full house
    });

    test('Small straight calculation', () => {
      const dice = [1, 2, 3, 4, 6];
      const score = YAHTZEE_CATEGORIES.smallStraight.calculatePossibleScores(dice)[0];
      expect(score).toBe(30); // Fixed score for small straight
    });

    test('Large straight calculation', () => {
      const dice = [1, 2, 3, 4, 5];
      const score = YAHTZEE_CATEGORIES.largeStraight.calculatePossibleScores(dice)[0];
      expect(score).toBe(40); // Fixed score for large straight
    });

    test('Yahtzee calculation', () => {
      const dice = [6, 6, 6, 6, 6];
      const score = YAHTZEE_CATEGORIES.yahtzee.calculatePossibleScores(dice)[0];
      expect(score).toBe(50); // Fixed score for yahtzee
    });

    test('Chance calculation', () => {
      const dice = [1, 2, 3, 4, 5];
      const score = YAHTZEE_CATEGORIES.chance.calculatePossibleScores(dice)[0];
      expect(score).toBe(15); // Sum of all dice: 1+2+3+4+5 = 15
    });
  });

  describe('Edge Cases', () => {
    test('No valid score for yahtzee', () => {
      const dice = [1, 1, 1, 1, 2];
      const score = YAHTZEE_CATEGORIES.yahtzee.calculatePossibleScores(dice)[0];
      expect(score).toBe(0);
    });

    test('No valid score for full house', () => {
      const dice = [1, 1, 1, 1, 2];
      const score = YAHTZEE_CATEGORIES.fullHouse.calculatePossibleScores(dice)[0];
      expect(score).toBe(0);
    });
  });
}); 