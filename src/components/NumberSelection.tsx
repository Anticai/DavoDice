import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import { diceStyles } from '../styles/dice';
import { createNumberSelectionStyles } from '../styles/numberSelection';
import { DiceFace } from '../types';
import { DEFAULT_THRESHOLD } from '../constants';
import { useSettings, useFeedback } from '../hooks';
import { useTheme } from '../hooks/useTheme';
import { 
  createSoundTriggerAnimation,
  getEatingAnimationStyle,
} from '../animations/numberAnimations';
import { createEnhancedEatingAnimation } from '../animations/enhancedAnimations';

// Circle NumberSelection Props (used for the dice hover selection)
interface CircleNumberSelectionProps {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  onSelectNumber: (number: DiceFace) => void;
}

/**
 * Component that displays numbers 1-6 around the dice when held (circular layout)
 */
export const CircleNumberSelection: React.FC<CircleNumberSelectionProps> = ({
  visible,
  style,
  onSelectNumber,
}) => {
  const { provideFeedback } = useFeedback();
  const { theme } = useTheme();
  const numberSelectionStyles = createNumberSelectionStyles(theme);
  
  // Array of numbers 1-6 to render
  const numbers: DiceFace[] = [1, 2, 3, 4, 5, 6];
  
  // If not visible, return null
  if (!visible) {
    return null;
  }
  
  // Helper function to get position style by number
  const getPositionStyle = (number: DiceFace): ViewStyle => {
    switch (number) {
      case 1: return diceStyles.numberPosition1;
      case 2: return diceStyles.numberPosition2;
      case 3: return diceStyles.numberPosition3;
      case 4: return diceStyles.numberPosition4;
      case 5: return diceStyles.numberPosition5;
      case 6: return diceStyles.numberPosition6;
    }
  };
  
  // Helper function to get color style by number
  const getColorStyle = (number: DiceFace): TextStyle => {
    switch (number) {
      case 1: return diceStyles.numberColor1;
      case 2: return diceStyles.numberColor2;
      case 3: return diceStyles.numberColor3;
      case 4: return diceStyles.numberColor4;
      case 5: return diceStyles.numberColor5;
      case 6: return diceStyles.numberColor6;
    }
  };
  
  // Handle number selection with feedback
  const handleSelectNumber = (number: DiceFace) => {
    provideFeedback('tap', 'light');
    onSelectNumber(number);
  };
  
  return (
    <View style={[diceStyles.numbersContainer, style]}>
      {numbers.map((number) => (
        <TouchableOpacity
          key={number}
          style={[
            diceStyles.numberCircle,
            getPositionStyle(number),
          ]}
          onPress={() => handleSelectNumber(number)}
        >
          <Text style={[diceStyles.numberText, getColorStyle(number)]}>
            {number}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * Component that displays numbers 1-6 around the dice when held, with animations
 */
export const AnimatedNumberSelection: React.FC<CircleNumberSelectionProps & {
  animationProgress: Animated.Value;
}> = ({
  visible,
  style,
  onSelectNumber,
  animationProgress,
}) => {
  const { settings } = useSettings();
  const { provideFeedback } = useFeedback();
  const { theme } = useTheme();
  const numberSelectionStyles = createNumberSelectionStyles(theme);
  
  // Check if animations are enabled
  const animationsEnabled = settings?.animationsEnabled !== false; // Default to true if undefined
  
  // Array of numbers 1-6 to render
  const numbers: DiceFace[] = [1, 2, 3, 4, 5, 6];
  
  // State to track which number is being eaten
  const [eatingNumber, setEatingNumber] = useState<DiceFace | null>(null);
  const eatingAnimValue = useRef(new Animated.Value(0)).current;
  
  // Reset eating animation when visibility changes
  useEffect(() => {
    if (!visible) {
      setEatingNumber(null);
      eatingAnimValue.setValue(0);
    }
  }, [visible]);
  
  // If not visible, return null
  if (!visible) {
    return null;
  }
  
  // Helper function to get position style by number
  const getPositionStyle = (number: DiceFace): ViewStyle => {
    switch (number) {
      case 1: return diceStyles.numberPosition1;
      case 2: return diceStyles.numberPosition2;
      case 3: return diceStyles.numberPosition3;
      case 4: return diceStyles.numberPosition4;
      case 5: return diceStyles.numberPosition5;
      case 6: return diceStyles.numberPosition6;
    }
  };
  
  // Helper function to get color style by number
  const getColorStyle = (number: DiceFace): TextStyle => {
    switch (number) {
      case 1: return diceStyles.numberColor1;
      case 2: return diceStyles.numberColor2;
      case 3: return diceStyles.numberColor3;
      case 4: return diceStyles.numberColor4;
      case 5: return diceStyles.numberColor5;
      case 6: return diceStyles.numberColor6;
    }
  };
  
  // Handle number selection with eating animation and sound
  const handleSelectNumber = (number: DiceFace) => {
    if (eatingNumber !== null) return; // Prevent multiple selections during animation
    
    setEatingNumber(number);
    
    if (animationsEnabled) {
      // Play the swallowing sound at the right moment during the animation
      const soundTrigger = createSoundTriggerAnimation(eatingAnimValue, () => {
        provideFeedback('swallow');
      });
      
      // Start the eating animation
      const eatingAnim = createEnhancedEatingAnimation(eatingAnimValue, new Animated.Value(1));
      
      // Run both animations together
      Animated.parallel([eatingAnim, soundTrigger]).start(() => {
        // When animation completes, reset and call the callback
        eatingAnimValue.setValue(0);
        onSelectNumber(number);
      });
    } else {
      // Without animations, just provide feedback and call the callback
      provideFeedback('swallow');
      onSelectNumber(number);
    }
  };
  
  // Calculate animation values for showing the number selection
  const scale = animationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  
  const opacity = animationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  // Determine which animation styles to use for showing the selection
  const getShowAnimationStyle = () => {
    if (!animationsEnabled) {
      // Without animations, just use a static style
      return { opacity: 1, transform: [{ scale: 1 }] };
    }
    
    // With animations, use the animated values
    return {
      opacity,
      transform: [{ scale }],
    };
  };
  
  // Get the "eating" animation style for a selected number
  const getEatingStyle = (number: DiceFace) => {
    if (!animationsEnabled || eatingNumber !== number) {
      return {};
    }
    
    return getEatingAnimationStyle(eatingAnimValue, number);
  };

  return (
    <View style={[diceStyles.numbersContainer, style]}>
      {numbers.map((number) => (
        <Animated.View
          key={number}
          style={[
            diceStyles.numberCircle,
            getPositionStyle(number),
            getShowAnimationStyle(),
            getEatingStyle(number),
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => handleSelectNumber(number)}
            disabled={eatingNumber !== null}
          >
            <Text style={[diceStyles.numberText, getColorStyle(number)]}>
              {number}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

// Grid NumberSelection Props (used for standalone threshold selection)
interface GridNumberSelectionProps {
  selectedNumber?: DiceFace;
  onSelectNumber: (number: DiceFace) => void;
  threshold?: DiceFace;
  onThresholdChange?: (threshold: DiceFace) => void;
  disabledNumbers?: DiceFace[];
  style?: StyleProp<ViewStyle>;
  showThreshold?: boolean;
  showInstructions?: boolean;
}

/**
 * Grid-based number selection component with threshold selection
 */
export const GridNumberSelection: React.FC<GridNumberSelectionProps> = ({
  selectedNumber,
  onSelectNumber,
  threshold = DEFAULT_THRESHOLD,
  onThresholdChange,
  disabledNumbers = [],
  style,
  showThreshold = true,
  showInstructions = true,
}) => {
  const { settings } = useSettings();
  const { provideFeedback } = useFeedback();
  const { theme } = useTheme();
  const numberSelectionStyles = createNumberSelectionStyles(theme);
  
  // First row: 1-3, Second row: 4-6
  const rows: DiceFace[][] = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  
  // Helper function to get color style by number
  const getColorStyle = (number: DiceFace): TextStyle => {
    if (selectedNumber === number) {
      return numberSelectionStyles.selectedNumberText;
    }
    
    if (disabledNumbers.includes(number)) {
      return numberSelectionStyles.disabledNumberText;
    }
    
    switch (number) {
      case 1: return numberSelectionStyles.numberColor1;
      case 2: return numberSelectionStyles.numberColor2;
      case 3: return numberSelectionStyles.numberColor3;
      case 4: return numberSelectionStyles.numberColor4;
      case 5: return numberSelectionStyles.numberColor5;
      case 6: return numberSelectionStyles.numberColor6;
    }
  };
  
  // Handle selecting a number
  const handleSelectNumber = (number: DiceFace) => {
    if (!disabledNumbers.includes(number)) {
      provideFeedback('tap');
      onSelectNumber(number);
    }
  };
  
  // Handle threshold change
  const handleThresholdChange = (newThreshold: DiceFace) => {
    if (onThresholdChange) {
      provideFeedback('tap', 'light');
      onThresholdChange(newThreshold);
    }
  };
  
  return (
    <View style={[numberSelectionStyles.container, style]}>
      {/* Render rows of numbers */}
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={numberSelectionStyles.row}>
          {row.map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                numberSelectionStyles.numberItem,
                selectedNumber === number && numberSelectionStyles.selectedNumberItem,
                disabledNumbers.includes(number) && numberSelectionStyles.disabledNumberItem,
              ]}
              onPress={() => handleSelectNumber(number)}
              disabled={disabledNumbers.includes(number)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  numberSelectionStyles.numberText,
                  getColorStyle(number),
                ]}
              >
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      
      {/* Threshold selection */}
      {showThreshold && onThresholdChange && (
        <View style={numberSelectionStyles.thresholdContainer}>
          <Text style={numberSelectionStyles.thresholdText}>
            Threshold:
          </Text>
          
          <TouchableOpacity
            onPress={() => handleThresholdChange(Math.max(1, threshold - 1) as DiceFace)}
            disabled={threshold <= 1}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>−</Text>
          </TouchableOpacity>
          
          <View style={[numberSelectionStyles.numberItem, { width: 60 }]}>
            <Text style={numberSelectionStyles.numberText}>
              {threshold}+
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => handleThresholdChange(Math.min(6, threshold + 1) as DiceFace)}
            disabled={threshold >= 6}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Instructions */}
      {showInstructions && (
        <Text style={numberSelectionStyles.instructionText}>
          Select numbers that roll over {threshold}+
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  numberTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    fontWeight: '700',
  },
}); 