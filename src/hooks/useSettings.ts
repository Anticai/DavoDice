import { useSettingsContext } from '../context/SettingsContext';

/**
 * Hook to access and modify app settings
 * This is a wrapper around useSettingsContext for backward compatibility
 */
export const useSettings = () => {
  const {
    settings,
    isLoading,
    setSoundEnabled,
    setVibrationEnabled,
    setAnimationsEnabled,
    setTheme,
    setDefaultRerollOnes,
    resetSettings
  } = useSettingsContext();

  // Maintain backward compatibility with previous API
  return {
    settings,
    isLoading,
    setSoundEnabled,
    setVibrationEnabled,
    setHapticEnabled: setVibrationEnabled, // Alias for backward compatibility
    setAnimationsEnabled,
    setTheme,
    setDefaultRerollOnes,
    resetSettings,
    // Legacy interface for compatibility
    updateSetting: async <K extends keyof typeof settings>(
      key: K,
      value: typeof settings[K]
    ) => {
      switch (key) {
        case 'soundEnabled':
          await setSoundEnabled(value as boolean);
          break;
        case 'hapticFeedbackEnabled':
        case 'hapticEnabled':
          await setVibrationEnabled(value as boolean);
          break;
        case 'animationsEnabled':
          await setAnimationsEnabled(value as boolean);
          break;
        case 'displayMode':
          await setTheme(value as any);
          break;
        case 'defaultRerollOnes':
          await setDefaultRerollOnes(value as boolean);
          break;
      }
      return settings;
    }
  };
};

export default useSettings; 