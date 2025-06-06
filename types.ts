export interface Song {
  id: number;
  title: string;
  anime: string;
  url: string;
  imageUrl: string;
  choices: string[];
}

export interface GameState {
  currentSongIndex: number;
  score: number;
  isGameOver: boolean;
  lastCorrectAnswer: string | null;
}
