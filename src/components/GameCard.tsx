import { Link } from 'react-router-dom';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  return (
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
}

export default GameCard; 
