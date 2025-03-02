/**
 * Application constants for the Blood Bowl Dice Calculator
 */

import { UserSettings, DisplayMode } from '../types';

// Define types for our constants
interface AnimationTiming {
  SHORT: number;
  MEDIUM: number;
  LONG: number;
  DICE_ROLL: number;
  NUMBER_SHOW: number;
}

interface StorageKeys {
  SETTINGS: string;
  ROLL_HISTORY: string;
  STATISTICS: string;
}

interface SoundFiles {
  SWALLOW: string;
  SUCCESS: string;
  FAILURE: string;
}

// App information
export const APP_NAME = 'Blood Bowl Dice Calculator';
export const APP_VERSION = '1.0.0';

// Game constants
export const MIN_DICE_VALUE = 1;
export const MAX_DICE_VALUE = 6;
export const DEFAULT_THRESHOLD = 4; // Default "roll over" threshold

// UI constants
export const ANIMATION_DURATION = 300; // ms
export const DICE_SIZE = 80; // pixels
export const NUMBER_CIRCLE_SIZE = 40; // pixels

// Animation durations
export const ANIMATION: AnimationTiming = {
  SHORT: 200,
  MEDIUM: 400,
  LONG: 600,
  DICE_ROLL: 800,
  NUMBER_SHOW: 500
};

// Storage keys
export const STORAGE_KEYS: StorageKeys = {
  SETTINGS: 'user_settings',
  ROLL_HISTORY: 'roll_history',
  STATISTICS: 'statistics',
};

// Sound files
export const SOUND_FILES: SoundFiles = {
  SWALLOW: 'swallow.mp3',
  SUCCESS: 'success.mp3',
  FAILURE: 'failure.mp3',
};

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  hapticFeedbackEnabled: true,
  hapticEnabled: true, // Alias for easier use
  displayMode: DisplayMode.Light,
  defaultRerollOnes: false,
  animationsEnabled: true,
}; 