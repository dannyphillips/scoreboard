import { useFootballGame, FootballGameState, FootballGameAction } from './FootballContext';
import SportsGame from '../sports/SportsGame';
import { ScoringActionType } from '../../types';
import { TIME_PRESETS, SCORE_PRESETS } from './types';
import GameSettings from './GameSettings';
import { ScoringOption } from '../sports/SportsGame';
import { TEAM_PRESETS } from '../sports/teamPresets';
import { FootballGameSettings } from './types';

const DEFAULT_TARGET_SCORE = 21;

const FOOTBALL_SCORING_OPTIONS: ScoringOption[] = [
  { points: -1, label: '-1', action: 'POINT_ADJUSTMENT' },
  { points: 1, label: '+1', action: 'EXTRA_POINT' },
  { points: 3, label: '+3', action: 'FIELD_GOAL' },
  { points: 6, label: '+6', action: 'TOUCHDOWN' }
];

const calculateScore = (points: number): ScoringActionType => {
  switch (points) {
    case -1: return 'POINT_ADJUSTMENT';
    case 1: return 'EXTRA_POINT';
    case 3: return 'FIELD_GOAL';
    case 6: return 'TOUCHDOWN';
    default: return 'POINT_ADJUSTMENT';
  }
};

const getGameModeForScore = (score: number): FootballGameState['gameMode'] => {
  switch (score) {
    case 21: return 'FIRST_TO_21';
    case 28: return 'FIRST_TO_28';
    case 35: return 'FIRST_TO_35';
    default: return 'FIRST_TO_21';
  }
};

export default function Football() {
  const { state, dispatch } = useFootballGame();

  const getTeamPreset = (teamId: string) => {
    return TEAM_PRESETS.find(preset => preset.id === teamId) || TEAM_PRESETS[0];
  };

  const homeTeamPreset = getTeamPreset(state.homeTeam.id);
  const awayTeamPreset = getTeamPreset(state.awayTeam.id);

  const handleSettingsSave = (settings: FootballGameSettings) => {
    const targetScore = settings.finalScore ?? DEFAULT_TARGET_SCORE;
    const newState = {
      ...state,
      gameMode: getGameModeForScore(targetScore),
      targetScore,
      settings: {
        ...settings,
        finalScore: targetScore
      },
      timeRemaining: settings.timeLength,
      homeTeam: {
        ...settings.homeTeam,
        score: 0,
        timeouts: 3
      },
      awayTeam: {
        ...settings.awayTeam,
        score: 0,
        timeouts: 3
      },
      isPaused: true,
      isGameOver: false
    } as FootballGameState;

    console.log('New state to be dispatched:', newState);
    dispatch({ type: 'LOAD_GAME', state: newState });
  };

  return (
    <SportsGame<FootballGameState, FootballGameAction>
      state={state}
      dispatch={dispatch}
      scoringOptions={FOOTBALL_SCORING_OPTIONS}
      periodLabel="QUARTER"
      defaultTeamLogos={{
        home: homeTeamPreset.logo,
        away: awayTeamPreset.logo
      }}
      calculateScore={calculateScore}
      GameSettings={GameSettings}
      settingsProps={{
        settings: {
          homeTeam: state.homeTeam,
          awayTeam: state.awayTeam,
          timeLength: state.timeRemaining ?? 900,
          finalScore: state.targetScore
        },
        onSave: handleSettingsSave,
        teamPresets: TEAM_PRESETS,
        timePresets: TIME_PRESETS,
        scorePresets: SCORE_PRESETS,
        sportName: 'Football',
        defaultLogo: TEAM_PRESETS[0].logo
      }}
      finalScore={state.targetScore}
      scoreLabel="TARGET"
    />
  );
} 