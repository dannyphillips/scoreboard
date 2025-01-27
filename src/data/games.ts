import { Game } from '../types/games';

export const GAMES: Record<string, Game> = {
  yahtzee: {
    id: 'yahtzee',
    name: "Shake N' Score",
    description: 'A thrilling dice game where strategy meets luck',
    image: '/images/games/yahtzee-card.jpg',
    rules: [
      'Roll five dice up to three times per turn',
      'Score points by matching specific combinations',
      'Fill all categories to complete the game',
      'Bonus points for scoring 63+ in the upper section',
      'Extra points for additional five-of-a-kind after the first'
    ],
    features: [
      'Multiple players support',
      'Automatic scoring calculation',
      'Score history tracking',
      'Player statistics',
      'Dark mode support'
    ]
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    description: 'Track basketball game scores and stats',
    image: '/images/games/basketball-card.jpg',
    rules: [
      'Add points for field goals, three-pointers, and free throws',
      'Track fouls and timeouts',
      'Manage player substitutions',
      'Monitor game clock and shot clock',
      'Record player statistics'
    ],
    features: [
      'Real-time scoring',
      'Player rotation management',
      'Team statistics',
      'Game clock with automatic timeouts',
      'Dark mode support'
    ]
  },
  football: {
    id: 'football',
    name: 'Football',
    description: 'Track football game scores with touchdowns, field goals, and more',
    image: '/images/games/football-card.jpg',
    rules: [
      'Score touchdowns (6 points)',
      'Kick field goals (3 points)',
      'Convert extra points (1 point)',
      'Track timeouts and possession',
      'Monitor game clock and quarters'
    ],
    features: [
      'Real-time scoring',
      'Team management',
      'Game clock with quarters',
      'Timeout tracking',
      'Dark mode support'
    ]
  }
}; 