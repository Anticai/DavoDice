import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { H1, Body } from './Text';
import { APP_NAME, APP_VERSION } from '../constants';
import { useTheme } from '../hooks/useTheme';

// Import SVG as React component
import AppIcon from '../assets/images/app-icon.svg';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDisplayTime?: number;
}

/**
 * Splash screen component displayed on app launch
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minimumDisplayTime = 2000, // 2 seconds default minimum display time
}) => {
  const { colors } = useTheme();
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    // Start animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Schedule completion after minimum display time
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, minimumDisplayTime);
    
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, minimumDisplayTime, onComplete]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Icon (using SVG as React component) */}
        <AppIcon 
          width={width * 0.4}
          height={width * 0.4}
          style={styles.appIcon}
        />
        
        {/* App Name */}
        <H1 style={styles.appName}>{APP_NAME}</H1>
        
        {/* Version */}
        <Body style={styles.version}>v{APP_VERSION}</Body>
      </Animated.View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIcon: {
    marginBottom: 20,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  version: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
}); 