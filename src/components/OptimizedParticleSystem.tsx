import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { useAnimationPerformance } from '../hooks/useAnimationPerformance';
import { useAccessibleAnimations } from '../hooks/useAccessibleAnimations';

export type ParticleType = 'confetti' | 'explosion' | 'sparkle';

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
}

interface ParticleSystemProps {
  type: ParticleType;
  count?: number;
  duration?: number;
  x?: number;
  y?: number;
  trigger?: boolean;
  containerStyle?: ViewStyle;
  onComplete?: () => void;
}

/**
 * An optimized particle system component that adjusts performance based on device capabilities
 * 
 * Supports confetti, explosion, and sparkle effects with performance optimizations
 */
const OptimizedParticleSystem: React.FC<ParticleSystemProps> = ({
  type = 'confetti',
  count: requestedCount = 50,
  duration = 1500,
  x = 0,
  y = 0,
  trigger = false,
  containerStyle,
  onComplete,
}) => {
  // Get animation performance settings
  const { getOptimizedParticleCount, createOptimizedAnimation, config } = useAnimationPerformance();
  const { options: accessibilityOptions } = useAccessibleAnimations();
  
  // Adjust count based on performance level
  const count = getOptimizedParticleCount(requestedCount);
  
  // No particles if animations disabled or in critical performance mode with zero count
  if (!accessibilityOptions.animationsEnabled || count === 0) {
    // Still call onComplete to maintain app flow
    useEffect(() => {
      if (trigger && onComplete) {
        onComplete();
      }
    }, [trigger, onComplete]);
    
    return null;
  }
  
  // State to track particle animations
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);
  const activeAnimations = useRef<Animated.CompositeAnimation[]>([]);
  const animationRunning = useRef(false);
  
  // Generate particle colors based on type
  const getColors = (): string[] => {
    switch (type) {
      case 'confetti':
        return ['#ff4d4d', '#4d94ff', '#4dff4d', '#ffff4d', '#ff4dff', '#4dffff'];
      case 'explosion':
        return ['#ff6b4d', '#ff894d', '#ffaa4d', '#ffd04d', '#ffe74d'];
      case 'sparkle':
        return ['#ffffff', '#f0f0f0', '#e0e0e0', '#ffff99', '#ffe0b3'];
      default:
        return ['#ffffff'];
    }
  };
  
  // Generate particles with initial values
  const generateParticles = () => {
    const colors = getColors();
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4, // 4-10px
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
    
    return newParticles;
  };
  
  // Create particle animations based on type
  const createParticleAnimations = (particle: Particle): Animated.CompositeAnimation => {
    const { x, y, rotation, scale, opacity } = particle;
    
    // Set initial values
    x.setValue(0);
    y.setValue(0);
    rotation.setValue(0);
    scale.setValue(0);
    opacity.setValue(0);
    
    // Calculate random values for movement
    const angle = Math.random() * Math.PI * 2; // Random direction
    const speed = Math.random() * 150 + 50; // Random speed
    const distance = type === 'explosion' ? 150 : 100;
    const rotationAmount = Math.random() * 10 - 5; // Random rotation
    
    // Calculate end positions
    const endX = Math.cos(angle) * distance * (Math.random() + 0.5);
    const endY = Math.sin(angle) * distance * (Math.random() + 0.5);
    
    // Create animation sequence based on particle type
    switch (type) {
      case 'confetti': {
        // Simplified animations for low performance mode
        if (config.useSimplifiedEasing) {
          return Animated.parallel([
            Animated.timing(x, {
              toValue: endX,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.timing(y, {
              toValue: endY,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.timing(rotation, {
              toValue: rotationAmount,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0,
                duration: duration * 0.8,
                useNativeDriver: true,
                delay: duration * 0.4,
              }),
            ]),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: duration * 0.1,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: duration * 0.3,
                useNativeDriver: true,
                delay: duration * 0.6,
              }),
            ]),
          ]);
        }
        
        // Full animation for higher performance devices
        return Animated.parallel([
          Animated.timing(x, {
            toValue: endX,
            duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.215, 0.61, 0.355, 1),
          }),
          Animated.timing(y, {
            toValue: endY,
            duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.215, 0.61, 0.355, 1),
          }),
          Animated.timing(rotation, {
            toValue: rotationAmount,
            duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.215, 0.61, 0.355, 1),
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1,
              duration: duration * 0.2,
              useNativeDriver: true,
              easing: Easing.out(Easing.back(1.5)),
            }),
            Animated.timing(scale, {
              toValue: 0,
              duration: duration * 0.8,
              useNativeDriver: true,
              delay: duration * 0.4,
              easing: Easing.in(Easing.cubic),
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: duration * 0.1,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.3,
              useNativeDriver: true,
              delay: duration * 0.6,
              easing: Easing.in(Easing.quad),
            }),
          ]),
        ]);
      }
      
      case 'explosion': {
        // Simplified explosion for lower performance
        if (config.useSimplifiedEasing) {
          return Animated.parallel([
            Animated.timing(x, {
              toValue: endX,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.timing(y, {
              toValue: endY,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0,
                duration: duration * 0.7,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: duration * 0.6,
                useNativeDriver: true,
                delay: duration * 0.2,
              }),
            ]),
          ]);
        }
        
        // Full explosion animation
        return Animated.parallel([
          Animated.timing(x, {
            toValue: endX,
            duration,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
          }),
          Animated.timing(y, {
            toValue: endY,
            duration,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
          }),
          Animated.timing(rotation, {
            toValue: rotationAmount * 2,
            duration,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.5,
              duration: duration * 0.3,
              useNativeDriver: true,
              easing: Easing.out(Easing.back(1.2)),
            }),
            Animated.timing(scale, {
              toValue: 0,
              duration: duration * 0.7,
              useNativeDriver: true,
              easing: Easing.in(Easing.cubic),
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.6,
              useNativeDriver: true,
              delay: duration * 0.2,
              easing: Easing.in(Easing.quad),
            }),
          ]),
        ]);
      }
      
      case 'sparkle': {
        // Simpler sparkle for lower performance
        if (config.useSimplifiedEasing) {
          return Animated.parallel([
            Animated.timing(x, {
              toValue: endX * 0.7,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.timing(y, {
              toValue: endY * 0.7,
              duration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 0.8,
                duration: duration * 0.5,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0,
                duration: duration * 0.5,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 0.8,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: duration * 0.7,
                useNativeDriver: true,
              }),
            ]),
          ]);
        }
        
        // Full sparkle animation
        return Animated.parallel([
          Animated.timing(x, {
            toValue: endX * 0.7,
            duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          }),
          Animated.timing(y, {
            toValue: endY * 0.7,
            duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          }),
          Animated.timing(rotation, {
            toValue: rotationAmount * 0.5,
            duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.2,
              duration: duration * 0.2,
              useNativeDriver: true,
              easing: Easing.out(Easing.back(1.5)),
            }),
            Animated.timing(scale, {
              toValue: 0,
              duration: duration * 0.8,
              useNativeDriver: true,
              easing: Easing.in(Easing.cubic),
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.7,
              useNativeDriver: true,
              delay: duration * 0.1,
              easing: Easing.in(Easing.quad),
            }),
          ]),
        ]);
      }
      
      default:
        return Animated.parallel([]);
    }
  };
  
  // Start the particle animation
  const startAnimation = () => {
    if (animationRunning.current) return;
    animationRunning.current = true;
    
    // Generate particles
    const newParticles = generateParticles();
    setParticles(newParticles);
    setIsActive(true);
    
    // Create and start animations
    const animations: Animated.CompositeAnimation[] = [];
    
    newParticles.forEach(particle => {
      animations.push(createParticleAnimations(particle));
    });
    
    // Store animations for cleanup
    activeAnimations.current = animations;
    
    // Create optimized animation based on performance level
    const optimizedAnimation = createOptimizedAnimation(
      animations,
      config.useStaggeredAnimations ? 'stagger' : 'parallel',
      20
    );
    
    // Start the animation
    optimizedAnimation.start(() => {
      // Cleanup after animation completes
      setIsActive(false);
      animationRunning.current = false;
      
      if (onComplete) {
        onComplete();
      }
    });
  };
  
  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      activeAnimations.current.forEach(anim => anim.stop());
    };
  }, []);
  
  // Start animation when trigger changes to true
  useEffect(() => {
    if (trigger && !isActive) {
      startAnimation();
    }
  }, [trigger]);
  
  // Render nothing if not active
  if (!isActive) {
    return null;
  }
  
  // Render particles
  return (
    <View style={[styles.container, containerStyle, { left: x, top: y }]}>
      {particles.map(particle => {
        // Determine shape component based on particle type
        let particleComponent;
        
        switch (particle.shape) {
          case 'square':
            particleComponent = (
              <View
                style={[
                  styles.square,
                  {
                    backgroundColor: particle.color,
                    width: particle.size,
                    height: particle.size,
                  },
                ]}
              />
            );
            break;
          
          case 'triangle':
            particleComponent = (
              <View
                style={[
                  styles.triangle,
                  {
                    borderBottomColor: particle.color,
                    borderBottomWidth: particle.size,
                    borderLeftWidth: particle.size / 2,
                    borderRightWidth: particle.size / 2,
                  },
                ]}
              />
            );
            break;
          
          case 'circle':
          default:
            particleComponent = (
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: particle.color,
                    width: particle.size,
                    height: particle.size,
                    borderRadius: particle.size / 2,
                  },
                ]}
              />
            );
        }
        
        // Apply transformations to the particle
        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { rotate: particle.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })},
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            {particleComponent}
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1,
    height: 1,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
  },
  circle: {
    position: 'absolute',
  },
  square: {
    position: 'absolute',
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default OptimizedParticleSystem; 