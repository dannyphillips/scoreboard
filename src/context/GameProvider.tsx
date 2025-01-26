import React from 'react';
import { YahtzeeGameProvider } from '../games/yahtzee/YahtzeeContext';
import { BasketballGameProvider } from '../games/basketball/BasketballContext';

interface GameProviderProps {
  gameId: string;
  children: React.ReactNode;
}

export default function GameProvider({ gameId, children }: GameProviderProps) {
  switch (gameId.toLowerCase()) {
    case 'yahtzee':
      return <YahtzeeGameProvider>{children}</YahtzeeGameProvider>;
    case 'basketball':
      return <BasketballGameProvider>{children}</BasketballGameProvider>;
    default:
      return <>{children}</>;
  }
} 
