import GameGrid from '../components/GameGrid';

function Games() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-display dark:font-cyber mb-8 text-scoreboard-light-tree dark:text-scoreboard-dark-primary">
        Games
      </h1>
      <GameGrid />
    </div>
  );
}

export default Games; 
