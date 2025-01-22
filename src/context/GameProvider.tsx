import React from 'react';
import { YahtzeeGameProvider } from '../games/yahtzee/YahtzeeContext';
import { BasketballGameProvider } from '../games/basketball/BasketballContext';

interface GameProviderProps {
  gameType: string;
  children: React.ReactNode;
}

export function GameProvider({ gameType, children }: GameProviderProps) {
  switch (gameType.toLowerCase()) {
    case 'yahtzee':
      return <YahtzeeGameProvider>{children}</YahtzeeGameProvider>;
    case 'basketball':
      return <BasketballGameProvider>{children}</BasketballGameProvider>;
    default:
      throw new Error(`Unsupported game type: ${gameType}`);
  }
} 
