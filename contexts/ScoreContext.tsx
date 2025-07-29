import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { asyncStorageService } from '../services/AsyncStorageService';
import { scoreService } from '../services/ScoreService';
import { Score, ScoreContextState, ScoreContextType } from '../services/types';

// Initial state
const initialState: ScoreContextState = {
  topScores: [],
  highestScore: 0,
  scoreStats: null,
  isLoading: false,
  error: null,
};

// Action types for reducer
type ScoreAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TOP_SCORES'; payload: Score[] }
  | { type: 'SET_HIGHEST_SCORE'; payload: number }
  | { type: 'SET_SCORE_STATS'; payload: any }
  | { type: 'ADD_SCORE'; payload: Score }
  | { type: 'CLEAR_SCORES' };

// Reducer function for state management
function scoreReducer(state: ScoreContextState, action: ScoreAction): ScoreContextState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_TOP_SCORES':
      return { ...state, topScores: action.payload };
    
    case 'SET_HIGHEST_SCORE':
      return { ...state, highestScore: action.payload };
    
    case 'SET_SCORE_STATS':
      return { ...state, scoreStats: action.payload };
    
    case 'ADD_SCORE':
      const updatedScores = [...state.topScores, action.payload]
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Keep only top 5
      return { 
        ...state, 
        topScores: updatedScores,
        highestScore: Math.max(state.highestScore, action.payload.value)
      };
    
    case 'CLEAR_SCORES':
      return {
        ...state,
        topScores: [],
        highestScore: 0,
        scoreStats: null,
      };
    
    default:
      return state;
  }
}

// Create context
const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

// Provider component
interface ScoreProviderProps {
  children: ReactNode;
}

export const ScoreProvider: React.FC<ScoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(scoreReducer, initialState);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Force refresh data (useful for debugging platform differences)
  const forceRefreshData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Clear cache and force refresh
      await asyncStorageService.forceRefresh();
      
      // Load data in parallel for better performance
      const [topScores, highestScore, scoreStats] = await Promise.all([
        scoreService.getTopScores(),
        scoreService.getHighestScore(),
        scoreService.getScoreStats(),
      ]);

      dispatch({ type: 'SET_TOP_SCORES', payload: topScores });
      dispatch({ type: 'SET_HIGHEST_SCORE', payload: highestScore });
      dispatch({ type: 'SET_SCORE_STATS', payload: scoreStats });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error force refreshing data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh scores' });
    }
  };

  // Load initial scores and stats
  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load data in parallel for better performance
      const [topScores, highestScore, scoreStats] = await Promise.all([
        scoreService.getTopScores(),
        scoreService.getHighestScore(),
        scoreService.getScoreStats(),
      ]);

      dispatch({ type: 'SET_TOP_SCORES', payload: topScores });
      dispatch({ type: 'SET_HIGHEST_SCORE', payload: highestScore });
      dispatch({ type: 'SET_SCORE_STATS', payload: scoreStats });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error loading initial score data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load scores' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add a new score
  const addScore = async (score: number): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const isNewHighScore = await scoreService.addScore(score);
      
      // Always refresh scores after game over to ensure we have latest data
      await refreshScores();
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return isNewHighScore;
    } catch (error) {
      console.error('Error adding score:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save score' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  // Refresh all score data
  const refreshScores = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [topScores, highestScore, scoreStats] = await Promise.all([
        scoreService.getTopScores(),
        scoreService.getHighestScore(),
        scoreService.getScoreStats(),
      ]);

      dispatch({ type: 'SET_TOP_SCORES', payload: topScores });
      dispatch({ type: 'SET_HIGHEST_SCORE', payload: highestScore });
      dispatch({ type: 'SET_SCORE_STATS', payload: scoreStats });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error refreshing scores:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh scores' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear all scores
  const clearScores = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await scoreService.clearAllScores();
      dispatch({ type: 'CLEAR_SCORES' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error clearing scores:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear scores' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get next target score (synchronous for performance)
  const getNextTargetScore = (currentScore: number): number => {
    // If no scores exist, target the current score
    if (state.topScores.length === 0) {
      return currentScore;
    }

    // Find the next score to beat (iterate from lowest to highest)
    for (const score of state.topScores.slice().reverse()) {
      if (currentScore < score.value) {
        return score.value;
      }
    }

    // If current score is higher than all top scores, target the current score
    return currentScore;
  };

  // Context value
  const contextValue: ScoreContextType = {
    ...state,
    addScore,
    refreshScores,
    clearScores,
    getNextTargetScore,
    forceRefreshData,
  };

  return (
    <ScoreContext.Provider value={contextValue}>
      {children}
    </ScoreContext.Provider>
  );
};

// Custom hook to use the score context
export const useScoreContext = (): ScoreContextType => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScoreContext must be used within a ScoreProvider');
  }
  return context;
};

// Performance monitoring hook
export const useScorePerformance = () => {
  const getPerformanceMetrics = () => {
    return scoreService.getPerformanceMetrics();
  };

  const resetPerformanceMetrics = () => {
    scoreService.resetPerformanceMetrics();
  };

  const getCacheStats = () => {
    return scoreService.getCacheStats();
  };

  const clearCache = () => {
    scoreService.clearCache();
  };

  return {
    getPerformanceMetrics,
    resetPerformanceMetrics,
    getCacheStats,
    clearCache,
  };
}; 