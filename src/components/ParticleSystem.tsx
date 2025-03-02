import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
  color: string;
}

interface ParticleSystemProps {
  x: number;
  y: number;
  count?: number;
  duration?: number;
  spread?: number;
  gravity?: number;
  type?: 'confetti' | 'explosion' | 'sparkle';
  colors?: string[];
  trigger?: boolean;
  onComplete?: () => void;
}

/**
 * A reusable particle system component for creating various effects
 * like confetti, explosions, or sparkles.
 */
export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  x,
  y,
  count = 20,
  duration = 1000,
  spread = 100,
  gravity = 800,
  type = 'confetti',
  colors,
  trigger = false,
  onComplete,
}) => {
  const { colors: themeColors } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const isAnimating = useRef(false);
  
  // Determine colors based on type if not provided
  const particleColors = colors || 
    (type === 'confetti' 
      ? [themeColors.primary, themeColors.secondary, themeColors.status.success, themeColors.status.warning]
      : type === 'explosion' 
        ? [themeColors.status.error, '#FF7D00', '#FFD700'] 
        : [themeColors.primary + '80', themeColors.primary + 'B0', themeColors.primary]);
  
  // Generate random particles
  const generateParticles = () => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        scale: new Animated.Value(type === 'confetti' ? 0.8 + Math.random() * 0.4 : 0.5 + Math.random() * 0.5),
        rotation: new Animated.Value(0),
        opacity: new Animated.Value(1),
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }
    
    setParticles(newParticles);
    return newParticles;
  };
  
  // Create animation for a single particle
  const createParticleAnimation = (particle: Particle) => {
    // Set initial values
    particle.x.setValue(0);
    particle.y.setValue(0);
    particle.opacity.setValue(1);
    
    // Random spread values based on particle system type
    const angleOffset = Math.PI * (Math.random() - 0.5) * (type === 'explosion' ? 2 : 1);
    const angle = type === 'confetti' 
      ? Math.PI * 1.5 + angleOffset // Up direction with spread
      : Math.random() * Math.PI * 2; // All directions (explosion)
    
    const speed = type === 'confetti' 
      ? 200 + Math.random() * 200 
      : 100 + Math.random() * 300;
    
    const xDistance = Math.cos(angle) * speed * (Math.random() * 0.5 + 0.5);
    const yDistance = Math.sin(angle) * speed * (Math.random() * 0.5 + 0.5);
    
    // For confetti and sparkle, apply gravity; for explosion, radiate outward
    const xAnimation = Animated.timing(particle.x, {
      toValue: xDistance,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    });
    
    const yAnimation = Animated.timing(particle.y, {
      toValue: type === 'explosion' ? yDistance : yDistance + gravity,
      duration,
      useNativeDriver: true,
      easing: type === 'explosion' 
        ? Easing.out(Easing.quad) 
        : Easing.bezier(0.17, 0.67, 0.83, 0.67), // Custom curve for gravity
    });
    
    // Rotation animation
    const rotationAnimation = Animated.timing(particle.rotation, {
      toValue: (Math.random() - 0.5) * 10, // Random rotation (5 full turns in either direction)
      duration,
      useNativeDriver: true,
      easing: Easing.linear,
    });
    
    // Fade out towards the end
    const opacityAnimation = Animated.timing(particle.opacity, {
      toValue: 0,
      duration: duration * 0.8, // Fade out in last 20% of animation
      delay: duration * 0.2,
      useNativeDriver: true,
      easing: Easing.linear,
    });
    
    // Scale animation based on type
    const scaleAnimation = type === 'sparkle' 
      ? Animated.sequence([
          // Sparkle grows then shrinks
          Animated.timing(particle.scale, {
            toValue: 1.5,
            duration: duration * 0.3,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: duration * 0.7,
            useNativeDriver: true,
            easing: Easing.in(Easing.cubic),
          }),
        ])
      : Animated.timing(particle.scale, {
          // Other particles just fade out
          toValue: type === 'explosion' ? 0 : 0.5, // Just use a fixed scale reduction for simplicity
          duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        });
    
    return Animated.parallel([
      xAnimation,
      yAnimation,
      rotationAnimation,
      opacityAnimation,
      scaleAnimation,
    ]);
  };
  
  // Run the complete particle system animation
  const runAnimation = (newParticles: Particle[]) => {
    if (isAnimating.current) {
      return;
    }
    
    isAnimating.current = true;
    
    // Create animations for all particles
    const animations = newParticles.map(particle => createParticleAnimation(particle));
    
    // Run all particle animations in parallel
    animationRef.current = Animated.parallel(animations);
    
    // Start the animation
    animationRef.current.start(() => {
      isAnimating.current = false;
      if (onComplete) {
        onComplete();
      }
    });
  };
  
  // Respond to trigger changes
  useEffect(() => {
    if (trigger && !isAnimating.current) {
      const newParticles = generateParticles();
      runAnimation(newParticles);
    }
  }, [trigger]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);
  
  // Get the particle size based on type
  const getParticleSize = () => {
    switch (type) {
      case 'confetti':
        return { width: 8, height: 8 };
      case 'explosion':
        return { width: 6, height: 6 };
      case 'sparkle':
        return { width: 4, height: 4 };
      default:
        return { width: 6, height: 6 };
    }
  };
  
  // Get the particle shape based on type
  const getParticleStyle = (type: ParticleSystemProps['type']) => {
    switch (type) {
      case 'confetti':
        return { borderRadius: 2 }; // Rectangle with slightly rounded corners
      case 'explosion':
        return { borderRadius: 10 }; // Circle
      case 'sparkle':
        return { borderRadius: 10 }; // Circle
      default:
        return { borderRadius: 10 };
    }
  };
  
  const { width, height } = getParticleSize();
  const shapeStyle = getParticleStyle(type);
  
  return (
    <View style={[styles.container, { left: x - width / 2, top: y - height / 2 }]}>
      {particles.map(particle => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            shapeStyle,
            { width, height, backgroundColor: particle.color },
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { rotate: particle.rotation.interpolate({
                  inputRange: [-10, 0, 10],
                  outputRange: ['-3600deg', '0deg', '3600deg'],
                })},
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000, // Ensure particles appear on top
    pointerEvents: 'none', // Don't intercept touch events
  },
  particle: {
    position: 'absolute',
  },
});

export default ParticleSystem; 