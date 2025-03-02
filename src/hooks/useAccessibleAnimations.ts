import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, AccessibilityInfo } from 'react-native';
import { useSettings } from './useSettings';

/**
 * Options for accessible animations
 */
export interface AccessibleAnimationOptions {
  /** Whether animations are enabled at all */
  animationsEnabled: boolean;
  /** Whether to reduce motion for users who are sensitive to motion */
  reduceMotion: boolean;
  /** Scale factor for animation durations (lower = faster) */
  durationScale: number;
}

/**
 * Default options when user preferences aren't available
 */
const DEFAULT_OPTIONS: AccessibleAnimationOptions = {
  animationsEnabled: true,
  reduceMotion: false,
  durationScale: 1.0,
};

/**
 * Hook that provides animations that respect accessibility preferences.
 * This will automatically adjust animations based on the user's settings
 * and device accessibility preferences.
 */
export const useAccessibleAnimations = () => {
  // Get user settings
  const { settings } = useSettings();
  
  // State for accessibility settings
  const [options, setOptions] = useState<AccessibleAnimationOptions>(DEFAULT_OPTIONS);
  
  // Update options when settings change
  useEffect(() => {
    // Check if animations are enabled in settings
    const animationsEnabled = settings?.animationsEnabled !== false;
    
    // Update options based on settings
    setOptions(prev => ({
      ...prev,
      animationsEnabled,
      // Other settings can be added here
    }));
  }, [settings]);
  
  // Check system accessibility settings
  useEffect(() => {
    // Function to update based on reduce motion setting
    const updateReduceMotion = (reduceMotionEnabled: boolean) => {
      setOptions(prev => ({
        ...prev,
        reduceMotion: reduceMotionEnabled,
        // When reduce motion is enabled, we also reduce animation duration
        durationScale: reduceMotionEnabled ? 0.5 : 1.0,
      }));
    };
    
    // Initial check
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      AccessibilityInfo.isReduceMotionEnabled().then(updateReduceMotion);
      
      // Subscribe to changes
      const listener = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        updateReduceMotion
      );
      
      return () => {
        // Clean up listener
        listener.remove();
      };
    }
  }, []);
  
  /**
   * Creates an accessible timing animation that respects user preferences
   */
  const createAccessibleTiming = (
    value: Animated.Value,
    toValue: number,
    duration: number,
    useNativeDriver: boolean = true,
    easing: any = Easing.bezier(0.25, 0.1, 0.25, 1)
  ): Animated.CompositeAnimation => {
    // If animations are disabled, just set the value immediately
    if (!options.animationsEnabled) {
      value.setValue(toValue);
      return {
        start: (callback?: (({ finished }: { finished: boolean }) => void)) => {
          if (callback) callback({ finished: true });
        },
        stop: () => {},
        reset: () => {},
      };
    }
    
    // Adjust duration based on reduce motion preference
    const adjustedDuration = options.reduceMotion
      ? duration * options.durationScale
      : duration;
    
    // Use simplified easing when reduce motion is enabled
    const adjustedEasing = options.reduceMotion
      ? Easing.linear
      : easing;
    
    return Animated.timing(value, {
      toValue,
      duration: adjustedDuration,
      useNativeDriver,
      easing: adjustedEasing,
    });
  };
  
  /**
   * Creates an accessible spring animation that respects user preferences
   */
  const createAccessibleSpring = (
    value: Animated.Value,
    toValue: number,
    useNativeDriver: boolean = true,
    tension: number = 40,
    friction: number = 7
  ): Animated.CompositeAnimation => {
    // If animations are disabled, just set the value immediately
    if (!options.animationsEnabled) {
      value.setValue(toValue);
      return {
        start: (callback?: (({ finished }: { finished: boolean }) => void)) => {
          if (callback) callback({ finished: true });
        },
        stop: () => {},
        reset: () => {},
      };
    }
    
    // For reduced motion, increase friction to make the animation more direct
    const adjustedFriction = options.reduceMotion
      ? friction * 1.5
      : friction;
    
    return Animated.spring(value, {
      toValue,
      useNativeDriver,
      tension,
      friction: adjustedFriction,
      // Make animation more direct with reduced motion
      restDisplacementThreshold: options.reduceMotion ? 0.1 : 0.01,
      restSpeedThreshold: options.reduceMotion ? 0.1 : 0.01,
    });
  };
  
  /**
   * Creates an accessible sequence of animations that respects user preferences
   */
  const createAccessibleSequence = (
    animations: Animated.CompositeAnimation[]
  ): Animated.CompositeAnimation => {
    // If animations are disabled, return a no-op animation
    if (!options.animationsEnabled) {
      return {
        start: (callback?: (({ finished }: { finished: boolean }) => void)) => {
          if (callback) callback({ finished: true });
        },
        stop: () => {},
        reset: () => {},
      };
    }
    
    return Animated.sequence(animations);
  };
  
  /**
   * Creates an accessible parallel animation that respects user preferences
   */
  const createAccessibleParallel = (
    animations: Animated.CompositeAnimation[]
  ): Animated.CompositeAnimation => {
    // If animations are disabled, return a no-op animation
    if (!options.animationsEnabled) {
      return {
        start: (callback?: (({ finished }: { finished: boolean }) => void)) => {
          if (callback) callback({ finished: true });
        },
        stop: () => {},
        reset: () => {},
      };
    }
    
    return Animated.parallel(animations);
  };
  
  /**
   * Creates accessible staggered animations that respect user preferences
   */
  const createAccessibleStagger = (
    staggerMs: number,
    animations: Animated.CompositeAnimation[]
  ): Animated.CompositeAnimation => {
    // If animations are disabled, return a no-op animation
    if (!options.animationsEnabled) {
      return {
        start: (callback?: (({ finished }: { finished: boolean }) => void)) => {
          if (callback) callback({ finished: true });
        },
        stop: () => {},
        reset: () => {},
      };
    }
    
    // Reduce stagger time for reduced motion
    const adjustedStagger = options.reduceMotion
      ? staggerMs * options.durationScale
      : staggerMs;
    
    return Animated.stagger(adjustedStagger, animations);
  };
  
  return {
    options,
    createAccessibleTiming,
    createAccessibleSpring,
    createAccessibleSequence,
    createAccessibleParallel,
    createAccessibleStagger,
  };
};

export default useAccessibleAnimations; 