const getScore = (playerId: string, category: YahtzeeCategory): number | null => {
  if (!scores[playerId]) {
    return 0; // Return 0 for unplayed cells
  }
  // If the category exists in scores but is 0, it's a scratch
  if (category in scores[playerId] && scores[playerId][category] === 0) {
    return null; // Return null for scratched cells
  }
  // Return the score or 0 for unplayed cells
  return scores[playerId][category] ?? 0;
};

const renderScoreCell = (playerId: string, category: YahtzeeCategory) => {
  const isSelected = selectedCell?.playerId === playerId && selectedCell?.category === category;
  const currentScore = getScore(playerId, category);

  return (
    <td
      key={`${playerId}-${category}`}
      className="p-2 border dark:border-scoreboard-dark-primary text-center cursor-pointer hover:bg-scoreboard-dark-surface/10"
      onClick={() => setSelectedCell({ playerId, category })}
    >
      {isSelected ? (
        <div className="relative">
          <div className="absolute z-10 bg-white dark:bg-scoreboard-dark-surface shadow-lg rounded-lg p-2 -mt-20 max-h-48 overflow-y-auto">
            <div
              className="p-1 hover:bg-scoreboard-dark-primary/20 cursor-pointer border-b dark:border-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onScoreSelect(playerId, category, 0);
                setSelectedCell(null);
              }}
            >
              Scratch
            </div>
            {getPossibleScores(category)
              .filter(score => score !== 0) // Filter out 0 since we handle it as "Scratch"
              .map(score => (
                <div
                  key={score}
                  className="p-1 hover:bg-scoreboard-dark-primary/20 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onScoreSelect(playerId, category, score);
                    setSelectedCell(null);
                  }}
                >
                  {score}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <span className="font-cyber text-gray-700 dark:text-gray-300">
          {currentScore === null ? '/' : currentScore}
        </span>
      )}
    </td>
  );
}; 
