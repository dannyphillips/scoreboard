import React from 'react';
import GameGrid from '../components/GameGrid';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-5xl text-scoreboard-tree">
          Pick a Game!
        </h1>
        {/* We'll add a create game button here later */}
      </div>
      <GameGrid />
    </div>
  );
}

export default Home; 
