import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text as RNText,
  LayoutChangeEvent,
} from 'react-native';
import { Dice, DiceFaceValue } from './Dice';
import { diceRollService, DiceRollResult } from '../services/diceRollService';
import { DiceFace } from '../types';
import { Text, H3, Body } from './Text';
import { DEFAULT_THRESHOLD } from '../constants';
import { useSettings, useFeedback, useAppState } from '../hooks';
import { useTheme } from '../hooks/useTheme';
import { StaticDice } from './Dice';
import { 
  createEnhancedZoomSequence,
  createStaggeredDiceRollAnimation,
  createStaggeredSuccessAnimation
} from '../animations/enhancedAnimations';
import ParticleSystem from './ParticleSystem';

interface DiceRollProps {
  numDice?: number;
  threshold?: DiceFace;
  rerollOnes?: boolean;
  onRollComplete?: (result: DiceRollResult) => void;
  useAppContext?: boolean; // Optional flag to use app context for rolling
  diceValues: DiceFace[];
  onSelectFailed?: (index: number) => void;
  failedIndex?: number;
  highlightedIndices?: number[];
  animated?: boolean;
}

/**
 * Component for displaying and rolling multiple dice
 */
export const DiceRoll: React.FC<DiceRollProps> = ({
  numDice = 3,
  threshold = DEFAULT_THRESHOLD,
  rerollOnes = false,
  onRollComplete,
  useAppContext = false,
  diceValues,
  onSelectFailed,
  failedIndex,
  highlightedIndices = [],
  animated = true,
}) => {
  // Get user settings
  const { settings } = useSettings();
  const { provideFeedback } = useFeedback();
  
  // Get app state if using app context
  const appState = useAppContext ? useAppState() : null;
  
  // State for tracking roll results
  const [rollResult, setRollResult] = useState<DiceRollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  // Animation values
  const rollAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const { colors } = useTheme();
  const scaleValues = useRef(diceValues.map(() => new Animated.Value(1))).current;
  
  // Add rotation values for each dice
  const rotationValues = useRef(diceValues.map(() => new Animated.Value(0))).current;
  
  // Add highlight opacity values for each dice
  const highlightOpacities = useRef(diceValues.map(() => new Animated.Value(0))).current;

  // Check if animations are enabled
  const animationsEnabled = settings?.animationsEnabled !== false; // Default to true if undefined
  
  // Track dice positions for particle effects
  const [dicePositions, setDicePositions] = useState<Array<{x: number, y: number}>>([]);
  const [showConfetti, setShowConfetti] = useState<Array<boolean>>([]);
  const [showExplosion, setShowExplosion] = useState<Array<boolean>>([]);
  
  // Roll the dice with animation
  const handleRoll = () => {
    if (isRolling) return;
    
    // Reset particle effects
    setShowConfetti(new Array(numDice).fill(false));
    setShowExplosion(new Array(numDice).fill(false));
    
    if (useAppContext && appState) {
      // Use the app context for rolling
      appState.rollDice();
      return;
    }
    
    setIsRolling(true);
    provideFeedback('roll', 'medium');
    
    if (animationsEnabled) {
      // With animations
      // Fade out existing dice
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Reset animation values
        rotationValues.forEach(rotation => rotation.setValue(0));
        scaleValues.forEach(scale => scale.setValue(1));
        
        // Roll the dice
        const result = diceRollService.rollDice({
          numDice,
          threshold,
          rerollOnes,
        });
        
        // Update state
        setRollResult(result);
        
        // Fade in new dice
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Start staggered roll animation
          createStaggeredDiceRollAnimation(rotationValues, scaleValues).start(() => {
            setIsRolling(false);
            
            // After roll animation completes, highlight successes with staggered animation
            if (result.successes > 0) {
              // Get indices of successful dice
              const successIndices = result.values
                .map((value, index) => ({ value, index }))
                .filter(item => item.value >= threshold)
                .map(item => item.index);
              
              // Create arrays of animation values for just the successful dice
              const successScaleValues = successIndices.map(index => scaleValues[index]);
              const successOpacityValues = successIndices.map(index => highlightOpacities[index]);
              
              // Run the staggered success animation
              createStaggeredSuccessAnimation(
                successScaleValues,
                successOpacityValues
              ).start();
            }
            
            // Show particle effects for critical successes and failures
            const newConfettiArray = new Array(numDice).fill(false);
            const newExplosionArray = new Array(numDice).fill(false);
            
            // Check each dice for critical success (6) or failure (1)
            result.values.forEach((value, index) => {
              if (value === 6) {
                // Critical success - show confetti with a slight delay for each dice
                setTimeout(() => {
                  const newArray = [...newConfettiArray];
                  newArray[index] = true;
                  setShowConfetti(newArray);
                  
                  // Reset after animation
                  setTimeout(() => {
                    const resetArray = [...newConfettiArray];
                    resetArray[index] = false;
                    setShowConfetti(resetArray);
                  }, 2000);
                }, index * 200);
              } else if (value === 1) {
                // Critical failure - show explosion with a slight delay for each dice
                setTimeout(() => {
                  const newArray = [...newExplosionArray];
                  newArray[index] = true;
                  setShowExplosion(newArray);
                  
                  // Reset after animation
                  setTimeout(() => {
                    const resetArray = [...newExplosionArray];
                    resetArray[index] = false;
                    setShowExplosion(resetArray);
                  }, 1500);
                }, index * 200);
              }
            });
            
            // Call onRollComplete callback
            if (onRollComplete) {
              onRollComplete(result);
            }
          });
        });
      });
    } else {
      // Without animations - just roll and update immediately
      const result = diceRollService.rollDice({
        numDice,
        threshold,
        rerollOnes,
      });
      
      // Update state
      setRollResult(result);
      setIsRolling(false);
      
      // Call onRollComplete callback
      if (onRollComplete) {
        onRollComplete(result);
      }
    }
  };
  
  // Roll dice on initial render if not using app context
  useEffect(() => {
    if (!useAppContext) {
      handleRoll();
    }
  }, []);
  
  // Use app state results if available
  useEffect(() => {
    if (useAppContext && appState && appState.rollResults.length > 0) {
      const values = appState.rollResults.map(r => r as DiceFace);
      const successCount = values.filter(v => v >= threshold).length;
      
      setRollResult({
        values,
        successes: successCount,
        failures: values.length - successCount,
        threshold,
        timestamp: Date.now()
      });
    }
  }, [useAppContext, appState?.rollResults]);
  
  // Dice layout based on number of dice
  const getDiceLayout = () => {
    if (numDice <= 3) {
      return styles.diceRowLayout;
    } else if (numDice <= 6) {
      return styles.diceGridLayout;
    } else {
      return styles.diceWrapLayout;
    }
  };
  
  // Use app state if specified
  const effectiveIsRolling = useAppContext && appState ? appState.isRolling : isRolling;
  
  const handleSelectDice = (index: number) => {
    if (!onSelectFailed) return;

    // Animate the selected dice
    if (animated) {
      createEnhancedZoomSequence(scaleValues[index]).start();
    }

    onSelectFailed(index);
  };

  // Handle layout change to capture dice positions
  const handleDiceLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    const newPositions = [...dicePositions];
    newPositions[index] = { x: centerX, y: centerY };
    setDicePositions(newPositions);
  };
  
  // Handle particle effect completion
  const handleParticleComplete = (index: number, type: 'confetti' | 'explosion') => {
    if (type === 'confetti') {
      const newArray = [...showConfetti];
      newArray[index] = false;
      setShowConfetti(newArray);
    } else {
      const newArray = [...showExplosion];
      newArray[index] = false;
      setShowExplosion(newArray);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.diceContainer, getDiceLayout()]}>
        {rollResult && rollResult.values.map((value, index) => (
          <View key={`dice-wrapper-${index}`}>
            <Animated.View
              key={`dice-${index}`}
              style={[
                styles.diceWrapper,
                animationsEnabled ? {
                  transform: [
                    { 
                      rotate: rotationValues[index].interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: ['0deg', '360deg', '720deg'],
                      }) 
                    },
                    { scale: scaleValues[index] }
                  ],
                  opacity: fadeAnimation,
                } : null,
              ]}
              onLayout={(event) => handleDiceLayout(index, event)}
            >
              <TouchableOpacity
                onPress={() => handleSelectDice(index)}
                disabled={!onSelectFailed}
                activeOpacity={0.8}
              >
                <View style={styles.diceAndHighlightContainer}>
                  <StaticDice
                    value={value}
                    highlighted={highlightedIndices.includes(index)}
                    rerolled={failedIndex === index}
                    size={50}
                  />
                  
                  {/* Success highlight overlay */}
                  <Animated.View 
                    style={[
                      styles.successHighlight,
                      { 
                        opacity: highlightOpacities[index],
                        backgroundColor: value >= threshold ? 
                          colors.status.success + 'A0' : // Success with alpha
                          colors.status.error + 'A0'     // Failure with alpha
                      }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
            
            {/* Particle effects */}
            {dicePositions[index] && showConfetti[index] && (
              <ParticleSystem
                x={dicePositions[index].x}
                y={dicePositions[index].y}
                type="confetti"
                count={30}
                duration={1500}
                trigger={showConfetti[index]}
                onComplete={() => handleParticleComplete(index, 'confetti')}
              />
            )}
            
            {dicePositions[index] && showExplosion[index] && (
              <ParticleSystem
                x={dicePositions[index].x}
                y={dicePositions[index].y}
                type="explosion"
                count={25}
                duration={1000}
                trigger={showExplosion[index]}
                onComplete={() => handleParticleComplete(index, 'explosion')}
              />
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.resultContainer}>
        {rollResult && (
          <>
            <H3 style={styles.resultText}>
              {rollResult.successes} Successes
            </H3>
            <Body>
              Threshold: {threshold}+
            </Body>
          </>
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.rollButton, effectiveIsRolling && styles.rollButtonDisabled]}
        onPress={handleRoll}
        disabled={effectiveIsRolling}
      >
        <Text variant="button" color="#FFFFFF">
          Roll Again
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  diceContainer: {
    marginVertical: 16,
    width: '100%',
  },
  diceRowLayout: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceGridLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceWrapLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceWrapper: {
    margin: 8,
    position: 'relative',
  },
  resultIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  successIndicator: {
    backgroundColor: '#38B000',
  },
  failureIndicator: {
    backgroundColor: '#E5383B',
  },
  resultContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  resultText: {
    textAlign: 'center',
  },
  rollButton: {
    marginTop: 24,
    backgroundColor: '#7B2CBF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  rollButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  diceAndHighlightContainer: {
    position: 'relative',
  },
  successHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
}); 