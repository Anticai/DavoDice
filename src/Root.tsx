import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { SettingsProvider } from './context/SettingsContext';
import { feedbackService, settingsService } from './services';
import { SplashScreen } from './components/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

/**
 * Main application component
 */
const Main = () => {
  const { isDarkMode, colors } = useTheme();
  const [showSplash, setShowSplash] = useState(true);

  // Set up status bar based on theme
  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? colors.background.main : '#FFFFFF'}
      />
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <AppNavigator />
      )}
    </>
  );
};

/**
 * Root application component with providers
 */
const Root: React.FC = () => {
  // Initialize services
  useEffect(() => {
    const initServices = async () => {
      try {
        // Initialize settings first as other services depend on them
        await settingsService.init();

        // Initialize feedback service (sounds and haptics)
        await feedbackService.init();
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initServices();

    // Clean up services when app is unmounted
    return () => {
      feedbackService.cleanup();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ThemeProvider>
          <SettingsProvider>
            <AppProvider>
              <Main />
            </AppProvider>
          </SettingsProvider>
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Root; 