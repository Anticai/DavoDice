import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Body, H2 } from './Text';
import { useAppState } from '../hooks';
import { probabilityDisplayStyles } from '../styles/probabilityDisplay';
import { useTheme } from '../context/ThemeContext';

interface ProbabilityDisplayProps {
  /**
   * Optional probability value (0-1)
   * If not provided, will use the value from app state
   */
  probability?: number;
  
  /**
   * Whether to use the app state
   * If false, must provide probability prop
   */
  useAppContext?: boolean;
  
  /**
   * Whether to show the explanation text
   */
  showExplanation?: boolean;
  
  /**
   * Optional title for the component
   */
  title?: string;
  
  /**
   * Optional style override
   */
  style?: any;
}

/**
 * Component that displays probability as percentage or fraction
 */
export const ProbabilityDisplay: React.FC<ProbabilityDisplayProps> = ({
  probability: propProbability,
  useAppContext = true,
  showExplanation = true,
  title = 'Success Probability',
  style,
}) => {
  // Get values from app state if using app context
  const appState = useAppContext ? useAppState() : null;
  const { colors } = useTheme();
  
  // State for display format
  const [displayAsFraction, setDisplayAsFraction] = useState(false);
  
  // Use prop or app state value
  const probability = propProbability !== undefined ? propProbability : 
    (appState ? appState.successProbability : null);
  
  // Return null if no probability is available
  if (probability === null || probability === undefined) {
    return null;
  }
  
  // Find the simplest fraction representation
  const getFractionRepresentation = (value: number): { numerator: number; denominator: number } => {
    if (value === 0) return { numerator: 0, denominator: 1 };
    if (value === 1) return { numerator: 1, denominator: 1 };
    
    // Start with a precision of 100 (2 decimal places)
    let precision = 100;
    let numerator = Math.round(value * precision);
    let denominator = precision;
    
    // Find the greatest common divisor
    const gcd = (a: number, b: number): number => {
      if (b === 0) return a;
      return gcd(b, a % b);
    };
    
    // Simplify the fraction
    const divisor = gcd(numerator, denominator);
    numerator = numerator / divisor;
    denominator = denominator / divisor;
    
    return { numerator, denominator };
  };
  
  // Get the fraction representation
  const { numerator, denominator } = getFractionRepresentation(probability);
  
  // Toggle display format
  const toggleFormat = () => {
    setDisplayAsFraction(!displayAsFraction);
  };
  
  // Explanation text for the probability
  const getExplanationText = () => {
    if (appState && appState.diceCount > 0) {
      return `Based on ${appState.diceCount} dice with a threshold of ${appState.threshold}+${appState.rerollOnes ? ' and rerolling ones' : ''}.`;
    }
    return 'Probability of a successful roll.';
  };
  
  return (
    <View style={[
      probabilityDisplayStyles.container, 
      { backgroundColor: colors.background.card },
      style
    ]}>
      <View style={probabilityDisplayStyles.header}>
        <Body style={{ color: colors.text.secondary }}>{title}</Body>
        <TouchableOpacity 
          onPress={toggleFormat}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Body style={{ color: colors.primary }}>
            {displayAsFraction ? 'Show %' : 'Show Fraction'}
          </Body>
        </TouchableOpacity>
      </View>
      
      <View style={probabilityDisplayStyles.displayContainer}>
        {displayAsFraction ? (
          <View style={probabilityDisplayStyles.fraction}>
            <H2 style={[
              probabilityDisplayStyles.probability,
              { color: colors.primary }
            ]}>
              {numerator}
            </H2>
            <View style={[
              probabilityDisplayStyles.fractionDivider,
              { backgroundColor: colors.primary }
            ]} />
            <H2 style={[
              probabilityDisplayStyles.probability,
              { color: colors.primary }
            ]}>
              {denominator}
            </H2>
          </View>
        ) : (
          <H2 style={[
            probabilityDisplayStyles.probability,
            { color: colors.primary }
          ]}>
            {(probability * 100).toFixed(1)}%
          </H2>
        )}
      </View>
      
      {showExplanation && (
        <Body style={[
          probabilityDisplayStyles.explanation,
          { color: colors.text.secondary }
        ]}>
          {getExplanationText()}
        </Body>
      )}
    </View>
  );
};

export default ProbabilityDisplay; 