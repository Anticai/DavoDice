/**
 * Number animation utilities for the dice eating effect
 */
import { Animated, Easing } from 'react-native';
import { ANIMATION } from '../constants';
import { DiceFace } from '../types';
import { animations } from '../styles';

export const durations = {
  count: animations.durations.medium,
  flash: animations.durations.short,
  bounce: animations.durations.medium,
};

/**
 * Create an eating animation that sucks a number toward the center
 * @param animValue The Animated.Value to animate
 * @returns Animation object
 */
export const createEatingAnimation = (
  animValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.timing(animValue, {
    toValue: 1,
    duration: ANIMATION.MEDIUM,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

/**
 * Enhanced version of the eating animation style
 * Provides more dynamic and fluid visual effects
 * @param animValue - The animation value
 * @param number - The number being animated
 * @returns - The style object for the animation
 */
export const getEatingAnimationStyle = (
  animValue: Animated.Value,
  number: DiceFace
): any => {
  // Create more dynamic transforms for a better visual effect
  const scale = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 0.3], // More pronounced scale effect
  });
  
  const opacity = animValue.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 0.8, 0], // Smoother opacity transition
  });
  
  const rotate = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '10deg', '-10deg'], // Add slight rotation for more dynamic feel
  });

  return {
    opacity,
    transform: [
      { scale },
      { rotate },
    ],
  };
};

/**
 * Create a swallow sound effect timing
 * @param animValue The animation progress value (0 to 1)
 * @param triggerCallback Callback to trigger when the sound should play
 * @returns Animation object
 */
export const createSoundTriggerAnimation = (
  animValue: Animated.Value,
  triggerCallback: () => void
): Animated.CompositeAnimation => {
  // Create a new Animated value to track when to trigger the sound
  const soundTrigger = new Animated.Value(0);
  
  // Set up a listener to call the callback at the right time
  soundTrigger.addListener(({ value }) => {
    if (value >= 0.5 && value < 0.6) {
      triggerCallback();
    }
  });
  
  // Create an animation that runs alongside the eating animation
  return Animated.timing(soundTrigger, {
    toValue: 1,
    duration: ANIMATION.MEDIUM,
    easing: Easing.linear,
    useNativeDriver: true,
  });
};

/**
 * Creates an animation that counts up or down to a target number
 */
export const createCountAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration: durations.count,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

/**
 * Creates a flashing animation for highlighting numbers
 */
export const createFlashAnimation = (
  animatedValue: Animated.Value,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: durations.flash / 2,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: durations.flash / 2,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Creates a bouncing animation for numbers
 */
export const createBounceAnimation = (
  animatedValue: Animated.Value,
  callback?: () => void
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.2,
      duration: durations.bounce / 3,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: durations.bounce * 2/3,
      easing: Easing.inOut(Easing.elastic(1)),
      useNativeDriver: true,
    }),
  ]);
}; 