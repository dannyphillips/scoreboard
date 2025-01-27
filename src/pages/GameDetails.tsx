import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../data/games';

export default function GameDetails() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = gameId ? GAMES[gameId] : null;

  if (!game) {
    return (
      <div className="flex items-center justify-center bg-gray-900 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Game not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Cover Photo */}
        <div className="relative">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-[500px] object-cover rounded-xl"
          />
          <button
            onClick={() => navigate(`/games/${gameId}/play`)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Start Playing
          </button>
        </div>

        {/* Right Column - Game Info */}
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
          <p className="text-gray-300 text-lg mb-8">{game.description}</p>
          
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Rules</h2>
            <ul className="list-disc list-inside space-y-2">
              {game.rules.map((rule: string, index: number) => (
                <li key={index} className="text-gray-300">{rule}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              {game.features.map((feature: string, index: number) => (
                <li key={index} className="text-gray-300">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
