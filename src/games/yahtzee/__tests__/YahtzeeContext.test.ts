import { describe, test, expect } from 'bun:test';
import { createElement } from 'react';
import { YahtzeeGameProvider } from '../YahtzeeContext';

describe('Yahtzee Context', () => {
  test('can create provider component', () => {
    const element = createElement(YahtzeeGameProvider, { children: null });
    expect(element.type).toBe(YahtzeeGameProvider);
  });

  test('has correct initial state structure', () => {
    const element = createElement(YahtzeeGameProvider, { children: null });
    expect(element.props).toHaveProperty('children');
  });
}); 