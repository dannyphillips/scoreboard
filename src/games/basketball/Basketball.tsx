import { useBasketballGame } from './BasketballContext';
import SportsGame, { ScoringOption } from '../sports/SportsGame';
import { GAME_MODES } from './basketballConfig';
import GameSettings from './GameSettings';
import { ScoringActionType } from '../../types';
import { TEAM_PRESETS } from '../sports/teamPresets';

const BASKETBALL_SCORING_OPTIONS: ScoringOption[] = [
  { points: -1, label: '-1', action: 'POINT_ADJUSTMENT' },
  { points: 1, label: '+1', action: 'FREE_THROW' },
  { points: 2, label: '+2', action: 'TWO_POINTER' },
  { points: 3, label: '+3', action: 'THREE_POINTER' }
];

export default function Basketball() {
  const { state, dispatch } = useBasketballGame();

  const calculateScore = (points: number): ScoringActionType => {
    switch (points) {
      case -1: return 'POINT_ADJUSTMENT';
      case 1: return 'FREE_THROW';
      case 2: return 'TWO_POINTER';
      case 3: return 'THREE_POINTER';
      default: return 'POINT_ADJUSTMENT';
    }
  };

  const getFinalScore = () => {
    const gameMode = GAME_MODES[state.gameMode];
    return gameMode.targetScore;
  };

  const handleSettingsSave = (settings: any) => {
    dispatch({ 
      type: 'LOAD_GAME', 
      state: {
        ...state,
        homeTeam: settings.homeTeam,
        awayTeam: settings.awayTeam,
        timeRemaining: settings.timeLength,
        settings
      }
    });
  };

  return (
    <SportsGame
      state={state}
      dispatch={dispatch}
      scoringOptions={BASKETBALL_SCORING_OPTIONS}
      periodLabel="QUARTER"
      defaultTeamLogos={{
        home: '/images/teams/home-team.png',
        away: '/images/teams/away-team.png'
      }}
      calculateScore={calculateScore}
      GameSettings={GameSettings}
      settingsProps={{
        settings: {
          homeTeam: state.homeTeam,
          awayTeam: state.awayTeam,
          timeLength: state.timeRemaining ?? 900,
          finalScore: getFinalScore() ?? 21
        },
        onSave: handleSettingsSave,
        teamPresets: TEAM_PRESETS,
        timePresets: [
          { label: '12 min', value: 720 },
          { label: '15 min', value: 900 },
          { label: '20 min', value: 1200 }
        ],
        scorePresets: [
          { label: '11', value: 11 },
          { label: '21', value: 21 },
          { label: '35', value: 35 }
        ],
        sportName: 'Basketball',
        defaultLogo: TEAM_PRESETS[0].logo
      }}
      finalScore={getFinalScore()}
      scoreLabel="TARGET"
    />
  );
} 
