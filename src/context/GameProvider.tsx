import React from 'react';
import { YahtzeeGameProvider } from '../games/yahtzee/YahtzeeContext';
import { BasketballGameProvider } from '../games/basketball/BasketballContext';
import { FootballGameProvider } from '../games/football/FootballContext';

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
    case 'football':
      return <FootballGameProvider>{children}</FootballGameProvider>;
    default:
      return <>{children}</>;
  }
} 
