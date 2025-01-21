import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { Game } from '../types';

function Games() {
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

  const renderGameCard = (game: Game) => (
    <Link to={`/games/${game.id}`}>
      <div className="w-72 h-96 bg-white dark:bg-scoreboard-dark-surface rounded-2xl shadow-lg hover:shadow-xl dark:shadow-neon transform hover:-translate-y-1 transition-all duration-200 overflow-hidden border-4 border-scoreboard-light-wood dark:border-scoreboard-dark-primary">
        <div className="relative h-48">
          <img 
            src={game.imageUrl} 
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="font-display dark:font-cyber text-2xl text-scoreboard-light-tree dark:text-scoreboard-dark-primary mb-2">
            {game.name}
          </h3>
          <p className="font-body text-gray-600 dark:text-gray-300 mb-3 h-20 overflow-hidden">
            {game.description}
          </p>
          <div className="inline-block bg-scoreboard-light-sky/20 dark:bg-scoreboard-dark-surface px-3 py-1 rounded-full">
            <span className="font-body dark:font-cyber text-sm text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
              Score Type: {game.scoreType}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display dark:font-cyber mb-8 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          Games
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-cyber text-gray-600 dark:text-gray-400">
            Loading games...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display dark:font-cyber mb-8 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
          Games
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-cyber text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-display dark:font-cyber mb-8 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
        Games
      </h1>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {renderGameCard(game)}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Games; 
