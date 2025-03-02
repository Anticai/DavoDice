import { RollAttempt, RollStatistics, RollOutcome } from '../types';
import storageService from './storage';

/**
 * Service for tracking and calculating roll statistics
 */
class StatisticsService {
  private statistics: RollStatistics = {
    totalRolls: 0,
    successfulRolls: 0,
    failedRolls: 0,
    successRate: 0,
  };

  private rollHistory: RollAttempt[] = [];

  /**
   * Initialize statistics from storage
   */
  async initialize(): Promise<void> {
    try {
      this.statistics = await storageService.loadStatistics();
      this.rollHistory = await storageService.loadRollHistory();
    } catch (error) {
      console.error('Error initializing statistics:', error);
    }
  }

  /**
   * Add a roll attempt to history and update statistics
   */
  async addRollAttempt(attempt: RollAttempt): Promise<void> {
    if (!attempt.outcome) {
      return;
    }

    // Add to history
    this.rollHistory = [attempt, ...this.rollHistory].slice(0, 100); // Keep only last 100 rolls

    // Update statistics
    this.statistics.totalRolls++;
    
    if (attempt.outcome === 'success') {
      this.statistics.successfulRolls++;
    } else {
      this.statistics.failedRolls++;
    }

    // Calculate success rate
    if (this.statistics.totalRolls > 0) {
      this.statistics.successRate = 
        this.statistics.successfulRolls / this.statistics.totalRolls;
    }

    // Save updated data
    await Promise.all([
      storageService.saveRollHistory(this.rollHistory),
      storageService.saveStatistics(this.statistics)
    ]);
  }

  /**
   * Get current statistics
   */
  getStatistics(): RollStatistics {
    return { ...this.statistics };
  }

  /**
   * Get roll history
   */
  getRollHistory(): RollAttempt[] {
    return [...this.rollHistory];
  }

  /**
   * Calculate success rate for a specific threshold
   */
  getSuccessRateForThreshold(threshold: number): number {
    const filteredAttempts = this.rollHistory.filter(
      attempt => attempt.threshold === threshold && attempt.outcome
    );

    if (filteredAttempts.length === 0) {
      return 0;
    }

    const successfulAttempts = filteredAttempts.filter(
      attempt => attempt.outcome === 'success'
    );

    return successfulAttempts.length / filteredAttempts.length;
  }

  /**
   * Reset all statistics
   */
  async resetStatistics(): Promise<void> {
    this.statistics = {
      totalRolls: 0,
      successfulRolls: 0,
      failedRolls: 0,
      successRate: 0,
    };
    this.rollHistory = [];

    await Promise.all([
      storageService.saveRollHistory(this.rollHistory),
      storageService.saveStatistics(this.statistics)
    ]);
  }
}

export default new StatisticsService(); 