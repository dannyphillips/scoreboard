import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import GameProvider from '../context/GameProvider';
import Yahtzee from '../games/yahtzee';
import Basketball from '../games/basketball';

// Map of game IDs to their components
const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  yahtzee: Yahtzee,
  basketball: Basketball,
};

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();

  if (!gameId || !GAME_COMPONENTS[gameId.toLowerCase()]) {
    return <Navigate to="/" replace />;
  }

  const GameComponent = GAME_COMPONENTS[gameId.toLowerCase()];

  return (
    <GameProvider gameId={gameId}>
      <GameComponent />
    </GameProvider>
  );
} 
