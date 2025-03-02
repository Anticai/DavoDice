import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useAnimation } from '../hooks';
import { numberAnimations } from '../animations';
import { useTheme } from '../hooks/useTheme';

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  animate?: boolean;
  animationType?: 'count' | 'bounce' | 'flash';
}

/**
 * A component that displays a number with animation effects
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  style,
  containerStyle,
  animate = true,
  animationType = 'bounce',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const { animatedValue, runAnimation } = useAnimation({ initialValue: 1 });
  const { colors, theme } = useTheme();
  
  // Update the display value when the actual value changes
  useEffect(() => {
    setDisplayValue(value);
    
    if (animate) {
      switch (animationType) {
        case 'count':
          runAnimation((val) => numberAnimations.createCountAnimation(val, value));
          break;
        case 'bounce':
          runAnimation((val) => numberAnimations.createBounceAnimation(val));
          break;
        case 'flash':
          runAnimation((val) => numberAnimations.createFlashAnimation(val));
          break;
      }
    }
  }, [value, animate, animationType, runAnimation]);
  
  // Create animated styles based on animation type
  const animatedStyle = (() => {
    switch (animationType) {
      case 'count':
        return { opacity: 1 };
      case 'bounce':
        return {
          transform: [{ scale: animatedValue }],
        };
      case 'flash':
        return {
          backgroundColor: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.background.main, colors.primary],
          }),
        };
      default:
        return {};
    }
  })();
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.text, style, animatedStyle]}>
        {displayValue}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 