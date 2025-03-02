import { BackHandler, Platform } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';

/**
 * Check if current platform is iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if current platform is Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Helper to set up Android back button handling with React Navigation
 * @param navigation React Navigation reference
 */
export const setupAndroidBackHandler = (
  navigation: NavigationContainerRef<any>
) => {
  if (!isAndroid) return () => {};

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    const canGoBack = navigation.canGoBack();
    
    if (canGoBack) {
      navigation.goBack();
      return true; // Event handled
    }
    
    // Allow default behavior (exit app)
    return false;
  });

  return () => backHandler.remove();
};

/**
 * Get platform-specific value
 * @param iosValue Value for iOS
 * @param androidValue Value for Android
 */
export function getPlatformValue<T>(iosValue: T, androidValue: T): T {
  return isIOS ? iosValue : androidValue;
} 