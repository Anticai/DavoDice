import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { settingsService } from '../services/settingsService';
import { DisplayMode, UserSettings } from '../types';
import { lightColors, darkColors, lightTheme, darkTheme, Theme } from '../styles/theme';

// Define the theme context type
export type ThemeContextType = {
  isDarkMode: boolean;
  colors: typeof lightColors;
  theme: Theme;
};

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  colors: lightColors,
  theme: lightTheme,
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

/**
 * Theme provider component that handles display mode changes
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize settings
  useEffect(() => {
    const initSettings = async () => {
      await settingsService.init();
      setSettings(settingsService.getSettings());
    };

    initSettings();

    // Subscribe to settings changes
    const unsubscribe = settingsService.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  // Update theme when settings or system theme changes
  useEffect(() => {
    if (!settings) return;

    let shouldUseDarkMode = false;

    switch (settings.displayMode) {
      case DisplayMode.Dark:
        shouldUseDarkMode = true;
        break;
      case DisplayMode.Light:
        shouldUseDarkMode = false;
        break;
      case DisplayMode.System:
        shouldUseDarkMode = systemColorScheme === 'dark';
        break;
    }

    setIsDarkMode(shouldUseDarkMode);
  }, [settings, systemColorScheme]);

  // Update status bar based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
    if (StatusBar.setBackgroundColor) {
      StatusBar.setBackgroundColor(
        isDarkMode ? darkColors.background.main : lightColors.background.main
      );
    }
  }, [isDarkMode]);

  // Get the appropriate color palette based on theme
  const getThemeColors = () => {
    // Return dark or light colors based on the theme
    return isDarkMode ? darkColors : lightColors;
  };

  // Get the appropriate theme object based on mode
  const getThemeObject = () => {
    return isDarkMode ? darkTheme : lightTheme;
  };

  const themeValue = {
    isDarkMode,
    colors: getThemeColors(),
    theme: getThemeObject(),
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}; 