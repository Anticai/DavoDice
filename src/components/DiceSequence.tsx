import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SimpleDice } from './SimpleDice';
import { DiceFace } from '../types';
import { useAppState } from '../hooks';
import { diceSequenceStyles } from '../styles/diceSequence';
import { Body } from './Text';
import { useTheme } from '../context/ThemeContext';

interface DiceSequenceProps {
  /**
   * Optional sequence of dice to display
   * If not provided, will use the sequence from app state
   */
  sequence?: number[];
  
  /**
   * Optional threshold for highlighting dice
   * If not provided, will use the threshold from app state
   */
  threshold?: number;
  
  /**
   * Whether to reroll ones
   * If not provided, will use the setting from app state
   */
  rerollOnes?: boolean;
  
  /**
   * Size of each die
   */
  diceSize?: number;
  
  /**
   * Whether to use the app state
   * If false, must provide sequence, threshold and rerollOnes props
   */
  useAppContext?: boolean;
  
  /**
   * Whether to show placeholder text when sequence is empty
   */
  showPlaceholder?: boolean;
  
  /**
   * Custom placeholder text (default: "Roll dice to see results")
   */
  placeholderText?: string;
  
  /**
   * Optional style override
   */
  style?: any;
}

/**
 * Component that displays a sequence of dice
 */
export const DiceSequence: React.FC<DiceSequenceProps> = ({
  sequence: propSequence,
  threshold: propThreshold,
  rerollOnes: propRerollOnes,
  diceSize = 60,
  useAppContext = true,
  showPlaceholder = false,
  placeholderText = "Roll dice to see results",
  style,
}) => {
  // Get values from app state if using app context
  const appState = useAppContext ? useAppState() : null;
  const { colors } = useTheme();
  
  // Use props or app state values
  const sequence = propSequence || (appState ? appState.rollResults : []);
  const threshold = propThreshold || (appState ? appState.threshold : 4);
  const rerollOnes = propRerollOnes !== undefined ? propRerollOnes : (appState ? appState.rerollOnes : false);
  
  // If there are no dice and we should show a placeholder
  if ((!sequence || sequence.length === 0) && showPlaceholder) {
    return (
      <View style={[diceSequenceStyles.emptyContainer, style]}>
        <Body style={[diceSequenceStyles.emptyText, { color: colors.text.secondary }]}>
          {placeholderText}
        </Body>
      </View>
    );
  }
  
  // Don't render if there are no dice and no placeholder
  if (!sequence || sequence.length === 0) {
    return null;
  }
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[diceSequenceStyles.container, style]}
      style={diceSequenceStyles.scrollView}
    >
      {sequence.map((result, index) => (
        <SimpleDice
          key={`dice-${index}`}
          value={result}
          size={diceSize}
          highlighted={result >= threshold}
          rerolled={rerollOnes && result === 1}
          style={diceSequenceStyles.dice}
        />
      ))}
    </ScrollView>
  );
};

export default DiceSequence; 