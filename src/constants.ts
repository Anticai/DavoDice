/**
 * App-wide constants
 */

import { UserSettings, DisplayMode } from './types';

// App information
export const APP_NAME = 'Blood Bowl Dice';
export const APP_VERSION = '1.0.0';

// Game constants
export const DICE_FACES = 6;
export const DEFAULT_THRESHOLD = 4;
export const DEFAULT_REROLL_ONES = false;

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'bloodbowl-dice-settings',
  STATISTICS: 'bloodbowl-dice-statistics',
  ROLL_HISTORY: 'bloodbowl-dice-roll-history',
};

// Animation durations
export const ANIMATION = {
  SHORT: 150,
  MEDIUM: 300,
  LONG: 500,
};

// Feedback sounds
export const SOUND = {
  DICE_ROLL: 'dice_roll',
  SUCCESS: 'success',
  FAILURE: 'failure',
  TAP: 'tap',
  SWALLOW: 'swallow',
};

// Haptic feedback types
export const HAPTIC = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
};

// Calculator settings defaults
export const CALCULATOR_DEFAULTS = {
  DICE_COUNT: 1,
  THRESHOLD: 4,
  REROLL_ONES: false,
};

// Default settings for the app
export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  hapticFeedbackEnabled: true,
  animationsEnabled: true,
  displayMode: DisplayMode.System,
  defaultRerollOnes: false,
};

// UI constants
export const UI = {
  HEADER_HEIGHT: 56,
  TAB_BAR_HEIGHT: 56,
  DICE_SIZE: 80,
  DICE_SIZE_SMALL: 40,
  BUTTON_HEIGHT: 48,
  BORDER_RADIUS: 12,
}; 