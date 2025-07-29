// Score Management Type Definitions
// Following Interface Segregation Principle

export interface Score {
  id: string;
  value: number;
  timestamp: number;
  playerName?: string; // Future enhancement for player names
}

export interface ScoreStats {
  highestScore: number;
  averageScore: number;
  totalGames: number;
  lastPlayed: number;
}

// Repository Pattern Interface
export interface IScoreRepository {
  saveScore(score: number): Promise<void>;
  getTopScores(limit?: number): Promise<Score[]>;
  getHighestScore(): Promise<number>;
  getScoreStats(): Promise<ScoreStats>;
  clearAllScores(): Promise<void>;
}

// Service Layer Interface
export interface IScoreService {
  addScore(score: number): Promise<boolean>; // Returns true if it's a new high score
  getTopScores(limit?: number): Promise<Score[]>;
  getHighestScore(): Promise<number>;
  getNextTargetScore(currentScore: number): Promise<number>;
  isNewHighScore(score: number): Promise<boolean>;
  getScoreStats(): Promise<ScoreStats>;
  clearAllScores(): Promise<void>;
}

// Context State Interface
export interface ScoreContextState {
  topScores: Score[];
  highestScore: number;
  scoreStats: ScoreStats | null;
  isLoading: boolean;
  error: string | null;
}

// Context Actions Interface
export interface ScoreContextActions {
  addScore: (score: number) => Promise<boolean>;
  refreshScores: () => Promise<void>;
  clearScores: () => Promise<void>;
  getNextTargetScore: (currentScore: number) => number;
  forceRefreshData: () => Promise<void>;
}

// Combined Context Type
export interface ScoreContextType extends ScoreContextState, ScoreContextActions {}

// Storage Keys (Constants)
export const STORAGE_KEYS = {
  TOP_SCORES: '@dino_dash_top_scores',
  HIGHEST_SCORE: '@dino_dash_highest_score',
  SCORE_STATS: '@dino_dash_score_stats',
} as const;

// Game Constants
export const SCORE_CONSTANTS = {
  MAX_TOP_SCORES: 5,
  SCORE_CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MIN_SCORE_TO_SAVE: 1, // Don't save scores below this threshold
} as const;

// Performance Optimization Types
export interface ScoreCache {
  data: Score[];
  timestamp: number;
  isValid: boolean;
}

export interface PerformanceMetrics {
  saveTime: number;
  loadTime: number;
  cacheHitRate: number;
} 