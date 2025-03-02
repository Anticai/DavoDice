import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Body } from './Text';
import { useTheme } from '../context/ThemeContext';

interface SimpleDiceProps {
  value: number;
  size?: number;
  highlighted?: boolean;
  rerolled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Simple dice component that displays a static value
 */
export const SimpleDice: React.FC<SimpleDiceProps> = ({
  value,
  size = 80,
  highlighted = false,
  rerolled = false,
  style,
}) => {
  const { colors } = useTheme();
  
  // Ensure value is a valid dice face (1-6)
  const diceValue = Math.max(1, Math.min(6, value));
  
  return (
    <View 
      style={[
        styles.dice,
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

const styles = StyleSheet.create({
  dice: {
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
}); 