import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Body } from './Text';
import { useTheme } from '../context/ThemeContext';
import { useFeedback } from '../hooks/useFeedback';

interface CalculatorProps {
  diceCount: number;
  threshold: number;
  rerollOnes: boolean;
  onDiceCountChange: (count: number) => void;
  onThresholdChange: (threshold: number) => void;
  onRerollOnesChange: (reroll: boolean) => void;
}

/**
 * Calculator component for configuring dice roll parameters
 */
export const Calculator: React.FC<CalculatorProps> = ({
  diceCount,
  threshold,
  rerollOnes,
  onDiceCountChange,
  onThresholdChange,
  onRerollOnesChange,
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

  const handleThresholdChange = (value: number) => {
    if (value !== threshold && value >= 2 && value <= 6) {
      provideFeedback('tap', 'light');
      onThresholdChange(value);
    }
  };

  const toggleRerollOnes = () => {
    provideFeedback('tap', 'light');
    onRerollOnesChange(!rerollOnes);
  };

  return (
    <View style={styles.container}>
      {/* Dice Count */}
      <View style={styles.row}>
        <Body style={{ color: colors.text.primary }}>Number of Dice:</Body>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: colors.ui.border }]}
            onPress={() => handleDiceCountChange(-1)}
            disabled={diceCount <= 1}
          >
            <Body style={{ color: diceCount <= 1 ? colors.ui.disabled : colors.text.primary }}>-</Body>
          </TouchableOpacity>
          <View style={styles.counterValue}>
            <Body style={{ color: colors.text.primary }}>{diceCount}</Body>
          </View>
          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: colors.ui.border }]}
            onPress={() => handleDiceCountChange(1)}
            disabled={diceCount >= 10}
          >
            <Body style={{ color: diceCount >= 10 ? colors.ui.disabled : colors.text.primary }}>+</Body>
          </TouchableOpacity>
        </View>
      </View>

      {/* Threshold */}
      <View style={styles.row}>
        <Body style={{ color: colors.text.primary }}>Success Threshold:</Body>
        <View style={styles.thresholdContainer}>
          {[2, 3, 4, 5, 6].map((value) => (
            <TouchableOpacity
              key={`threshold-${value}`}
              style={[
                styles.thresholdButton,
                { backgroundColor: threshold === value ? colors.primary : colors.ui.border }
              ]}
              onPress={() => handleThresholdChange(value)}
            >
              <Body style={{ 
                color: threshold === value ? colors.text.light : colors.text.primary 
              }}>
                {value}+
              </Body>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reroll Ones */}
      <View style={styles.row}>
        <Body style={{ color: colors.text.primary }}>Reroll Ones:</Body>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: rerollOnes ? colors.primary : colors.ui.border }
          ]}
          onPress={toggleRerollOnes}
        >
          <Body style={{ 
            color: rerollOnes ? colors.text.light : colors.text.primary 
          }}>
            {rerollOnes ? 'ON' : 'OFF'}
          </Body>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  counterValue: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thresholdContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  thresholdButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
}); 