import React from 'react';
import { SportsGameState, SportsGameAction, Team } from './SportsGameContext';
import Scoreboard from './Scoreboard';
import { ScoringActionType } from '../../types';
import { GameSettings } from './SportsGameSettings';

export interface ScoringOption {
  points: number;
  label: string;
  action: ScoringActionType;
}

interface SportsGameProps<T extends SportsGameState, A extends SportsGameAction> {
  state: T;
  dispatch: React.Dispatch<A>;
  scoringOptions: ScoringOption[];
  periodLabel: string;
  defaultTeamLogos: {
    home: string;
    away: string;
  };
  calculateScore: (points: number) => ScoringActionType;
  GameSettings: React.ComponentType<any>;
  settingsProps: any;
  finalScore: number | null;
  scoreLabel?: string;
}

export default function SportsGame<T extends SportsGameState, A extends SportsGameAction>({
  state,
  dispatch,
  scoringOptions,
  periodLabel,
  defaultTeamLogos,
  calculateScore,
  GameSettings,
  settingsProps,
  finalScore,
  scoreLabel = 'GOAL'
}: SportsGameProps<T, A>) {
  const handleAddPoints = (team: 'home' | 'away', points: number) => {
    const teamSide = team === 'home' ? 'HOME' : 'AWAY';
    const action = calculateScore(points);
    
    dispatch({
      type: 'RECORD_ACTION',
      event: {
        teamSide,
        playerId: state[team === 'home' ? 'homeTeam' : 'awayTeam'].players[0]?.id || '',
        action
      }
    } as A);
  };

  const handleAddTime = (seconds: number) => {
    if (state.timeRemaining !== null) {
      const newTime = Math.max(0, state.timeRemaining + seconds);
      dispatch({ type: 'UPDATE_TIME', time: newTime } as A);
    }
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_GAME' } as A);
  };

  const handleResume = () => {
    dispatch({ type: 'RESUME_GAME' } as A);
  };

  const handleShowSettings = () => {
    dispatch({ type: 'RESET_GAME' } as A);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' } as A);
  };

  const getWinner = () => {
    if (!state.isGameOver) return null;
    return state.homeTeam.score > state.awayTeam.score ? state.homeTeam : state.awayTeam;
  };

  if (!state.isGameStarted) {
    return (
      <GameSettings
        {...settingsProps}
        onSave={(settings: GameSettings) => {
          dispatch({ 
            type: 'LOAD_GAME', 
            state: {
              ...state,
              homeTeam: settings.homeTeam as Team,
              awayTeam: settings.awayTeam as Team,
              timeRemaining: settings.timeLength,
            }
          } as A)
        }}
        onStart={() => dispatch({ type: 'START_GAME', gameMode: state.gameMode } as A)}
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
      finalScore={finalScore}
      winner={getWinner()}
      scoringOptions={scoringOptions}
      periodLabel={periodLabel}
      defaultTeamLogos={defaultTeamLogos}
      onPause={handlePause}
      onResume={handleResume}
      onAddPoints={handleAddPoints}
      onAddTime={handleAddTime}
      onShowSettings={handleShowSettings}
      onReset={handleReset}
      scoreLabel={scoreLabel}
    />
  );
} 