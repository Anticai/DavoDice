import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import * as enhancedAnimations from '../animations/enhancedAnimations';
import ParticleSystem from '../components/ParticleSystem';

const AnimationExampleScreen: React.FC = () => {
  const { colors } = useTheme();
  
  // Create animated values
  const positionX = useRef(new Animated.Value(0)).current;
  const positionY = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const numberShowProgress = useRef(new Animated.Value(0)).current;
  const zoomScale = useRef(new Animated.Value(1)).current;
  
  // State for particle effects
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  
  // Create animated styles
  const diceStyle = {
    transform: [
      { translateX: positionX },
      { translateY: positionY },
      { rotate: rotation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-30deg', '0deg', '30deg'],
      })},
      { scale }
    ],
    opacity,
  };
  
  const numberStyle = {
    opacity: numberShowProgress,
    transform: [
      { scale: numberShowProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
      })},
    ],
  };
  
  const zoomStyle = {
    transform: [{ scale: zoomScale }]
  };
  
  // Animation handlers
  const runReturnAnimation = () => {
    // First, set some random offset to simulate dice being thrown
    positionX.setValue(Math.random() * 100 - 50);
    positionY.setValue(Math.random() * 100 - 50);
    rotation.setValue(Math.random() * 2 - 1);
    
    // Then run the return animation
    enhancedAnimations.createEnhancedReturnAnimation(
      positionX, 
      positionY, 
      rotation
    ).start();
  };
  
  const runNumberShowAnimation = () => {
    // Reset progress value
    numberShowProgress.setValue(0);
    
    // Run the animation
    enhancedAnimations.createEnhancedNumberShowAnimation(
      numberShowProgress
    ).start();
  };
  
  const runShakeAnimation = () => {
    enhancedAnimations.createEnhancedShakeAnimation(positionX).start();
  };
  
  const runEatingAnimation = () => {
    // Reset values
    scale.setValue(1);
    opacity.setValue(1);
    
    // Run animation
    enhancedAnimations.createEnhancedEatingAnimation(scale, opacity).start(() => {
      // Reset after completion
      setTimeout(() => {
        opacity.setValue(1);
        scale.setValue(1);
      }, 500);
    });
  };
  
  const runPulseAnimation = () => {
    // Reset scale
    scale.setValue(1);
    
    // Run animation
    enhancedAnimations.createEnhancedPulseAnimation(scale).start();
  };
  
  const runSelectAnimation = () => {
    // Reset scale
    scale.setValue(1);
    
    // Run animation
    enhancedAnimations.createEnhancedSelectAnimation(scale).start();
  };
  
  const runZoomSequence = () => {
    // Reset scale
    zoomScale.setValue(1);
    
    // Run the zoom sequence
    enhancedAnimations.createEnhancedZoomSequence(zoomScale).start();
  };
  
  // Particle effect handlers
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };
  
  const triggerExplosion = () => {
    setShowExplosion(true);
    setTimeout(() => setShowExplosion(false), 1500);
  };
  
  const triggerSparkle = () => {
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 1000);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Enhanced Animation Examples
      </Text>
      
      <View style={styles.diceContainer}>
        <Animated.View style={[styles.dice, diceStyle, { backgroundColor: colors.primary }]}>
          <Text style={styles.diceText}>D6</Text>
          
          <Animated.View style={[styles.numberOverlay, numberStyle]}>
            <Text style={styles.numberText}>5</Text>
          </Animated.View>
        </Animated.View>
        
        <Animated.View style={[styles.zoomDice, zoomStyle, { backgroundColor: colors.secondary }]}>
          <Text style={styles.diceText}>Z</Text>
        </Animated.View>
      </View>
      
      {/* Particle effects */}
      {showConfetti && (
        <ParticleSystem
          x={150}
          y={120}
          type="confetti"
          count={40}
          duration={1500}
          trigger={showConfetti}
          onComplete={() => setShowConfetti(false)}
        />
      )}
      
      {showExplosion && (
        <ParticleSystem
          x={250}
          y={120}
          type="explosion"
          count={30}
          duration={1000}
          trigger={showExplosion}
          onComplete={() => setShowExplosion(false)}
        />
      )}
      
      {showSparkle && (
        <ParticleSystem
          x={200}
          y={120}
          type="sparkle"
          count={25}
          duration={800}
          trigger={showSparkle}
          onComplete={() => setShowSparkle(false)}
        />
      )}
      
      <View style={styles.controls}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Dice Animations
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={runReturnAnimation}
          >
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={runNumberShowAnimation}
          >
            <Text style={styles.buttonText}>Show Number</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={runShakeAnimation}
          >
            <Text style={styles.buttonText}>Shake</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={runEatingAnimation}
          >
            <Text style={styles.buttonText}>Eating</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={runPulseAnimation}
          >
            <Text style={styles.buttonText}>Pulse</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={runSelectAnimation}
          >
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={runZoomSequence}
          >
            <Text style={styles.buttonText}>Zoom</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: 20 }]}>
          Particle Effects
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.status.success }]} 
            onPress={triggerConfetti}
          >
            <Text style={styles.buttonText}>Confetti</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.status.error }]} 
            onPress={triggerExplosion}
          >
            <Text style={styles.buttonText}>Explosion</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.secondary }]} 
            onPress={triggerSparkle}
          >
            <Text style={styles.buttonText}>Sparkle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  diceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 200,
  },
  dice: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomDice: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  diceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  numberOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  numberText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  controls: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    margin: 4,
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AnimationExampleScreen; 