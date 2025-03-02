import AsyncStorage from '@react-native-async-storage/async-storage';
import errorService from './error';
import { safeExecute, safeParseJSON } from '../utils/errorUtils';

export enum StorageKey {
  SETTINGS = 'settings',
  STATISTICS = 'statistics',
  ROLL_HISTORY = 'rollHistory',
  ONBOARDING_COMPLETED = 'onboardingCompleted',
}

// Default settings if none are found
const DEFAULT_SETTINGS = {};

/**
 * Retrieves data from storage
 * @param key The storage key
 * @param defaultValue Default value if not found or error
 * @returns The stored data or default value
 */
async function getData<T>(key: StorageKey, defaultValue: T): Promise<T> {
  const result = await safeExecute(
    async () => {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return defaultValue;
      
      const parsedValue = safeParseJSON(value, defaultValue);
      return parsedValue as T;
    },
    errorService.ErrorType.STORAGE,
    { operation: 'getData', key }
  );
  
  return result || defaultValue;
}

/**
 * Stores data in storage
 * @param key The storage key
 * @param value The value to store
 * @returns True if successful, false otherwise
 */
async function storeData<T>(key: StorageKey, value: T): Promise<boolean> {
  const result = await safeExecute(
    async () => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    errorService.ErrorType.STORAGE,
    { operation: 'storeData', key }
  );
  
  return result || false;
}

/**
 * Removes data from storage
 * @param key The storage key
 * @returns True if successful, false otherwise
 */
async function removeData(key: StorageKey): Promise<boolean> {
  const result = await safeExecute(
    async () => {
      await AsyncStorage.removeItem(key);
      return true;
    },
    errorService.ErrorType.STORAGE,
    { operation: 'removeData', key }
  );
  
  return result || false;
}

/**
 * Clears all data from storage
 * @returns True if successful, false otherwise
 */
async function clearAll(): Promise<boolean> {
  const result = await safeExecute(
    async () => {
      await AsyncStorage.clear();
      return true;
    },
    errorService.ErrorType.STORAGE,
    { operation: 'clearAll' }
  );
  
  return result || false;
}

/**
 * Gets user settings from storage
 * @returns The settings object or default settings
 */
async function getSettings() {
  return await getData(StorageKey.SETTINGS, DEFAULT_SETTINGS);
}

/**
 * Saves user settings to storage
 * @param settings The settings to save
 * @returns True if successful, false otherwise
 */
async function storeSettings(settings: any) {
  return await storeData(StorageKey.SETTINGS, settings);
}

/**
 * Loads user settings from storage (alias for getSettings)
 * @returns The settings object or default settings
 */
async function loadSettings() {
  return await getSettings();
}

/**
 * Saves user settings to storage (alias for storeSettings)
 * @param settings The settings to save
 * @returns True if successful, false otherwise
 */
async function saveSettings(settings: any) {
  return await storeSettings(settings);
}

/**
 * Loads statistics from storage
 * @returns The statistics object or default empty statistics object
 */
async function loadStatistics() {
  const defaultStatistics = {
    totalRolls: 0,
    successfulRolls: 0,
    failedRolls: 0,
    successRate: 0
  };
  return await getData(StorageKey.STATISTICS, defaultStatistics);
}

/**
 * Saves statistics to storage
 * @param statistics The statistics to save
 * @returns True if successful, false otherwise
 */
async function saveStatistics(statistics: any) {
  return await storeData(StorageKey.STATISTICS, statistics);
}

/**
 * Loads roll history from storage
 * @returns The roll history array or default empty array
 */
async function loadRollHistory() {
  return await getData(StorageKey.ROLL_HISTORY, []);
}

/**
 * Saves roll history to storage
 * @param rollHistory The roll history to save
 * @returns True if successful, false otherwise
 */
async function saveRollHistory(rollHistory: any) {
  return await storeData(StorageKey.ROLL_HISTORY, rollHistory);
}

// Create a default export with all the functions
const storageService = {
  getData,
  storeData,
  removeData,
  clearAll,
  getSettings,
  storeSettings,
  loadSettings,
  saveSettings,
  loadStatistics,
  saveStatistics,
  loadRollHistory,
  saveRollHistory,
  StorageKey
};

export default storageService;

// Also export individual functions for direct imports
export {
  getData,
  storeData,
  removeData,
  clearAll,
  getSettings,
  storeSettings,
  loadSettings,
  saveSettings,
  loadStatistics,
  saveStatistics,
  loadRollHistory,
  saveRollHistory
}; 