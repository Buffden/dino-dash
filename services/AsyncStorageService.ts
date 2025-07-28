import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, Score, ScoreCache, ScoreStats } from './types';

// AsyncStorage Service - Single Responsibility: Data Persistence
// Following Repository Pattern for data access abstraction

export class AsyncStorageService {
  private static instance: AsyncStorageService;
  private cache: Map<string, ScoreCache> = new Map();

  // Singleton Pattern for performance optimization
  public static getInstance(): AsyncStorageService {
    if (!AsyncStorageService.instance) {
      AsyncStorageService.instance = new AsyncStorageService();
    }
    return AsyncStorageService.instance;
  }

  // Generic storage methods with error handling
  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      console.log(`Saving to AsyncStorage ${key}:`, value);
      console.log(`JSON value:`, jsonValue);
      
      await AsyncStorage.setItem(key, jsonValue);
      
      // Verify the save by reading it back
      const savedValue = await AsyncStorage.getItem(key);
      console.log(`Verification - saved value for ${key}:`, savedValue);
      
      // Update cache
      this.cache.set(key, {
        data: value as any,
        timestamp: Date.now(),
        isValid: true,
      });
    } catch (error) {
      console.error(`Error saving to AsyncStorage (${key}):`, error);
      throw new Error(`Failed to save data: ${error}`);
    }
  }

  private async getItem<T>(key: string): Promise<T | null> {
    try {
      // Check cache first for performance
      const cached = this.cache.get(key);
      if (cached && this.isCacheValid(cached)) {
        console.log(`Cache hit for ${key}:`, cached.data);
        return cached.data as T;
      }

      console.log(`Fetching from AsyncStorage: ${key}`);
      const jsonValue = await AsyncStorage.getItem(key);
      console.log(`Raw AsyncStorage value for ${key}:`, jsonValue);
      
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue) as T;
        console.log(`Parsed data for ${key}:`, data);
        
        // Update cache
        this.cache.set(key, {
          data: data as any,
          timestamp: Date.now(),
          isValid: true,
        });
        
        return data;
      }
      console.log(`No data found for ${key}`);
      return null;
    } catch (error) {
      console.error(`Error reading from AsyncStorage (${key}):`, error);
      return null;
    }
  }

  private isCacheValid(cache: ScoreCache): boolean {
    const now = Date.now();
    const cacheAge = now - cache.timestamp;
    return cacheAge < 5 * 60 * 1000; // 5 minutes cache validity
  }

  // Score-specific methods
  async saveTopScores(scores: Score[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.TOP_SCORES, scores);
  }

  async getTopScores(): Promise<Score[]> {
    const scores = await this.getItem<Score[]>(STORAGE_KEYS.TOP_SCORES);
    return scores || [];
  }

  async saveHighestScore(score: number): Promise<void> {
    await this.setItem(STORAGE_KEYS.HIGHEST_SCORE, score);
  }

  async getHighestScore(): Promise<number> {
    const score = await this.getItem<number>(STORAGE_KEYS.HIGHEST_SCORE);
    return score || 0;
  }

  async saveScoreStats(stats: ScoreStats): Promise<void> {
    await this.setItem(STORAGE_KEYS.SCORE_STATS, stats);
  }

  async getScoreStats(): Promise<ScoreStats | null> {
    return await this.getItem<ScoreStats>(STORAGE_KEYS.SCORE_STATS);
  }

  // Clear all score data
  async clearAllScoreData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOP_SCORES),
        AsyncStorage.removeItem(STORAGE_KEYS.HIGHEST_SCORE),
        AsyncStorage.removeItem(STORAGE_KEYS.SCORE_STATS),
      ]);
      
      // Clear cache
      this.cache.clear();
    } catch (error) {
      console.error('Error clearing score data:', error);
      throw new Error(`Failed to clear data: ${error}`);
    }
  }

  // Performance monitoring
  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Cache management
  clearCache(): void {
    console.log('Clearing AsyncStorage cache');
    this.cache.clear();
  }

  // Force refresh from AsyncStorage (useful for platform differences)
  async forceRefresh(): Promise<void> {
    console.log('Force refreshing from AsyncStorage');
    this.cache.clear();
    
    // Test read all keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('All AsyncStorage keys:', allKeys);
    
    for (const key of Object.values(STORAGE_KEYS)) {
      const value = await AsyncStorage.getItem(key);
      console.log(`Key ${key}:`, value);
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const asyncStorageService = AsyncStorageService.getInstance(); 