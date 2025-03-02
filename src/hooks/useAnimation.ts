import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

type AnimationConfig = {
  initialValue?: number;
};

/**
 * Custom hook for managing animations
 * @param config Animation configuration
 * @returns Animation utilities
 */
export const useAnimation = (config: AnimationConfig = {}) => {
  const { initialValue = 0 } = config;
  
  // Create animated value
  const animatedValue = useRef(new Animated.Value(initialValue)).current;
  
  // Reset animation to initial value
  const reset = useCallback((value: number = initialValue) => {
    animatedValue.setValue(value);
  }, [animatedValue, initialValue]);
  
  // Run an animation and return a promise
  const runAnimation = useCallback((
    animation: (value: Animated.Value) => Animated.CompositeAnimation,
    resetAfter: boolean = false
  ): Promise<void> => {
    return new Promise((resolve) => {
      animation(animatedValue).start(({ finished }) => {
        if (finished && resetAfter) {
          reset();
        }
        resolve();
      });
    });
  }, [animatedValue, reset]);
  
  // Run multiple animations in sequence
  const runSequence = useCallback(async (
    animations: ((value: Animated.Value) => Animated.CompositeAnimation)[],
    resetAfter: boolean = false
  ): Promise<void> => {
    for (const animation of animations) {
      await runAnimation(animation, false);
    }
    
    if (resetAfter) {
      reset();
    }
  }, [runAnimation, reset]);
  
  // Run multiple animations in parallel
  const runParallel = useCallback((
    animations: ((value: Animated.Value) => Animated.CompositeAnimation)[],
    resetAfter: boolean = false
  ): Promise<void> => {
    return new Promise((resolve) => {
      Animated.parallel(
        animations.map(animation => animation(animatedValue))
      ).start(({ finished }) => {
        if (finished && resetAfter) {
          reset();
        }
        resolve();
      });
    });
  }, [animatedValue, reset]);
  
  return {
    animatedValue,
    reset,
    runAnimation,
    runSequence,
    runParallel,
  };
}; 