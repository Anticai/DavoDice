/**
 * Type definitions for the Blood Bowl Dice Calculator
 */

// Dice face types
export type DiceFace = 1 | 2 | 3 | 4 | 5 | 6;

// Dice sequence type
export type DiceSequence = DiceFace[];

// Roll outcome type
export type RollOutcome = 'success' | 'failure';

// Roll statistics type
export interface RollStatistics {
  totalRolls: number;
  successfulRolls: number;
  failedRolls: number;
  successRate: number;
}

// Display mode options
export enum DisplayMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

// User settings type
export interface UserSettings {
  soundEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  hapticEnabled: boolean; // Alias for hapticFeedbackEnabled for easier use
  displayMode: DisplayMode;
  defaultRerollOnes: boolean;
  animationsEnabled: boolean;
  
  // Animation settings
  reduceMotion?: boolean;
  followSystemReduceMotion?: boolean;
  animationDurationScale?: number;
  performanceLevel?: string; // 'high' | 'medium' | 'low' | 'critical'
}

// Roll attempt with result
export interface RollAttempt {
  sequence: DiceSequence;
  threshold: number;
  outcome?: RollOutcome;
  failedAt?: number; // Index of the dice that failed
  timestamp: number;
} 