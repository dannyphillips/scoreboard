import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Game } from '../types';
import GameCard from './GameCard';

function GameGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const gamesCollection = collection(db, 'games');
        const gamesSnapshot = await getDocs(gamesCollection);
        const gamesList = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Game[];
        setGames(gamesList);
      } catch (err) {
        setError('Failed to fetch games');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default GameGrid; 
