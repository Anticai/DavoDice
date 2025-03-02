import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Body, H3 } from './Text';
import { outcomeInputStyles } from '../styles/outcomeInput';
import { useTheme } from '../context/ThemeContext';
import { useAppState, useFeedback } from '../hooks';
import { RollOutcome } from '../types';

interface OutcomeInputProps {
  /**
   * Whether to show the component
   */
  visible?: boolean;
  
  /**
   * Optional callback when outcome is selected
   */
  onOutcomeSelected?: (outcome: RollOutcome) => void;
  
  /**
   * Optional style override
   */
  style?: any;
}

/**
 * Component for tracking roll outcomes with success/fail buttons
 */
export const OutcomeInput: React.FC<OutcomeInputProps> = ({
  visible = true,
  onOutcomeSelected,
  style,
}) => {
  const { colors } = useTheme();
  const { provideFeedback } = useFeedback();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  // Get app state
  const {
    rollResults,
    recordOutcome,
    lastRollSuccess,
    diceCount,
    threshold,
    successProbability
  } = useAppState();
  
  // Don't show if there are no results to evaluate
  if (!visible || rollResults.length === 0) {
    return null;
  }
  
  // If the outcome has already been recorded
  if (lastRollSuccess !== null) {
    return (
      <View style={[
        outcomeInputStyles.container,
        { backgroundColor: colors.background.card },
        style
      ]}>
        <Body style={outcomeInputStyles.feedbackText}>
          This roll was marked as {lastRollSuccess ? 'successful' : 'unsuccessful'}.
        </Body>
      </View>
    );
  }
  
  // Calculate success count based on threshold
  const successCount = rollResults.filter(roll => roll >= threshold).length;
  
  // Handle selecting the outcome
  const handleOutcomeSelected = async (outcome: RollOutcome) => {
    try {
      // Provide appropriate feedback
      provideFeedback(outcome === 'success' ? 'success' : 'error', 'medium');
      
      // Record the outcome in app state
      await recordOutcome(outcome);
      
      // Call the callback if provided
      if (onOutcomeSelected) {
        onOutcomeSelected(outcome);
      }
      
      // Show feedback message
      setFeedbackMessage(
        outcome === 'success'
          ? 'Success recorded! Keep rolling!'
          : 'Failure recorded. Better luck next time!'
      );
      
      // Clear feedback message after 3 seconds
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error recording outcome:', error);
      Alert.alert('Error', 'Could not record outcome. Please try again.');
    }
  };
  
  return (
    <View style={[
      outcomeInputStyles.container,
      { backgroundColor: colors.background.card },
      style
    ]}>
      <View style={outcomeInputStyles.header}>
        <H3 style={[
          outcomeInputStyles.prompt,
          { color: colors.text.primary }
        ]}>
          Was your roll successful?
        </H3>
      </View>
      
      <View style={outcomeInputStyles.buttonsContainer}>
        <TouchableOpacity
          style={[
            outcomeInputStyles.button,
            outcomeInputStyles.successButton
          ]}
          onPress={() => handleOutcomeSelected('success')}
        >
          <Body style={outcomeInputStyles.buttonText}>Success</Body>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            outcomeInputStyles.button,
            outcomeInputStyles.failureButton
          ]}
          onPress={() => handleOutcomeSelected('failure')}
        >
          <Body style={outcomeInputStyles.buttonText}>Failure</Body>
        </TouchableOpacity>
      </View>
      
      {feedbackMessage && (
        <Body style={outcomeInputStyles.feedbackText}>
          {feedbackMessage}
        </Body>
      )}
      
      <View style={outcomeInputStyles.statsContainer}>
        <View style={outcomeInputStyles.statItem}>
          <Body style={outcomeInputStyles.statValue}>{successCount}</Body>
          <Body style={outcomeInputStyles.statLabel}>Successes</Body>
        </View>
        
        <View style={outcomeInputStyles.statItem}>
          <Body style={outcomeInputStyles.statValue}>{rollResults.length - successCount}</Body>
          <Body style={outcomeInputStyles.statLabel}>Failures</Body>
        </View>
        
        <View style={outcomeInputStyles.statItem}>
          <Body style={outcomeInputStyles.statValue}>
            {successProbability !== null ? 
              `${(successProbability * 100).toFixed(0)}%` : 'N/A'}
          </Body>
          <Body style={outcomeInputStyles.statLabel}>Probability</Body>
        </View>
      </View>
    </View>
  );
};

export default OutcomeInput; 