import { describe, test, expect } from 'bun:test';
import { createElement } from 'react';
import Yahtzee from '../Yahtzee';

describe('Yahtzee Game', () => {
  test('can create component', () => {
    const element = createElement(Yahtzee);
    expect(element.type).toBe(Yahtzee);
  });

  test('has correct display name', () => {
    expect(Yahtzee.name).toBe('Yahtzee');
  });
}); 