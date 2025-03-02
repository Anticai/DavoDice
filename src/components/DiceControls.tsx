import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Body } from './Text';
import { useTheme } from '../context/ThemeContext';
import { useFeedback } from '../hooks/useFeedback';

interface DiceControlsProps {
  diceCount: number;
  onDiceCountChange: (count: number) => void;
}

/**
 * Controls for adjusting the number of dice
 */
export const DiceControls: React.FC<DiceControlsProps> = ({
  diceCount,
  onDiceCountChange,
}) => {
  const { colors } = useTheme();
  const { provideFeedback } = useFeedback();

  const handleDiceCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(10, diceCount + delta));
    if (newCount !== diceCount) {
      provideFeedback('tap', 'light');
      onDiceCountChange(newCount);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.ui.border }]}
        onPress={() => handleDiceCountChange(-1)}
        disabled={diceCount <= 1}
      >
        <Body style={{ color: diceCount <= 1 ? colors.ui.disabled : colors.text.primary }}>-</Body>
      </TouchableOpacity>
      
      <View style={styles.countContainer}>
        <Body style={{ color: colors.text.primary }}>{diceCount}</Body>
      </View>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.ui.border }]}
        onPress={() => handleDiceCountChange(1)}
        disabled={diceCount >= 10}
      >
        <Body style={{ color: diceCount >= 10 ? colors.ui.disabled : colors.text.primary }}>+</Body>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 