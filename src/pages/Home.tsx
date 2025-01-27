import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import { GAMES } from '../data/games';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white"
      >
        Available Games
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {Object.values(GAMES).map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </motion.div>
    </div>
  );
} 
