/**
 * Dice animation utilities
 */
import { Animated, Easing } from 'react-native';
import { animations } from '../styles';

// Animation durations (in ms)
export const durations = {
  appear: animations.durations.medium,
  select: animations.durations.short,
  swallow: animations.durations.medium,
  return: animations.durations.medium,
  shake: animations.durations.medium,
  zoom: animations.durations.medium,
};

// Animation types
export type AnimationType = 'appear' | 'select' | 'swallow' | 'return' | 'shake' | 'zoom';

/**
 * Create a spring animation for the dice returning to center
 * @param animValue The Animated.Value to animate
 * @param toValue The value to animate to
 * @returns Animation object
 */
export const createReturnAnimation = (
  positionX: Animated.Value,
  positionY: Animated.Value,
  rotation: Animated.Value
) => {
  return Animated.parallel([
    Animated.timing(positionX, {
      toValue: 0,
      duration: durations.return,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1.5)),
    }),
    Animated.timing(positionY, {
      toValue: 0,
      duration: durations.return,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1.5)),
    }),
    Animated.timing(rotation, {
      toValue: 0,
      duration: durations.return,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.cubic),
    }),
  ]);
};

/**
 * Create a dice roll animation
 * @param animValue The Animated.Value to animate
 * @returns Animation object
 */
export const createRollAnimation = (
  animValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.timing(animValue, {
    toValue: 1,
    duration: 800,
    easing: Easing.out(Easing.bounce),
    useNativeDriver: true,
  });
};

/**
 * Create a number selection show animation
 * @param animValue The Animated.Value to animate
 * @returns Animation object
 */
export const createNumberShowAnimation = (
  animValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.timing(animValue, {
    toValue: 1,
    duration: 500,
    easing: Easing.out(Easing.back(1.5)),
    useNativeDriver: true,
  });
};

/**
 * Create a number selection hide animation
 * @param animValue The Animated.Value to animate
 * @returns Animation object
 */
export const createNumberHideAnimation = (
  animValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.timing(animValue, {
    toValue: 0,
    duration: 250,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

/**
 * Create interpolated values for a dice pan gesture
 * @param panX The X position Animated.Value
 * @param panY The Y position Animated.Value
 * @param initialPosition Initial position {x, y}
 * @returns Object with transform styles
 */
export const createPanInterpolation = (
  panX: Animated.Value,
  panY: Animated.Value,
  initialPosition = { x: 0, y: 0 }
) => {
  return {
    transform: [
      { translateX: panX },
      { translateY: panY },
      {
        rotate: panX.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: ['-30deg', '0deg', '30deg'],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
};

/**
 * Creates an appearance animation that fades in and slightly scales up
 */
export const createAppearAnimation = (
  opacityValue: Animated.Value,
  scaleValue: Animated.Value
) => {
  return Animated.parallel([
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: durations.appear,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: durations.appear,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    }),
  ]);
};

/**
 * Creates a selection animation that slightly scales down when pressed
 */
export const createSelectAnimation = (scaleValue: Animated.Value) => {
  return Animated.timing(scaleValue, {
    toValue: 0.95,
    duration: durations.select,
    useNativeDriver: true,
    easing: Easing.inOut(Easing.cubic),
  });
};

/**
 * Creates a "swallow" animation for when a number is selected
 */
export const createSwallowAnimation = (
  selectedScale: Animated.Value,
  selectedOpacity: Animated.Value
) => {
  return Animated.parallel([
    Animated.timing(selectedScale, {
      toValue: 0.1,
      duration: durations.swallow,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.cubic),
    }),
    Animated.timing(selectedOpacity, {
      toValue: 0,
      duration: durations.swallow,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.cubic),
    }),
  ]);
};

/**
 * Creates a shake animation for when an error occurs
 */
export const createShakeAnimation = (
  positionX: Animated.Value,
  iterations: number = 6,
  distance: number = 10
) => {
  // Create a sequence of left-right movements
  const sequence = [];
  for (let i = 0; i < iterations; i++) {
    sequence.push(
      Animated.timing(positionX, {
        toValue: i % 2 === 0 ? distance : -distance,
        duration: durations.shake / iterations,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      })
    );
  }
  
  // Add final animation to return to center
  sequence.push(
    Animated.timing(positionX, {
      toValue: 0,
      duration: durations.shake / iterations,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.cubic),
    })
  );
  
  return Animated.sequence(sequence);
};

/**
 * Creates a zoom animation for highlighting a dice
 */
export const createZoomAnimation = (scaleValue: Animated.Value, zoomIn: boolean) => {
  return Animated.timing(scaleValue, {
    toValue: zoomIn ? 1.2 : 1,
    duration: durations.zoom,
    useNativeDriver: true,
    easing: zoomIn ? Easing.out(Easing.back(1.5)) : Easing.inOut(Easing.cubic),
  });
};

/**
 * Creates a pulse animation for drawing attention
 */
export const createPulseAnimation = (scaleValue: Animated.Value, iterations: number = 3) => {
  // Create a sequence of scale up/down movements
  const sequence = [];
  for (let i = 0; i < iterations; i++) {
    sequence.push(
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: durations.zoom / 2,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: durations.zoom / 2,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      })
    );
  }
  
  return Animated.sequence(sequence);
}; 