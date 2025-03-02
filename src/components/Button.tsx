import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  Animated,
  Easing,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography, textTransforms } from '../styles/typography';
import { useFeedback } from '../hooks';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onPress: () => void;
  feedbackIntensity?: 'light' | 'medium' | 'heavy';
}

/**
 * Reusable button component with different variants, sizes, and animations
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  textStyle,
  style,
  icon,
  iconPosition = 'left',
  onPress,
  feedbackIntensity = 'medium',
  ...rest
}) => {
  const { provideFeedback } = useFeedback();
  const { colors, theme } = useTheme();
  const { shadows, borderRadius, animations } = theme;
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // Handle press with animation
  const handlePress = () => {
    if (!disabled && !loading) {
      // Haptic feedback
      provideFeedback('tap', feedbackIntensity);
      
      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: animations.scales.pressed,
          duration: animations.durations.short / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animations.durations.short / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
      
      // Call the actual onPress handler
      onPress();
    }
  };

  // Handle disabled state changes
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: disabled ? 0.6 : 1,
      duration: animations.durations.short,
      useNativeDriver: true,
    }).start();
  }, [disabled, animations.durations.short, opacityAnim]);

  // Dynamic styles based on variant, size, and state
  const getBackgroundColor = () => {
    if (disabled) {
      return colors.background.card;
    }
    
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outlined':
      case 'text':
        return 'transparent';
      case 'danger':
        return colors.danger;
      case 'success':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return colors.text.muted;
    }
    
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
        return colors.text.inverse;
      case 'outlined':
        return variant === 'outlined' ? colors.primary : colors.text.primary;
      case 'text':
        return colors.text.primary;
      default:
        return colors.text.inverse;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.border.light : colors.primary,
      };
    }
    return {};
  };

  const getShadowStyle = () => {
    if (disabled || variant === 'text' || variant === 'outlined') {
      return {};
    }
    return shadows.light;
  };

  const getPaddingForSize = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'medium':
        return { paddingVertical: 10, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 16 };
    }
  };

  const getFontSizeForSize = () => {
    const baseSize = 16; // Default font size if typography.button.fontSize is undefined
    switch (size) {
      case 'small':
        return (typography.button?.fontSize || baseSize) - 2;
      case 'medium':
        return typography.button?.fontSize || baseSize;
      case 'large':
        return (typography.button?.fontSize || baseSize) + 2;
      default:
        return typography.button?.fontSize || baseSize;
    }
  };

  const buttonStyle = {
    ...styles.button,
    ...getPaddingForSize(),
    backgroundColor: getBackgroundColor(),
    borderRadius: borderRadius.md,
    ...getBorderStyle(),
    ...getShadowStyle(),
  };

  const textStyleForButton = {
    ...(typography.button || {}),
    fontSize: getFontSizeForSize(),
    color: getTextColor(),
    ...textTransforms.uppercase,
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        { opacity: opacityAnim },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={disabled || loading}
        style={[buttonStyle, style]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
            <Text style={[textStyleForButton, textStyle]}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button; 