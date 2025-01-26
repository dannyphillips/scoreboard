export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  rules: string[];
  features: string[];
}

export interface BasePlayer {
  id: string;
  name: string;
  color: string;
}

export interface BaseGameState {
  isGameStarted: boolean;
  isGameOver: boolean;
  players: BasePlayer[];
} 
