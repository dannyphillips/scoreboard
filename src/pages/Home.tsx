import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Game } from '../games/types';

const GAMES: Game[] = [
  {
    id: 'yahtzee',
    name: 'Yahtzee',
    description: 'A classic dice game of luck and strategy',
    image: '/images/games/yahtzee-card.jpg',
    rules: [
      'Roll five dice up to three times per turn',
      'Score points by matching specific combinations',
      'Fill all categories to complete the game'
    ],
    features: [
      'Multiple players support',
      'Automatic scoring calculation',
      'Score history tracking'
    ]
  },
  {
    id: 'basketball',
    name: 'Basketball',
    description: 'Track basketball game scores and stats',
    image: '/images/games/basketball-card.jpg',
    rules: [
      'Add points for field goals and free throws',
      'Track fouls and timeouts',
      'Manage player substitutions'
    ],
    features: [
      'Real-time scoring',
      'Player rotation management',
      'Team statistics'
    ]
  },
];

function GameCard({ game }: { game: Game }) {
  return (
    <Link to={`/games/${game.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden h-full border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
      >
        <div className="relative h-48">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {game.name}
            </h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {game.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

function Home() {
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
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </motion.div>
    </div>
  );
}

export default Home; 
