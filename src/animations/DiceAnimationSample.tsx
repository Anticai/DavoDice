import React, { useRef, useState } from 'react';
import { 
  View, 
  PanResponder, 
  Animated, 
  StyleSheet, 
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { 
  createEnhancedReturnAnimation,
  createEnhancedNumberShowAnimation,
  createEnhancedShakeAnimation,
  createEnhancedPulseAnimation
} from './enhancedAnimations';

/**
 * Sample implementation of enhanced dice animations
 * This is a reference implementation showing how to integrate the enhanced animations
 */
const EnhancedDice: React.FC = () => {
  const { colors } = useTheme();
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  // Animation values
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;
  const animationProgress = useRef(new Animated.Value(0)).current;
  
  // Create transform styles
  const transform = [
    { translateX: panX },
    { translateY: panY },
    { 
      rotate: rotationValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-30deg', '0deg', '30deg']
      }) 
    }
  ];
  
  // Handle dice roll
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Reset animation values
    animationProgress.setValue(0);
    
    // Generate random dice value
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);
    
    // Shake animation to simulate dice roll
    createEnhancedShakeAnimation(panX).start(() => {
      // Show number after shake completes
      createEnhancedNumberShowAnimation(animationProgress).start(() => {
        // Optional pulse to emphasize the result
        createEnhancedPulseAnimation(rotationValue).start(() => {
          setIsRolling(false);
        });
      });
    });
  };
  
  // Set up pan responder for drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Reset animation values
        // Store current position as the offset
        panX.extractOffset();
        panY.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: panX, dy: panY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        // Clear offsets
        panX.flattenOffset();
        panY.flattenOffset();
        
        // Return to center with enhanced animation
        const returnAnimation = createEnhancedReturnAnimation(
          panX, panY, rotationValue
        );
        
        returnAnimation.start();
      }
    })
  ).current;
  
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={rollDice}>
        <Animated.View
          style={[
            styles.dice,
            { backgroundColor: colors.primary },
            { transform }
          ]}
          {...panResponder.panHandlers}
        >
          {diceValue !== null && (
            <Animated.Text 
              style={[
                styles.diceText,
                {
                  opacity: animationProgress,
                  transform: [
                    {
                      scale: animationProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              {diceValue}
            </Animated.Text>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
      
      <Text style={[styles.instructions, { color: colors.text.primary }]}>
        Tap to roll or drag and release
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  diceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  instructions: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  }
});

export default EnhancedDice; 