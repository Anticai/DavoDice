import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { SimpleDice } from './SimpleDice';
import { failedRollSelectorStyles as styles } from '../styles/failedRollSelector';
import { theme } from '../styles';
import { DiceFace } from '../types';
import { 
  createZoomAnimation,
  createPulseAnimation,
  getZoomAnimationStyle,
  getZoomShadowStyle 
} from '../animations/zoomAnimations';
import { useFeedback } from '../hooks';

interface DiceRoll {
  key: string;
  value: DiceFace;
  highlighted: boolean;
  rerolled: boolean;
}

interface FailedRollSelectorProps {
  diceRolls: DiceRoll[];
  onSelectFailed: (failedDiceIndices: number[]) => void;
  onSkip: () => void;
}

/**
 * Component to select which dice in a sequence failed the roll
 */
export const FailedRollSelector: React.FC<FailedRollSelectorProps> = ({
  diceRolls,
  onSelectFailed,
  onSkip,
}) => {
  // State to track which dice are selected as failed
  const [selectedDice, setSelectedDice] = useState<number[]>([]);
  
  // Animation values for each die
  const animValues = useRef(
    diceRolls.map(() => new Animated.Value(1))
  ).current;
  
  // Hook for haptic feedback
  const { provideFeedback } = useFeedback();
  
  // Initialize animations when component mounts
  useEffect(() => {
    // Stagger the zoom animations of all dice
    const animations = animValues.map((anim, i) =>
      createZoomAnimation(anim, i * 100)
    );
    
    // Start all animations in parallel
    Animated.parallel(animations).start();
    
    return () => {
      // Clean up animations on unmount
      animations.forEach(animation => animation.stop());
    };
  }, []);
  
  // Toggle a die's selection state
  const toggleDieSelection = (index: number) => {
    setSelectedDice(prev => {
      // If already selected, remove it
      if (prev.includes(index)) {
        provideFeedback('tap', 'light');
        return prev.filter(i => i !== index);
      }
      
      // Otherwise, add it to selection
      provideFeedback('tap');
      
      // Start pulsing animation for the selected die
      const pulseAnim = createPulseAnimation(animValues[index]);
      pulseAnim.start();
      
      return [...prev, index];
    });
  };
  
  // Confirm the selection of failed dice
  const handleConfirm = () => {
    provideFeedback('success');
    onSelectFailed(selectedDice);
  };
  
  // Skip selection (no dice failed)
  const handleSkip = () => {
    provideFeedback('tap');
    onSkip();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Failed Dice</Text>
      
      <Text style={styles.description}>
        Tap any dice that failed to meet the threshold
      </Text>
      
      <View style={styles.diceRow}>
        {diceRolls.map((die, index) => (
          <Animated.View
            key={die.key}
            style={[
              styles.diceWrapper,
              selectedDice.includes(index) && styles.selectedDie,
              getZoomAnimationStyle(animValues[index]),
              getZoomShadowStyle(animValues[index]),
            ]}
          >
            <TouchableOpacity onPress={() => toggleDieSelection(index)}>
              <SimpleDice
                value={die.value}
                size={40}
                highlighted={die.highlighted || selectedDice.includes(index)}
                rerolled={die.rerolled}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.controlButton, styles.skipButton]}
          onPress={handleSkip}
        >
          <Text style={[styles.buttonText, styles.skipButtonText]}>
            None Failed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.confirmButton,
            selectedDice.length === 0 && { opacity: 0.6 },
          ]}
          onPress={handleConfirm}
          disabled={selectedDice.length === 0}
        >
          <Text style={[styles.buttonText, styles.confirmButtonText]}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 