import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  PanResponder,
  PanResponderInstance,
} from 'react-native';
import { createDiceStyles } from '../styles/dice';
import { DiceFace } from '../types';
import { AnimatedNumberSelection } from './NumberSelection';
import { useSettings, useFeedback } from '../hooks';
import { useTheme } from '../hooks/useTheme';
import { 
  createReturnAnimation, 
  createNumberShowAnimation, 
  createNumberHideAnimation,
  createPanInterpolation 
} from '../animations/diceAnimations';
import { Body } from './Text';
import {
  createEnhancedReturnAnimation,
  createEnhancedNumberShowAnimation,
  createEnhancedShakeAnimation,
  createEnhancedPulseAnimation,
  createEnhancedSelectAnimation
} from '../animations/enhancedAnimations';

// Load the dice face image
const diceFaceImage = require('../assets/images/andy_head.png');

interface DiceProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
  onSelectNumber?: (number: DiceFace) => void;
  disabled?: boolean;
}

interface StaticDiceProps {
  value: number;
  size?: number;
  highlighted?: boolean;
  rerolled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Component that displays a die face value with the appropriate color
 */
export const DiceFaceValue: React.FC<{ value: DiceFace }> = ({ value }) => {
  const { colors } = useTheme();
  
  // Get color style based on value
  const getColorStyle = () => {
    switch (value) {
      case 1: return { backgroundColor: colors.status.error };
      case 2: return { backgroundColor: colors.status.warning };
      case 3: return { backgroundColor: colors.secondary };
      case 4: return { backgroundColor: colors.secondary };
      case 5: return { backgroundColor: colors.primary };
      case 6: return { backgroundColor: colors.status.success };
      default: return { backgroundColor: colors.status.error };
    }
  };

  return (
    <View style={[styles.faceValue, getColorStyle()]}>
      <Image source={diceFaceImage} style={styles.faceImage} />
    </View>
  );
};

/**
 * Simple dice component that displays a static value
 */
export const StaticDice: React.FC<StaticDiceProps> = ({
  value,
  size = 80,
  highlighted = false,
  rerolled = false,
  style,
}) => {
  const { colors } = useTheme();
  
  // Ensure value is a valid dice face
  const diceValue = Math.max(1, Math.min(6, value)) as DiceFace;
  
  return (
    <View 
      style={[
        styles.staticDice,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 8,
          backgroundColor: highlighted 
            ? colors.status.success + '30' // Add transparency
            : rerolled 
              ? colors.status.warning + '30' // Add transparency
              : colors.background.dice
        },
        style
      ]}
    >
      <Body style={[
        styles.diceValue,
        { 
          fontSize: size * 0.5,
          color: highlighted 
            ? colors.status.success
            : rerolled 
              ? colors.status.warning
              : colors.text.primary
        }
      ]}>
        {diceValue}
      </Body>
    </View>
  );
};

/**
 * Component that displays a clickable dice with a circular number selection on long press
 */
export const Dice: React.FC<DiceProps> = ({
  style,
  onPress,
  onLongPress,
  onSelectNumber,
  disabled = false,
}) => {
  // Get user settings
  const { settings } = useSettings();
  const { provideFeedback } = useFeedback();
  const { theme } = useTheme();
  const diceStyles = createDiceStyles(theme);
  
  // Check if animations are enabled
  const animationsEnabled = settings?.animationsEnabled !== false; // Default to true if undefined
  
  // State to track if numbers are being shown
  const [isShowingNumbers, setIsShowingNumbers] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation progress for showing numbers
  const animationProgress = useRef(new Animated.Value(0)).current;
  
  // Animation values for dice position
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  // Add rotation value for animations
  const rotationValue = useRef(new Animated.Value(0)).current;
  
  // Timer for detecting long press
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Pan responder for handling drag gestures
  const panResponder = useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled && isShowingNumbers,
      
      onPanResponderGrant: () => {
        // Start handling the gesture - similar to handlePressIn but for drag
        setIsPressed(true);
        
        // Start long press timer
        if (!isShowingNumbers) {
          longPressTimer.current = setTimeout(() => {
            setIsShowingNumbers(true);
            showNumbersAnimation();
            provideFeedback('roll', 'medium');
            if (onLongPress) onLongPress();
          }, 500); // 500ms for long press
        }
      },
      
      onPanResponderMove: (_, gestureState) => {
        // Clear long press timer if user starts moving before the timeout
        if (longPressTimer.current && Math.abs(gestureState.dx) > 5) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        
        if (isShowingNumbers) {
          // Update dice position with drag
          panX.setValue(gestureState.dx);
          panY.setValue(gestureState.dy);
        }
      },
      
      onPanResponderRelease: (_, gestureState) => {
        // Handle release similar to handlePressOut
        setIsPressed(false);
        
        // Clear long press timer
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        
        // Start the return animation if dice was moved
        if (isShowingNumbers && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5)) {
          const returnAnimation = createEnhancedReturnAnimation(panX, panY, rotationValue);
          returnAnimation.start();
        }
        
        // Handle tap if not showing numbers and not moved significantly
        if (!isShowingNumbers && Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          handlePress();
        }
      },
      
      onPanResponderTerminate: () => {
        // Handle termination (e.g., another responder takes over)
        setIsPressed(false);
        
        // Clear long press timer
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        
        // Start the return animation
        const returnAnimation = createEnhancedReturnAnimation(panX, panY, rotationValue);
        returnAnimation.start();
      },
    })
  ).current;
  
  // Animation for showing numbers
  const showNumbersAnimation = () => {
    if (animationsEnabled) {
      createEnhancedNumberShowAnimation(animationProgress).start();
    } else {
      // Immediately set to final value if animations are disabled
      animationProgress.setValue(1);
    }
  };
  
  // Animation for hiding numbers
  const hideNumbersAnimation = () => {
    if (animationsEnabled) {
      createNumberHideAnimation(animationProgress).start(() => {
        setIsShowingNumbers(false);
        // Reset dice position when numbers are hidden
        const returnAnimation = createEnhancedReturnAnimation(panX, panY, rotationValue);
        returnAnimation.start();
      });
    } else {
      // Immediately hide if animations are disabled
      animationProgress.setValue(0);
      setIsShowingNumbers(false);
      panX.setValue(0);
      panY.setValue(0);
    }
  };
  
  // Handle press in
  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    provideFeedback('tap', 'light');
    
    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      setIsShowingNumbers(true);
      showNumbersAnimation();
      provideFeedback('roll', 'medium');
      if (onLongPress) onLongPress();
    }, 500); // 500ms for long press
  };
  
  // Handle press out
  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    // Hide numbers if they are being shown
    if (isShowingNumbers) {
      hideNumbersAnimation();
    }
  };
  
  // Handle press
  const handlePress = () => {
    if (disabled || isShowingNumbers) return;
    provideFeedback('tap', 'light');
    
    // Add a subtle pulse animation on tap
    if (animationsEnabled) {
      createEnhancedPulseAnimation(rotationValue, 1).start();
    }
    
    if (onPress) onPress();
  };
  
  // Handle number selection
  const handleSelectNumber = (number: DiceFace) => {
    if (disabled) return;
    
    // Hide numbers
    hideNumbersAnimation();
    
    // Add a selection animation
    if (animationsEnabled) {
      createEnhancedSelectAnimation(rotationValue).start();
    }
    
    // Provide feedback
    provideFeedback('success', 'medium');
    
    // Call onSelectNumber callback
    if (onSelectNumber) onSelectNumber(number);
  };
  
  // Add a shake animation method that can be called externally
  const shakeDice = () => {
    if (animationsEnabled) {
      createEnhancedShakeAnimation(panX).start();
    }
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);
  
  // Calculate dice scale based on animation progress
  const diceLiftAnimation = animationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });
  
  // Get pan gesture transform styles
  const panGestureStyles = createPanInterpolation(panX, panY);
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.diceWrapper,
          isShowingNumbers && animationsEnabled ? panGestureStyles : null,
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled}
        >
          <Animated.View
            style={[
              diceStyles.diceContainer,
              isPressed && diceStyles.diceContainerActive,
              animationsEnabled ? { transform: [{ scale: diceLiftAnimation }] } : null,
              isShowingNumbers && diceStyles.diceShadowLifted,
              style,
            ]}
          >
            <Image
              source={diceFaceImage}
              style={diceStyles.diceImage}
              resizeMode="contain"
              accessibilityLabel="Dice face"
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
      
      {/* Numbers selection */}
      <AnimatedNumberSelection
        visible={isShowingNumbers}
        onSelectNumber={handleSelectNumber}
        animationProgress={animationProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200, // Ensure enough space for the dice to move
  },
  diceWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  staticDice: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  diceValue: {
    fontWeight: 'bold',
  },
  faceValue: {
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
  faceImage: {
    width: 30,
    height: 30,
  },
});

export default Dice; 