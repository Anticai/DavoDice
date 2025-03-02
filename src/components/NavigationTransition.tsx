import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp, Easing } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Types of navigation transitions
 */
export type TransitionType = 'fade' | 'slide' | 'modal' | 'none';

/**
 * Props for the NavigationTransition component
 */
interface NavigationTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  inView?: boolean;
}

/**
 * A wrapper component that applies animated transitions to screen components
 * for use with React Navigation.
 * 
 * Example usage:
 * ```
 * const HomeScreen = () => (
 *   <NavigationTransition type="fade">
 *     <View>
 *       <Text>Home Screen Content</Text>
 *     </View>
 *   </NavigationTransition>
 * );
 * ```
 */
export const NavigationTransition: React.FC<NavigationTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  style,
  inView = true,
}) => {
  const { colors } = useTheme();
  
  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const translateX = useRef(new Animated.Value(50)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  
  // Run entry animation when component mounts or inView changes
  useEffect(() => {
    if (inView) {
      // Run entry animation
      let animation;
      
      switch (type) {
        case 'fade':
          animation = Animated.timing(opacity, {
            toValue: 1,
            duration,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          });
          break;
          
        case 'slide':
          animation = Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic),
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
          ]);
          break;
          
        case 'modal':
          animation = Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic),
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
          ]);
          break;
          
        case 'none':
          opacity.setValue(1);
          translateY.setValue(0);
          translateX.setValue(0);
          scale.setValue(1);
          return;
      }
      
      animation.start();
    } else {
      // Run exit animation if not in view
      let animation;
      
      switch (type) {
        case 'fade':
          animation = Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.75,
            useNativeDriver: true,
            easing: Easing.in(Easing.cubic),
          });
          break;
          
        case 'slide':
          animation = Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.75,
              useNativeDriver: true,
              easing: Easing.in(Easing.cubic),
            }),
            Animated.timing(translateX, {
              toValue: -50,
              duration: duration * 0.75,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
          ]);
          break;
          
        case 'modal':
          animation = Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.75,
              useNativeDriver: true,
              easing: Easing.in(Easing.cubic),
            }),
            Animated.timing(translateY, {
              toValue: 50,
              duration: duration * 0.75,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.timing(scale, {
              toValue: 0.95,
              duration: duration * 0.75,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
          ]);
          break;
          
        case 'none':
          opacity.setValue(0);
          translateY.setValue(50);
          translateX.setValue(50);
          scale.setValue(0.95);
          return;
      }
      
      animation.start();
    }
  }, [inView, type, duration]);

  // Set initial values
  useEffect(() => {
    if (!inView) {
      opacity.setValue(0);
      
      if (type === 'slide') {
        translateX.setValue(50);
        translateY.setValue(0);
        scale.setValue(1);
      } else if (type === 'modal') {
        translateY.setValue(50);
        translateX.setValue(0);
        scale.setValue(0.95);
      } else {
        translateY.setValue(0);
        translateX.setValue(0);
        scale.setValue(1);
      }
    }
  }, []);
  
  // Determine animation style based on type
  const getAnimatedStyle = () => {
    switch (type) {
      case 'fade':
        return {
          opacity,
        };
      case 'slide':
        return {
          opacity,
          transform: [
            { translateX },
          ],
        };
      case 'modal':
        return {
          opacity,
          transform: [
            { translateY },
            { scale },
          ],
        };
      default:
        return {};
    }
  };
  
  return (
    <Animated.View style={[{ flex: 1 }, getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  );
};

export default NavigationTransition; 