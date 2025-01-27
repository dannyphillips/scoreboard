import { describe, test, expect } from 'bun:test';
import { createElement } from 'react';
import Basketball from '../Basketball';

describe('Basketball Game', () => {
  test('can create component', () => {
    const element = createElement(Basketball);
    expect(element.type).toBe(Basketball);
  });

  test('has correct display name', () => {
    expect(Basketball.name).toBe('Basketball');
  });
}); 