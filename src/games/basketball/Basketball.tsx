import { useBasketballGame } from './BasketballContext';
import Scoreboard from '../sports/Scoreboard';
import { GAME_MODES, SCORING_ACTIONS } from './basketballConfig';
import GameSettings from './GameSettings';
import { ScoringActionType } from '../../types';

const BASKETBALL_SCORING_OPTIONS = [
  { points: -1, label: '-1' },
  { points: 1, label: '+1' },
  { points: 2, label: '+2' },
  { points: 3, label: '+3' }
];

export default function Basketball() {
  const { state, dispatch } = useBasketballGame();

  const handleAddPoints = (team: 'home' | 'away', points: number) => {
    const teamSide = team === 'home' ? 'HOME' : 'AWAY';
    let action: ScoringActionType;
    
    if (points === -1) action = 'FOUL';
    else if (points === 1) action = 'FREE_THROW';
    else if (points === 2) action = 'TWO_POINTER';
    else if (points === 3) action = 'THREE_POINTER';
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
    const startTime = gameMode.timeLimit ?? state.timeRemaining ?? 300; // Default to 5 minutes
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
      scoringOptions={BASKETBALL_SCORING_OPTIONS}
      periodLabel="QUARTER"
      defaultTeamLogos={{
        home: '/images/teams/home-team.png',
        away: '/images/teams/away-team.png'
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
