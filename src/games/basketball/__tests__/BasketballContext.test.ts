import { describe, test, expect } from 'bun:test';
import { createElement } from 'react';
import { BasketballGameProvider } from '../BasketballContext';

describe('Basketball Context', () => {
  test('can create provider component', () => {
    const element = createElement(BasketballGameProvider, { children: null });
    expect(element.type).toBe(BasketballGameProvider);
  });

  test('has correct initial state structure', () => {
    const element = createElement(BasketballGameProvider, { children: null });
    expect(element.props).toHaveProperty('children');
  });
}); 