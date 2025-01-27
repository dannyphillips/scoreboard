import { useFootballGame } from './FootballContext';
import Scoreboard from '../../components/Scoreboard';
import { GAME_MODES } from './footballConfig';
import GameSettings from './GameSettings';
import { ScoringActionType } from '../../types';

const FOOTBALL_SCORING_OPTIONS = [
  { points: -1, label: '-1' }, // Point adjustment
  { points: 1, label: '+1' },  // Extra point
  { points: 3, label: '+3' },  // Field goal
  { points: 6, label: '+6' }   // Touchdown
];

export default function Football() {
  const { state, dispatch } = useFootballGame();

  const handleAddPoints = (team: 'home' | 'away', points: number) => {
    const teamSide = team === 'home' ? 'HOME' : 'AWAY';
    let action: ScoringActionType;
    
    if (points === -1) action = 'POINT_ADJUSTMENT';
    else if (points === 1) action = 'EXTRA_POINT';
    else if (points === 3) action = 'FIELD_GOAL';
    else if (points === 6) action = 'TOUCHDOWN';
    else return; // Invalid points value
    
    dispatch({ 
      type: 'RECORD_ACTION', 
      event: {
        teamSide,
        playerId: state[team === 'home' ? 'homeTeam' : 'awayTeam'].players[0]?.id || '',
        action
      }
    });
  };

  const handleAddTime = (seconds: number) => {
    if (state.timeRemaining !== null) {
      const newTime = Math.max(0, state.timeRemaining + seconds);
      dispatch({ type: 'UPDATE_TIME', time: newTime });
    }
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_GAME' });
  };

  const handleResume = () => {
    dispatch({ type: 'RESUME_GAME' });
  };

  const handleShowSettings = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const getFinalScore = () => {
    const gameMode = GAME_MODES[state.gameMode];
    return gameMode.targetScore;
  };

  const getWinner = () => {
    if (!state.isGameOver) return null;
    return state.homeTeam.score > state.awayTeam.score ? state.homeTeam : state.awayTeam;
  };

  const handleStartGame = () => {
    const gameMode = GAME_MODES[state.gameMode];
    const startTime = gameMode.timeLimit ?? state.timeRemaining ?? 900; // Default to 15 minutes
    dispatch({ type: 'UPDATE_TIME', time: startTime });
    dispatch({ type: 'START_GAME', gameMode: state.gameMode });
  };

  if (!state.isGameStarted) {
    return (
      <GameSettings 
        settings={{
          homeTeam: state.homeTeam,
          awayTeam: state.awayTeam,
          timeLength: state.timeRemaining ?? 0,
          finalScore: getFinalScore() ?? 0
        }}
        onSave={(settings) => {
          // Handle settings update if needed
          handleStartGame();
        }}
        onStart={handleStartGame}
        isStarted={state.isGameStarted}
      />
    );
  }

  return (
    <Scoreboard
      homeTeam={{
        id: state.homeTeam.id,
        name: state.homeTeam.name,
        color: state.homeTeam.color,
        score: state.homeTeam.score
      }}
      awayTeam={{
        id: state.awayTeam.id,
        name: state.awayTeam.name,
        color: state.awayTeam.color,
        score: state.awayTeam.score
      }}
      timeRemaining={state.timeRemaining ?? 0}
      isPaused={state.isPaused}
      finalScore={getFinalScore()}
      winner={getWinner()}
      scoringOptions={FOOTBALL_SCORING_OPTIONS}
      periodLabel="QUARTER"
      defaultTeamLogos={{
        home: '/images/football.png',
        away: '/images/football.png'
      }}
      onPause={handlePause}
      onResume={handleResume}
      onAddPoints={handleAddPoints}
      onAddTime={handleAddTime}
      onShowSettings={handleShowSettings}
      onReset={handleReset}
    />
  );
} 