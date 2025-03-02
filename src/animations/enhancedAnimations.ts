import { Animated, Easing } from 'react-native';

/**
 * Enhanced animation utilities for smoother, more fluid animations
 * These can be integrated gradually to replace existing animation functions
 */

/**
 * Creates a smooth, physics-based return animation for the dice
 * 
 * @param positionX X position Animated.Value
 * @param positionY Y position Animated.Value
 * @param rotation Rotation Animated.Value
 * @returns Composite animation
 */
export const createEnhancedReturnAnimation = (
  positionX: Animated.Value,
  positionY: Animated.Value,
  rotation: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.parallel([
    // Use spring for more natural movement
    Animated.spring(positionX, {
      toValue: 0,
      useNativeDriver: true,
      friction: 6,
      tension: 40,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }),
    Animated.spring(positionY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 6,
      tension: 40,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }),
    // Use spring for more natural rotation
    Animated.spring(rotation, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
      tension: 35,
    })
  ]);
};

/**
 * Creates an enhanced animation for displaying numbers with a more fluid motion
 * 
 * @param animValue The Animated.Value to animate
 * @returns Composite animation
 */
export const createEnhancedNumberShowAnimation = (
  animValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.timing(animValue, {
    toValue: 1,
    duration: 350,
    useNativeDriver: true,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Improved easing for smoother motion
  });
};

/**
 * Creates an enhanced shake animation with more realistic physics
 * 
 * @param positionX X position Animated.Value
 * @returns Composite animation
 */
export const createEnhancedShakeAnimation = (
  positionX: Animated.Value
): Animated.CompositeAnimation => {
  // Create sequence of movements for more realistic shaking
  const sequence = [
    Animated.timing(positionX, {
      toValue: -8,
      duration: 80,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(positionX, {
      toValue: 8,
      duration: 90,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(positionX, {
      toValue: -6,
      duration: 80,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(positionX, {
      toValue: 6,
      duration: 80,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(positionX, {
      toValue: -4,
      duration: 70,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(positionX, {
      toValue: 4,
      duration: 70,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(positionX, {
      toValue: 0,
      duration: 60,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.sin),
    }),
  ];

  return Animated.sequence(sequence);
};

/**
 * Creates an enhanced eating animation with improved fluidity and responsiveness
 * This version provides a more natural and visually appealing animation
 * @param animValue - The animation value to drive the animation
 * @param opacityValue - Optional opacity value for additional effects
 * @returns Animated.CompositeAnimation - The composite animation that can be started
 */
export const createEnhancedEatingAnimation = (
  animValue: Animated.Value,
  opacityValue: Animated.Value
): Animated.CompositeAnimation => {
  // Improve the timing configuration for a more fluid animation
  return Animated.timing(animValue, {
    toValue: 1,
    duration: 400, // Slightly faster for better responsiveness
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom bezier curve for more natural motion
    useNativeDriver: true,
  });
};

/**
 * Creates a more responsive pulse animation
 * 
 * @param scaleValue Scale Animated.Value
 * @param iterations Number of pulse iterations
 * @returns Composite animation
 */
export const createEnhancedPulseAnimation = (
  scaleValue: Animated.Value,
  iterations: number = 3
): Animated.CompositeAnimation => {
  const sequence = [];
  
  // Add initial delay
  sequence.push(Animated.delay(100));
  
  // Create smooth pulse iterations
  for (let i = 0; i < iterations; i++) {
    sequence.push(
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.sin),
      })
    );
    
    sequence.push(
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.sin),
      })
    );
  }
  
  return Animated.sequence(sequence);
};

/**
 * Creates a bouncy animation for dice selection
 * 
 * @param scaleValue Scale Animated.Value
 * @returns Composite animation
 */
export const createEnhancedSelectAnimation = (
  scaleValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.spring(scaleValue, {
    toValue: 1.1,
    useNativeDriver: true,
    friction: 7,
    tension: 40,
    speed: 12,
  });
};

/**
 * Utility function to create a sequence of animations with staggered timing
 * 
 * @param animations Array of animation functions
 * @param staggerMs Milliseconds between animations
 * @returns Composite animation
 */
export const createStaggeredSequence = (
  animations: Animated.CompositeAnimation[],
  staggerMs: number = 50
): Animated.CompositeAnimation => {
  return Animated.stagger(
    staggerMs,
    animations
  );
};

/**
 * Creates an enhanced zoom in animation for highlighting failed dice
 * 
 * @param scaleValue Scale Animated.Value
 * @returns Animated.CompositeAnimation
 */
export const createEnhancedZoomInAnimation = (
  scaleValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.spring(scaleValue, {
    toValue: 1.3,
    friction: 7,
    tension: 40,
    useNativeDriver: true,
  });
};

/**
 * Creates an enhanced zoom out animation
 * 
 * @param scaleValue Scale Animated.Value
 * @returns Animated.CompositeAnimation
 */
export const createEnhancedZoomOutAnimation = (
  scaleValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.spring(scaleValue, {
    toValue: 1,
    friction: 7,
    tension: 40,
    useNativeDriver: true,
  });
};

/**
 * Creates an enhanced zoom animation sequence (zoom in, delay, zoom out)
 * 
 * @param scaleValue Scale Animated.Value
 * @param delayMs Delay in milliseconds between zoom in and zoom out
 * @returns Animated.CompositeAnimation
 */
export const createEnhancedZoomSequence = (
  scaleValue: Animated.Value,
  delayMs: number = 800
): Animated.CompositeAnimation => {
  return Animated.sequence([
    createEnhancedZoomInAnimation(scaleValue),
    Animated.delay(delayMs),
    createEnhancedZoomOutAnimation(scaleValue)
  ]);
};

/**
 * Creates a staggered roll animation for multiple dice
 * Each dice will animate with a slight delay for a more natural and engaging effect
 * 
 * @param rotationValues Array of rotation Animated.Values for each dice
 * @param scaleValues Array of scale Animated.Values for each dice
 * @param staggerMs Delay between each dice animation start (in ms)
 * @returns Animated.CompositeAnimation
 */
export const createStaggeredDiceRollAnimation = (
  rotationValues: Animated.Value[],
  scaleValues: Animated.Value[],
  staggerMs: number = 80
): Animated.CompositeAnimation => {
  // Create individual animations for each dice
  const animations = rotationValues.map((rotation, index) => {
    const scale = scaleValues[index];
    
    // Create a sequence for each dice: scale up while rotating, then scale back
    return Animated.sequence([
      // Scale up and rotate
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 2, // 2 full rotations (720 degrees)
          duration: 700,
          useNativeDriver: true,
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.275), // Custom easing for dynamic motion
        }),
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Scale back with slight bounce
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);
  });
  
  // Return a staggered animation of all the individual animations
  return Animated.stagger(staggerMs, animations);
};

/**
 * Creates a staggered success animation for multiple dice
 * Highlights successful dice one by one with a scale and pulse effect
 * 
 * @param scaleValues Array of scale Animated.Values for successful dice
 * @param opacityValues Array of opacity Animated.Values for highlighting
 * @param staggerMs Delay between each dice animation start (in ms)
 * @returns Animated.CompositeAnimation
 */
export const createStaggeredSuccessAnimation = (
  scaleValues: Animated.Value[],
  opacityValues: Animated.Value[],
  staggerMs: number = 150
): Animated.CompositeAnimation => {
  // Create individual animations for each successful dice
  const animations = scaleValues.map((scale, index) => {
    const opacity = opacityValues[index];
    
    return Animated.sequence([
      // Scale up and fade in highlight
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.3,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.7, // Semi-transparent highlight
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
      // Hold for a moment
      Animated.delay(200),
      // Scale down and fade out
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]);
  });
  
  // Return a staggered animation of all the individual animations
  return Animated.stagger(staggerMs, animations);
};

/**
 * Screen Transition Animations
 * These functions are designed to work with React Navigation to create
 * smooth, custom transitions between screens
 */

/**
 * Creates a slide transition animation configuration for React Navigation
 * 
 * @param direction 'horizontal' | 'vertical' - direction of the slide
 * @param duration Number - duration of the animation in ms
 * @returns Object with animation configurations
 */
export const createSlideTransition = (
  direction: 'horizontal' | 'vertical' = 'horizontal',
  duration: number = 350
): any => {
  const isHorizontal = direction === 'horizontal';
  
  return {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
      },
    },
    screenInterpolator: ({ layout, position, scene }: any) => {
      const { index } = scene;
      const { initWidth, initHeight } = layout;
      
      const width = isHorizontal ? initWidth : 0;
      const height = isHorizontal ? 0 : initHeight;
      
      const translateValue = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [isHorizontal ? width : height, 0, isHorizontal ? -width * 0.3 : -height * 0.3],
      });
      
      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1],
      });
      
      return {
        opacity,
        transform: isHorizontal 
          ? [{ translateX: translateValue }]
          : [{ translateY: translateValue }],
      };
    },
  };
};

/**
 * Creates a fade transition animation configuration for React Navigation
 * 
 * @param duration Number - duration of the animation in ms
 * @returns Object with animation configurations
 */
export const createFadeTransition = (duration: number = 300): any => {
  return {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration,
          easing: Easing.out(Easing.cubic),
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration,
          easing: Easing.in(Easing.cubic),
        },
      },
    },
    screenInterpolator: ({ position, scene }: any) => {
      const { index } = scene;
      
      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
      });
      
      const scaleValue = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0.95, 1],
      });
      
      return {
        opacity,
        transform: [{ scale: scaleValue }],
      };
    },
  };
};

/**
 * Creates a modal presentation animation configuration for React Navigation
 * 
 * @param duration Number - duration of the animation in ms
 * @returns Object with animation configurations
 */
export const createModalTransition = (duration: number = 400): any => {
  return {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: duration * 0.75, // Close a bit faster
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
      },
    },
    screenInterpolator: ({ layout, position, scene }: any) => {
      const { index } = scene;
      const { initHeight } = layout;
      
      const translateY = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [initHeight, 0],
      });
      
      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.5, index],
        outputRange: [0, 0.5, 1],
      });
      
      const scaleValue = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0.98, 1],
      });
      
      return {
        opacity,
        transform: [
          { translateY },
          { scale: scaleValue },
        ],
      };
    },
  };
};

/**
 * Creates a shared element transition animation for React Navigation
 * This is useful for transitioning elements between screens with a fluid motion
 * 
 * @param startX Starting X position
 * @param startY Starting Y position
 * @param startScale Starting scale
 * @param endX Ending X position
 * @param endY Ending Y position
 * @param endScale Ending scale
 * @param duration Animation duration in ms
 * @returns Animated.CompositeAnimation
 */
export const createSharedElementTransition = (
  element: any,
  startX: number,
  startY: number,
  startScale: number,
  endX: number,
  endY: number,
  endScale: number,
  duration: number = 350
): Animated.CompositeAnimation => {
  // Create animated values for position and scale
  const posX = new Animated.Value(startX);
  const posY = new Animated.Value(startY);
  const scale = new Animated.Value(startScale);
  
  // Instead of setting value directly, let's assume element has transform properties
  // that can be updated by the caller after animation is created
  
  // Return animation sequence
  return Animated.parallel([
    Animated.timing(posX, {
      toValue: endX,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
    Animated.timing(posY, {
      toValue: endY,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
    Animated.timing(scale, {
      toValue: endScale,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  ]);
}; 