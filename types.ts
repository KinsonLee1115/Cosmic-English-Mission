export interface WordPuzzle {
  id: string;
  word: string;      // Complete word, e.g., "SHEEP"
  missing: string;   // The missing part, e.g., "SH"
  display: string;   // The display with placeholder, e.g., "_ _ E E P"
  options: string[]; // Options to choose from, e.g., ["SH", "CH", "TH", "WH"]
  imagePrompt?: string; // For generating image alt text or searching
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  SUCCESS = 'SUCCESS', // Level completed
  GAME_OVER = 'GAME_OVER', // All levels done
  LOADING = 'LOADING',
  STICKER_BOOK = 'STICKER_BOOK', // New state for the sticker collection screen
}

export enum BridgeState {
  BROKEN = 'BROKEN',
  FIXING = 'FIXING',
  FIXED = 'FIXED',
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export type CollectedStickers = {
  [word: string]: { 
    collected: true; 
    category: string; 
    difficulty: Difficulty;
    imagePrompt?: string;
  };
};