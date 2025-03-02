import { useEffect, useState, useRef } from 'react';
import { InteractionManager, Platform, Animated } from 'react-native';
import { useSettings } from './useSettings';

/**
 * Performance levels for animations
 */
export enum PerformanceLevel {
  HIGH = 'high',      // Full animations, particles, etc.
  MEDIUM = 'medium',  // Reduced complexity but still smooth
  LOW = 'low',        // Minimal animations for low-end devices
  CRITICAL = 'critical' // Bare minimum, almost no animations
}

/**
 * Performance settings configuration
 */
export interface PerformanceConfig {
  level: PerformanceLevel;
  maxParticleCount: number;
  useStaggeredAnimations: boolean;
  batchAnimations: boolean;
  useSimplifiedEasing: boolean;
}

// Default configurations for each performance level
const PERFORMANCE_CONFIGS: Record<PerformanceLevel, PerformanceConfig> = {
  [PerformanceLevel.HIGH]: {
    level: PerformanceLevel.HIGH,
    maxParticleCount: 100,
    useStaggeredAnimations: true,
    batchAnimations: false,
    useSimplifiedEasing: false
  },
  [PerformanceLevel.MEDIUM]: {
    level: PerformanceLevel.MEDIUM,
    maxParticleCount: 50,
    useStaggeredAnimations: true,
    batchAnimations: true,
    useSimplifiedEasing: false
  },
  [PerformanceLevel.LOW]: {
    level: PerformanceLevel.LOW,
    maxParticleCount: 20,
    useStaggeredAnimations: false,
    batchAnimations: true,
    useSimplifiedEasing: true
  },
  [PerformanceLevel.CRITICAL]: {
    level: PerformanceLevel.CRITICAL,
    maxParticleCount: 0,
    useStaggeredAnimations: false,
    batchAnimations: true,
    useSimplifiedEasing: true
  }
};

/**
 * Hook for optimizing animations based on device performance
 */
export const useAnimationPerformance = () => {
  const { settings } = useSettings();
  const [config, setConfig] = useState<PerformanceConfig>(PERFORMANCE_CONFIGS[PerformanceLevel.HIGH]);
  const frameDropCount = useRef(0);
  const lastFrameTime = useRef(0);
  const isMonitoringPerformance = useRef(false);
  const userOverrideLevel = useRef<PerformanceLevel | null>(null);

  // Auto-detect device performance on mount
  useEffect(() => {
    // Allow user setting to override auto-detection
    if (settings?.performanceLevel) {
      userOverrideLevel.current = settings.performanceLevel as PerformanceLevel;
      setConfig(PERFORMANCE_CONFIGS[settings.performanceLevel as PerformanceLevel]);
      return;
    }

    // Simple heuristic for initial performance level based on device
    const detectInitialPerformanceLevel = (): PerformanceLevel => {
      // Older devices or Android devices with lower memory
      if (Platform.OS === 'android') {
        // This is a very simple heuristic and could be improved
        return PerformanceLevel.MEDIUM;
      }
      
      // Default to high for newer iOS devices, could be more sophisticated
      return PerformanceLevel.HIGH;
    };

    const initialLevel = detectInitialPerformanceLevel();
    setConfig(PERFORMANCE_CONFIGS[initialLevel]);
    
    // Start monitoring after initial render
    InteractionManager.runAfterInteractions(() => {
      startPerformanceMonitoring();
    });
    
    return () => {
      stopPerformanceMonitoring();
    };
  }, [settings?.performanceLevel]);

  /**
   * Starts monitoring animation performance
   */
  const startPerformanceMonitoring = () => {
    if (isMonitoringPerformance.current) return;
    
    isMonitoringPerformance.current = true;
    frameDropCount.current = 0;
    lastFrameTime.current = Date.now();
    
    // Use requestAnimationFrame to monitor frame rate
    const monitorFrameRate = () => {
      if (!isMonitoringPerformance.current) return;
      
      const now = Date.now();
      const delta = now - lastFrameTime.current;
      
      // If frame took longer than ~20ms (less than 50fps), count as dropped frame
      if (delta > 20) {
        frameDropCount.current++;
      }
      
      lastFrameTime.current = now;
      
      // Every 60 frames, evaluate performance and adjust if needed
      if (frameDropCount.current > 10 && userOverrideLevel.current === null) {
        // If we're dropping frames, reduce performance level
        adjustPerformanceLevel(false);
        frameDropCount.current = 0;
      }
      
      requestAnimationFrame(monitorFrameRate);
    };
    
    requestAnimationFrame(monitorFrameRate);
  };

  /**
   * Stops performance monitoring
   */
  const stopPerformanceMonitoring = () => {
    isMonitoringPerformance.current = false;
  };

  /**
   * Adjusts the performance level based on device capabilities
   */
  const adjustPerformanceLevel = (increase: boolean) => {
    setConfig(current => {
      // Don't change if user has explicitly set a level
      if (userOverrideLevel.current !== null) {
        return current;
      }
      
      const currentLevel = current.level;
      let newLevel: PerformanceLevel;
      
      if (increase) {
        // Increase performance level if possible
        switch (currentLevel) {
          case PerformanceLevel.CRITICAL:
            newLevel = PerformanceLevel.LOW;
            break;
          case PerformanceLevel.LOW:
            newLevel = PerformanceLevel.MEDIUM;
            break;
          case PerformanceLevel.MEDIUM:
            newLevel = PerformanceLevel.HIGH;
            break;
          default:
            newLevel = PerformanceLevel.HIGH;
        }
      } else {
        // Decrease performance level if needed
        switch (currentLevel) {
          case PerformanceLevel.HIGH:
            newLevel = PerformanceLevel.MEDIUM;
            break;
          case PerformanceLevel.MEDIUM:
            newLevel = PerformanceLevel.LOW;
            break;
          case PerformanceLevel.LOW:
            newLevel = PerformanceLevel.CRITICAL;
            break;
          default:
            newLevel = PerformanceLevel.CRITICAL;
        }
      }
      
      // Only update if level actually changed
      if (newLevel !== currentLevel) {
        return PERFORMANCE_CONFIGS[newLevel];
      }
      
      return current;
    });
  };

  /**
   * Manually set a specific performance level
   */
  const setPerformanceLevel = (level: PerformanceLevel) => {
    userOverrideLevel.current = level;
    setConfig(PERFORMANCE_CONFIGS[level]);
  };

  /**
   * Creates a performance-optimized animation based on current settings
   */
  const createOptimizedAnimation = (
    animations: Animated.CompositeAnimation[],
    type: 'parallel' | 'sequence' | 'stagger' = 'parallel',
    staggerMs: number = 100
  ): Animated.CompositeAnimation => {
    // For critical performance level, only run the first animation
    if (config.level === PerformanceLevel.CRITICAL && animations.length > 1) {
      return animations[0];
    }
    
    // For low performance, don't use staggered animations
    if (type === 'stagger' && !config.useStaggeredAnimations) {
      return Animated.parallel(animations);
    }
    
    // Create appropriate animation type
    switch (type) {
      case 'sequence':
        return Animated.sequence(animations);
      case 'stagger':
        return Animated.stagger(staggerMs, animations);
      case 'parallel':
      default:
        return Animated.parallel(animations);
    }
  };

  /**
   * Gets the appropriate number of particles based on performance level
   */
  const getOptimizedParticleCount = (desiredCount: number): number => {
    // Cap based on performance level
    return Math.min(desiredCount, config.maxParticleCount);
  };

  /**
   * Runs animations with batching when needed to improve performance
   */
  const runOptimizedAnimations = (
    animations: Animated.CompositeAnimation[],
    callback?: () => void
  ) => {
    if (config.batchAnimations) {
      // Batch animations to reduce UI thread impact
      InteractionManager.runAfterInteractions(() => {
        const compositeAnimation = Animated.parallel(animations);
        compositeAnimation.start(callback);
      });
    } else {
      // Run animations immediately
      const compositeAnimation = Animated.parallel(animations);
      compositeAnimation.start(callback);
    }
  };

  return {
    config,
    setPerformanceLevel,
    createOptimizedAnimation,
    getOptimizedParticleCount,
    runOptimizedAnimations,
    startPerformanceMonitoring,
    stopPerformanceMonitoring
  };
};

export default useAnimationPerformance; 