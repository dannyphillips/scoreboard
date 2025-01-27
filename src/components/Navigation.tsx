import { Link } from 'react-router-dom';
import { getImagePath } from '../utils';

function Navigation() {
  return (
    <nav className="transition-all duration-300 bg-scoreboard-light-sky/90 backdrop-blur-sm shadow-lg border-b border-scoreboard-light-wood/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={getImagePath('/images/logo-light.png')}
              alt="Scoreboard" 
              className="w-14 h-14 drop-shadow-md transform group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-3xl text-scoreboard-light-tree uppercase tracking-wider transform group-hover:scale-105 transition-transform">
              Scoreboard
            </span>
          </Link>
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="font-display text-lg text-scoreboard-light-tree hover:text-scoreboard-light-wood transition-all tracking-wide hover:scale-105 transform"
            >
              GAMES
            </Link>
            <Link 
              to="/players" 
              className="font-display text-lg text-scoreboard-light-tree hover:text-scoreboard-light-wood transition-all tracking-wide hover:scale-105 transform"
            >
              PLAYERS
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 
