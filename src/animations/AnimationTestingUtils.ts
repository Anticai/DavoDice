import { InteractionManager, Animated, LayoutAnimation } from 'react-native';
import { PerformanceLevel } from '../hooks/useAnimationPerformance';

/**
 * Animation testing utilities to help verify animation performance
 * and behavior across different devices and scenarios
 */

/**
 * Frame rate monitoring result
 */
export interface FrameRateResult {
  averageFps: number;
  minFps: number;
  maxFps: number;
  droppedFrames: number;
  duration: number;
}

/**
 * Monitors frame rate during an animation sequence 
 * 
 * @param callback Function that starts your animations
 * @param duration How long to monitor (ms)
 * @returns Promise that resolves with frame rate statistics
 */
export const monitorFrameRate = (
  callback: () => void,
  duration: number = 1000
): Promise<FrameRateResult> => {
  return new Promise((resolve) => {
    // Frame monitoring variables
    const frameTimestamps: number[] = [];
    let lastFrameTime = Date.now();
    let monitoring = true;
    
    // Initialize results
    const result: FrameRateResult = {
      averageFps: 0,
      minFps: 0,
      maxFps: 0,
      droppedFrames: 0,
      duration: 0
    };
    
    // Start callback after interactions are complete
    InteractionManager.runAfterInteractions(() => {
      // Start the animation
      callback();
      
      // Monitor frame function
      const monitorFrame = () => {
        if (!monitoring) return;
        
        const now = Date.now();
        const delta = now - lastFrameTime;
        
        // Record frame time
        frameTimestamps.push(delta);
        
        // Count dropped frames (assuming 60fps target, so frames taking >20ms)
        if (delta > 20) {
          result.droppedFrames++;
        }
        
        lastFrameTime = now;
        
        // Continue monitoring
        requestAnimationFrame(monitorFrame);
      };
      
      // Start monitoring
      requestAnimationFrame(monitorFrame);
      
      // Stop after duration
      setTimeout(() => {
        monitoring = false;
        
        // Calculate results
        const startTime = frameTimestamps[0] || 0;
        const totalTime = frameTimestamps.reduce((sum, time) => sum + time, 0);
        const frameCount = frameTimestamps.length;
        
        if (frameCount > 0) {
          // Calculate FPS statistics
          result.duration = totalTime;
          result.averageFps = Math.round(1000 / (totalTime / frameCount));
          
          // Find min/max FPS
          const maxFrameTime = Math.max(...frameTimestamps);
          const minFrameTime = Math.min(...frameTimestamps);
          
          result.minFps = Math.round(1000 / maxFrameTime);
          result.maxFps = Math.round(1000 / minFrameTime);
        }
        
        resolve(result);
      }, duration);
    });
  });
};

/**
 * Simulates different performance levels for testing
 * 
 * @param level The performance level to simulate
 * @param duration How long to simulate this level (ms)
 * @returns Promise that resolves when simulation is complete
 */
export const simulatePerformanceLevel = (
  level: PerformanceLevel,
  duration: number = 5000
): Promise<void> => {
  return new Promise((resolve) => {
    // Different strategies based on performance level
    switch (level) {
      case PerformanceLevel.LOW:
        // Create artificial load to simulate low performance
        const interval = setInterval(() => {
          // Do some expensive calculations
          for (let i = 0; i < 10000; i++) {
            Math.sqrt(Math.random() * 10000);
          }
        }, 16); // ~60fps interval
        
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, duration);
        break;
        
      case PerformanceLevel.CRITICAL:
        // Create heavy load to simulate critical performance
        const heavyInterval = setInterval(() => {
          // Do very expensive calculations
          for (let i = 0; i < 50000; i++) {
            Math.sqrt(Math.random() * 10000);
          }
        }, 16);
        
        setTimeout(() => {
          clearInterval(heavyInterval);
          resolve();
        }, duration);
        break;
        
      default:
        // For HIGH and MEDIUM, we don't add artificial load
        setTimeout(resolve, duration);
        break;
    }
  });
};

/**
 * Tests animation performance across all performance levels
 * 
 * @param callback Function that starts your animations
 * @param duration How long to monitor each level (ms)
 * @returns Promise that resolves with results for each level
 */
export const testAcrossPerformanceLevels = async (
  callback: () => void,
  duration: number = 1000
): Promise<Record<PerformanceLevel, FrameRateResult>> => {
  const results: Partial<Record<PerformanceLevel, FrameRateResult>> = {};
  
  // Test each performance level
  for (const level of Object.values(PerformanceLevel)) {
    // Simulate the performance level
    await simulatePerformanceLevel(level, 1000); // Warm up
    
    // Monitor frame rate with this level
    const result = await monitorFrameRate(callback, duration);
    results[level] = result;
  }
  
  return results as Record<PerformanceLevel, FrameRateResult>;
};

/**
 * Verifies that an animation only uses native driver compatible properties
 * 
 * @param animation The animation to test
 * @returns true if animation only uses native driver compatible properties
 */
export const isNativeDriverCompatible = (animation: Animated.CompositeAnimation): boolean => {
  // This is a simplistic check and can't catch all cases
  // A more comprehensive check would require internal React Native access
  
  // Check if animation has a _config property (implementation detail)
  const anyAnimation = animation as any;
  if (anyAnimation && anyAnimation._config) {
    // Check for useNativeDriver flag
    if (anyAnimation._config.useNativeDriver === false) {
      return false;
    }
    
    // Check for un-animatable properties
    const animatedProps = anyAnimation._config.animatedProps;
    if (animatedProps) {
      const nativeIncompatibleProps = [
        'width', 'height', 'top', 'left', 'bottom', 'right',
        'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
        'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
        'position'
      ];
      
      for (const prop of nativeIncompatibleProps) {
        if (prop in animatedProps) {
          return false;
        }
      }
    }
  }
  
  return true;
};

/**
 * Tests the memory usage of an animation
 * 
 * @param setupCallback Function that sets up your animation (creates Animated.Values etc)
 * @param animateCallback Function that starts your animations
 * @param iterations How many times to run the animation
 * @returns Memory usage estimate (not precise, only for comparison)
 */
export const testAnimationMemoryUsage = async (
  setupCallback: () => Animated.CompositeAnimation[],
  animateCallback: (animations: Animated.CompositeAnimation[]) => void,
  iterations: number = 10
): Promise<{ estimatedLoad: number }> => {
  // This is only a relative indicator, not an actual memory measurement
  // since React Native doesn't expose precise memory stats
  let totalLoadEstimate = 0;
  
  for (let i = 0; i < iterations; i++) {
    // Request a garbage collection if possible
    if (global.gc) {
      global.gc();
    }
    
    // Measure initial state - we'll use animation execution time as a proxy for load
    const startTime = Date.now();
    
    // Setup animations
    const animations = setupCallback();
    
    // Start animations
    animateCallback(animations);
    
    // Wait for animations to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate execution time - longer times suggest higher load
    const executionTime = Date.now() - startTime;
    totalLoadEstimate += executionTime;
    
    // Clean up animations
    animations.forEach(anim => anim.stop());
    
    // Short pause to let things settle
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return {
    estimatedLoad: totalLoadEstimate / iterations
  };
};

/**
 * Logs detailed animation performance report
 * 
 * @param animationName Name of the animation for reporting
 * @param callback Function that starts your animations
 */
export const logAnimationPerformance = async (
  animationName: string,
  callback: () => void
): Promise<void> => {
  console.log(`--- Animation Performance: ${animationName} ---`);
  
  // Test standard performance
  const result = await monitorFrameRate(callback, 1500);
  
  console.log(`Average FPS: ${result.averageFps}`);
  console.log(`Min FPS: ${result.minFps}`);
  console.log(`Max FPS: ${result.maxFps}`);
  console.log(`Dropped Frames: ${result.droppedFrames}`);
  console.log(`Duration: ${result.duration}ms`);
  
  // Performance rating
  let rating = 'Excellent';
  if (result.averageFps < 30) {
    rating = 'Poor';
  } else if (result.averageFps < 45) {
    rating = 'Fair';
  } else if (result.averageFps < 55) {
    rating = 'Good';
  }
  
  console.log(`Performance Rating: ${rating}`);
  
  if (result.averageFps < 55) {
    console.log('Optimization Suggestions:');
    console.log('- Use the native driver if possible');
    console.log('- Reduce animation complexity');
    console.log('- Batch animations');
    console.log('- Consider simpler easing functions');
  }
  
  console.log('---------------------------------------');
};

export default {
  monitorFrameRate,
  simulatePerformanceLevel,
  testAcrossPerformanceLevels,
  isNativeDriverCompatible,
  testAnimationMemoryUsage,
  logAnimationPerformance
}; 