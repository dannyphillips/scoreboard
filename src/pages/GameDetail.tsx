import React from 'react';
import { useParams } from 'react-router-dom';

function GameDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Game Details</h1>
      {/* We'll add game details and scoring interface here */}
    </div>
  );
}

export default GameDetail; 
