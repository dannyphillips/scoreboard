import { describe, test, expect } from 'bun:test';
import { GAME_MODES, SCORING_ACTIONS } from '../basketballConfig';

describe('Basketball Config', () => {
  test('has correct game modes', () => {
    expect(GAME_MODES.FIRST_TO_21.targetScore).toBe(21);
    expect(GAME_MODES.FIRST_TO_11.targetScore).toBe(11);
    expect(GAME_MODES.TIMED_GAME.timeLimit).toBe(1200);
    expect(GAME_MODES.TOURNAMENT.timeLimit).toBe(600);
  });

  test('has correct scoring actions', () => {
    expect(SCORING_ACTIONS.THREE_POINTER.points).toBe(3);
    expect(SCORING_ACTIONS.TWO_POINTER.points).toBe(2);
    expect(SCORING_ACTIONS.FREE_THROW.points).toBe(1);
  });
}); 