import { asyncStorageService } from './AsyncStorageService';
import {
    IScoreService,
    PerformanceMetrics,
    Score,
    SCORE_CONSTANTS,
    ScoreStats
} from './types';

// ScoreService - Business Logic Layer
// Following Service Layer Pattern and Strategy Pattern for extensibility

export class ScoreService implements IScoreService {
  private static instance: ScoreService;
  private performanceMetrics: PerformanceMetrics = {
    saveTime: 0,
    loadTime: 0,
    cacheHitRate: 0,
  };

  // Singleton Pattern for performance optimization
  public static getInstance(): ScoreService {
    if (!ScoreService.instance) {
      ScoreService.instance = new ScoreService();
    }
    return ScoreService.instance;
  }

  // Generate unique ID for scores
  private generateScoreId(): string {
    return `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Strategy Pattern: Different score calculation methods
  private calculateScoreValue(baseScore: number): number {
    // Base strategy: return the score as-is
    // Future: Can implement different strategies (time-based, difficulty-based, etc.)
    return Math.floor(baseScore);
  }

  // Add a new score to the leaderboard
  async addScore(score: number): Promise<boolean> {
    const startTime = performance.now();
    
    try {
      // Don't save scores below minimum threshold
      if (score < SCORE_CONSTANTS.MIN_SCORE_TO_SAVE) {
        return false;
      }

      const calculatedScore = this.calculateScoreValue(score);
      const newScore: Score = {
        id: this.generateScoreId(),
        value: calculatedScore,
        timestamp: Date.now(),
      };

      // Get current top scores
      const currentScores = await asyncStorageService.getTopScores();
      
      // Check if this is a new high score
      const isNewHighScore = currentScores.length === 0 || 
                           calculatedScore > currentScores[0].value;

      // Add new score and sort
      const updatedScores = [...currentScores, newScore]
        .sort((a, b) => b.value - a.value) // Sort descending
        .slice(0, SCORE_CONSTANTS.MAX_TOP_SCORES); // Keep only top 5

      // Save updated scores
      await asyncStorageService.saveTopScores(updatedScores);

      // Update highest score if needed
      if (isNewHighScore) {
        await asyncStorageService.saveHighestScore(calculatedScore);
      }

      // Update score stats
      await this.updateScoreStats(updatedScores);

      // Performance tracking
      this.performanceMetrics.saveTime = performance.now() - startTime;

      return isNewHighScore;
    } catch (error) {
      console.error('Error adding score:', error);
      throw new Error(`Failed to add score: ${error}`);
    }
  }

  // Get top scores with optional limit
  async getTopScores(limit: number = SCORE_CONSTANTS.MAX_TOP_SCORES): Promise<Score[]> {
    const startTime = performance.now();
    
    try {
      const scores = await asyncStorageService.getTopScores();
      const limitedScores = scores.slice(0, limit);
      
      this.performanceMetrics.loadTime = performance.now() - startTime;
      return limitedScores;
    } catch (error) {
      console.error('Error getting top scores:', error);
      return [];
    }
  }

  // Get the highest score
  async getHighestScore(): Promise<number> {
    try {
      return await asyncStorageService.getHighestScore();
    } catch (error) {
      console.error('Error getting highest score:', error);
      return 0;
    }
  }

  // Get the next target score to beat
  async getNextTargetScore(currentScore: number): Promise<number> {
    try {
      const topScores = await this.getTopScores();
      
      if (topScores.length === 0) {
        return currentScore + 100; // Default target
      }

      // Find the next score to beat
      for (const score of topScores) {
        if (currentScore < score.value) {
          return score.value;
        }
      }

      // If current score is higher than all top scores, target the highest + 100
      return topScores[0].value + 100;
    } catch (error) {
      console.error('Error getting next target score:', error);
      return currentScore + 100;
    }
  }

  // Check if a score would be a new high score
  async isNewHighScore(score: number): Promise<boolean> {
    try {
      const highestScore = await this.getHighestScore();
      return score > highestScore;
    } catch (error) {
      console.error('Error checking if new high score:', error);
      return false;
    }
  }

  // Get comprehensive score statistics
  async getScoreStats(): Promise<ScoreStats> {
    try {
      // Always calculate stats from fresh top scores instead of using cached stats
      const topScores = await this.getTopScores();
      const stats = this.calculateScoreStats(topScores);
      
      // Cache the stats for future use
      await asyncStorageService.saveScoreStats(stats);
      
      return stats;
    } catch (error) {
      console.error('Error getting score stats:', error);
      return {
        highestScore: 0,
        averageScore: 0,
        totalGames: 0,
        lastPlayed: 0,
      };
    }
  }

  // Calculate score statistics
  private calculateScoreStats(scores: Score[]): ScoreStats {
    if (scores.length === 0) {
      return {
        highestScore: 0,
        averageScore: 0,
        totalGames: 0,
        lastPlayed: 0,
      };
    }

    const totalScore = scores.reduce((sum, score) => sum + score.value, 0);
    const averageScore = Math.round(totalScore / scores.length);
    const highestScore = scores[0]?.value || 0;
    const lastPlayed = Math.max(...scores.map(s => s.timestamp));

    return {
      highestScore,
      averageScore,
      totalGames: scores.length,
      lastPlayed,
    };
  }

  // Update score statistics
  private async updateScoreStats(scores: Score[]): Promise<void> {
    try {
      const stats = this.calculateScoreStats(scores);
      await asyncStorageService.saveScoreStats(stats);
    } catch (error) {
      console.error('Error updating score stats:', error);
    }
  }

  // Clear all scores
  async clearAllScores(): Promise<void> {
    try {
      await asyncStorageService.clearAllScoreData();
    } catch (error) {
      console.error('Error clearing scores:', error);
      throw new Error(`Failed to clear scores: ${error}`);
    }
  }

  // Performance monitoring methods
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  resetPerformanceMetrics(): void {
    this.performanceMetrics = {
      saveTime: 0,
      loadTime: 0,
      cacheHitRate: 0,
    };
  }

  // Cache management
  clearCache(): void {
    asyncStorageService.clearCache();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return asyncStorageService.getCacheStats();
  }
}

// Export singleton instance
export const scoreService = ScoreService.getInstance(); 