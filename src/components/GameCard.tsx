import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Game } from '../types/games';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden h-full border border-scoreboard-light-wood/20 hover:shadow-2xl hover:shadow-scoreboard-light-sky/30 transition-all duration-300"
      >
        <div className="relative h-48">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-2xl font-display text-white drop-shadow-lg">
              {game.name}
            </h2>
          </div>
        </div>
        <div className="p-6">
          <p className="font-body text-scoreboard-light-tree leading-relaxed">
            {game.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
} 