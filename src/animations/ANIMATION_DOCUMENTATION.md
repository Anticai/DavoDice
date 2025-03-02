# Blood Bowl Dice Calculator Animation System Documentation

## Overview

The Blood Bowl Dice Calculator features a comprehensive animation system designed to provide engaging visual feedback while maintaining performance across a wide range of devices. This documentation explains how to use the animation components, hooks, and utilities effectively.

## Animation Hooks

### useAccessibleAnimations

This hook provides animation options that respect user accessibility preferences.

```typescript
import { useAccessibleAnimations } from '../hooks/useAccessibleAnimations';

const MyComponent = () => {
  const { options, getAccessibleDuration } = useAccessibleAnimations();
  
  // Check if animations are enabled
  if (options.animationsEnabled) {
    // Get a duration that respects the user's duration scale preference
    const duration = getAccessibleDuration(300); // 300ms base duration
    
    // Use duration in animations
  }
};
```

#### Key Features:
- Respects system and user "reduce motion" preferences
- Provides scaled animation durations based on user settings
- Determines if animations should be simplified or disabled entirely

### useAnimationPerformance

This hook optimizes animations based on device capabilities for consistent performance.

```typescript
import { useAnimationPerformance } from '../hooks/useAnimationPerformance';

const MyComponent = () => {
  const { 
    config, 
    createOptimizedAnimation, 
    getOptimizedParticleCount,
    runOptimizedAnimations
  } = useAnimationPerformance();
  
  // Check performance level
  const isHighPerformance = config.level === 'high';
  
  // Get appropriate particle count for device
  const particleCount = getOptimizedParticleCount(50); // Request 50, get optimized count
  
  // Create optimized animation
  const animation = createOptimizedAnimation(
    [anim1, anim2, anim3],
    'stagger', // type: 'parallel' | 'sequence' | 'stagger'
    100 // stagger delay in ms
  );
  
  // Run animations with performance optimizations
  runOptimizedAnimations([anim1, anim2], () => {
    console.log('Animations completed');
  });
};
```

#### Key Features:
- Automatically detects device performance capabilities
- Provides optimized animation configurations
- Adjusts particle counts and animation complexity
- Monitors frame rate and adjusts quality dynamically
- Supports user-defined performance preferences

## Animation Components

### OptimizedParticleSystem

A performance-aware particle system that provides visual effects while adapting to device capabilities.

```typescript
import OptimizedParticleSystem from '../components/OptimizedParticleSystem';

const MyComponent = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  return (
    <View>
      <Button title="Celebrate!" onPress={() => setShowConfetti(true)} />
      
      <OptimizedParticleSystem
        type="confetti"
        count={50}
        duration={1500}
        x={100}
        y={100}
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </View>
  );
};
```

#### Available Particle Types:
- `confetti`: Colorful particles for celebrations
- `explosion`: Warm-colored particles that expand rapidly
- `sparkle`: Bright particles with a twinkling effect

#### Props:
- `type`: Particle effect type ('confetti', 'explosion', 'sparkle')
- `count`: Number of particles (will be optimized based on device performance)
- `duration`: Animation duration in milliseconds
- `x` & `y`: Coordinates for the center of the effect
- `trigger`: Boolean to start the animation
- `containerStyle`: Optional styles for the container
- `onComplete`: Callback function when animation completes

### NavigationTransition

A component that wraps screen content with configurable transitions.

```typescript
import NavigationTransition from '../components/NavigationTransition';

const MyScreen = () => {
  return (
    <NavigationTransition type="fade">
      <View>
        {/* Screen content */}
      </View>
    </NavigationTransition>
  );
};
```

#### Available Transition Types:
- `fade`: Simple opacity transition
- `slide`: Slide in/out transition
- `scale`: Scaling transition
- `none`: No transition (for performance-critical screens)

## Animation Utilities

### enhancedAnimations.ts

This module contains optimized animation functions for common UI interactions.

```typescript
import { 
  createReturnAnimation,
  createNumberShowAnimation,
  createShakeAnimation,
  createPulseAnimation,
  createEatingAnimation,
  createSelectAnimation,
  createZoomAnimation
} from '../animations/enhancedAnimations';

// Example: Create a return animation
const returnAnim = createReturnAnimation(animatedValue, {
  toValue: 0,
  duration: 300,
  useSpring: true
});

// Start the animation
returnAnim.start();
```

## Settings Screens

### AnimationSettingsScreen

Allows users to customize animation preferences for accessibility:
- Enable/disable animations
- Enable/disable reduced motion
- Follow system reduced motion setting
- Adjust animation speed

### PerformanceSettingsScreen

Allows users to control animation performance:
- Select quality preset (HIGH, MEDIUM, LOW, CRITICAL)
- Reset to automatic detection

## Performance Optimization Guidelines

### 1. Use the Native Driver

Always use the native driver when possible to offload animations to the device's GPU:

```typescript
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true
}).start();
```

### 2. Avoid Layout Animations

Avoid animating layout properties as they can't use the native driver:

```typescript
// Avoid
Animated.timing(width, {
  toValue: 100,
  duration: 300
}).start();

// Better: Use transform scale
Animated.timing(scale, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true
}).start();
```

### 3. Batch Animations

Use `runOptimizedAnimations` or `InteractionManager` to batch animations:

```typescript
const { runOptimizedAnimations } = useAnimationPerformance();

runOptimizedAnimations([anim1, anim2, anim3], () => {
  console.log('All animations complete');
});
```

### 4. Adapt to Performance Level

Check the performance level and adjust animation complexity:

```typescript
const { config } = useAnimationPerformance();

if (config.level === 'high') {
  // Use complex animations
} else {
  // Use simplified animations
}
```

### 5. Optimize Particles

For particle effects, always use the optimized particle count:

```typescript
const { getOptimizedParticleCount } = useAnimationPerformance();
const count = getOptimizedParticleCount(desiredCount);
```

## Testing Animations

When testing animations, use the following approaches:

1. **Frame Rate Testing**: Monitor FPS during animations using React DevTools or custom tools
2. **Low-End Device Testing**: Test on older devices to ensure acceptable performance
3. **Accessibility Testing**: Test with reduced motion and other accessibility settings enabled

## Common Issues and Solutions

### Animation Not Working on Android

If an animation works on iOS but not Android, check:
- Are you using the native driver?
- Are you animating properties that can't be animated on the native thread?

### Jerky or Slow Animations

If animations are jerky or slow:
- Use simpler easing functions (linear or quad instead of elastic)
- Reduce the number of concurrent animations
- Check if you're causing layout thrashing

### High Memory Usage

If your app has high memory usage with animations:
- Ensure you're stopping and clearing animations when components unmount
- Reduce particle count and complexity
- Use shared animated values when possible 