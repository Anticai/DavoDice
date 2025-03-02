import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings, DisplayMode } from '../types';
import { settingsService } from '../services';
import { DEFAULT_SETTINGS } from '../constants';

// Define the context shape
interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
  setVibrationEnabled: (enabled: boolean) => Promise<void>;
  setAnimationsEnabled: (enabled: boolean) => Promise<void>;
  setTheme: (mode: DisplayMode) => Promise<void>;
  setDefaultRerollOnes: (enabled: boolean) => Promise<void>;
  resetSettings: () => Promise<void>;
}

// Create context with default values
const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
  setSoundEnabled: async () => {},
  setVibrationEnabled: async () => {},
  setAnimationsEnabled: async () => {},
  setTheme: async () => {},
  setDefaultRerollOnes: async () => {},
  resetSettings: async () => {},
});

// Props for the provider component
interface SettingsProviderProps {
  children: ReactNode;
}

/**
 * Provider component that makes settings context available to all child components
 */
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize settings on mount
  useEffect(() => {
    const initSettings = async () => {
      try {
        setIsLoading(true);
        await settingsService.init();
        setSettings(settingsService.getSettings());
      } catch (error) {
        console.error('Failed to initialize settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSettings();

    // Subscribe to settings changes
    const unsubscribe = settingsService.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  // Handler functions for updating settings
  const setSoundEnabled = async (enabled: boolean) => {
    try {
      const updated = await settingsService.updateSettings({
        soundEnabled: enabled,
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update sound setting:', error);
    }
  };

  const setVibrationEnabled = async (enabled: boolean) => {
    try {
      const updated = await settingsService.updateSettings({
        hapticFeedbackEnabled: enabled,
        hapticEnabled: enabled, // Update both for backward compatibility
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update vibration setting:', error);
    }
  };

  const setAnimationsEnabled = async (enabled: boolean) => {
    try {
      const updated = await settingsService.updateSettings({
        animationsEnabled: enabled,
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update animations setting:', error);
    }
  };

  const setTheme = async (mode: DisplayMode) => {
    try {
      const updated = await settingsService.updateSettings({
        displayMode: mode,
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update theme setting:', error);
    }
  };

  const setDefaultRerollOnes = async (enabled: boolean) => {
    try {
      const updated = await settingsService.updateSettings({
        defaultRerollOnes: enabled,
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update reroll ones setting:', error);
    }
  };

  const resetSettings = async () => {
    try {
      const defaultSettings = await settingsService.resetSettings();
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  // Context value
  const value: SettingsContextType = {
    settings,
    isLoading,
    setSoundEnabled,
    setVibrationEnabled,
    setAnimationsEnabled,
    setTheme,
    setDefaultRerollOnes,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Custom hook for accessing settings context
 */
export const useSettingsContext = () => useContext(SettingsContext);

export default SettingsContext; 