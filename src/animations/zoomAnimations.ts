/**
 * Zoom animation utilities for highlighting failed dice
 */
import { Animated, Easing } from 'react-native';
import { animations } from '../styles';

export const durations = {
  zoomIn: animations.durations.short,
  zoomOut: animations.durations.short,
  pulse: animations.durations.medium,
};

/**
 * Create a zoom animation for highlighting a failed dice
 * @param animValue The Animated.Value to animate
 * @param startDelayMs Optional delay before the animation starts
 * @returns Animation object
 */
export const createZoomAnimation = (
  animValue: Animated.Value,
  startDelayMs: number = 0
): Animated.CompositeAnimation => {
  return Animated.sequence([
    // Initial delay if specified
    Animated.delay(startDelayMs),
    
    // Zoom in slightly larger than normal
    Animated.timing(animValue, {
      toValue: 1.2,
      duration: durations.zoomIn,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }),
    
    // Settle back to normal size with a slight bounce
    Animated.spring(animValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Creates a zoom in animation
 */
export const createZoomInAnimation = (
  animatedValue: Animated.Value,
  toValue: number = 1.1,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration: durations.zoomIn,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

/**
 * Creates a zoom out animation
 */
export const createZoomOutAnimation = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration: durations.zoomOut,
    easing: Easing.inOut(Easing.cubic),
    useNativeDriver: true,
  });
};

/**
 * Creates a pulse animation that zooms in and out repeatedly
 */
export const createPulseAnimation = (
  animatedValue: Animated.Value,
  minScale: number = 0.95,
  maxScale: number = 1.05,
  iterations: number = 2,
  callback?: () => void
): Animated.CompositeAnimation => {
  const pulseSequence = Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: maxScale,
      duration: durations.pulse / 2,
      easing: Easing.out(Easing.sin),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: minScale,
      duration: durations.pulse / 2,
      easing: Easing.in(Easing.sin),
      useNativeDriver: true,
    }),
  ]);

  // Create the full animation with the specified number of iterations
  const fullAnimation = Animated.sequence([
    ...Array(iterations).fill(pulseSequence),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: durations.pulse / 4,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }),
  ]);

  if (callback) {
    fullAnimation.start(callback);
  }

  return fullAnimation;
};

/**
 * Get the transform style for a zoomed element
 * @param animValue The animation progress value
 * @returns Object with transform styles
 */
export const getZoomAnimationStyle = (animValue: Animated.Value) => {
  return {
    transform: [
      { scale: animValue },
    ],
  };
};

/**
 * Get shadow style for a zoomed element to enhance the effect
 * @param animValue The animation progress value
 * @returns Object with shadow styles
 */
export const getZoomShadowStyle = (animValue: Animated.Value) => {
  // Increase shadow when zoomed
  const shadowOpacity = animValue.interpolate({
    inputRange: [1, 1.2],
    outputRange: [0.2, 0.5],
  });
  
  const shadowRadius = animValue.interpolate({
    inputRange: [1, 1.2],
    outputRange: [2, 8],
  });
  
  return {
    shadowOpacity,
    shadowRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  };
}; 