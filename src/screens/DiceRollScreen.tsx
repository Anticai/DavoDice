import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../components/Container';
import { DiceRoll } from '../components/DiceRoll';
import { GridNumberSelection } from '../components/NumberSelection';
import { DiceFace } from '../types';
import { DEFAULT_THRESHOLD } from '../constants';
import { H1, H2, Body } from '../components/Text';
import { ProbabilityDisplay } from '../components/ProbabilityDisplay';
import { OutcomeInput } from '../components/OutcomeInput';
import { DiceRollResult } from '../services/diceRollService';
import { useSettings, useFeedback, useAppState } from '../hooks';
import { DiceSequence } from '../components/DiceSequence';

/**
 * Screen for demonstrating dice roll mechanics
 */
const DiceRollScreen: React.FC = () => {
  // Get settings and feedback hooks
  const { settings } = useSettings();
  const { provideFeedback } = useFeedback();
  const {
    diceCount,
    threshold,
    rerollOnes,
    rollResults,
    lastRollSuccess,
    setDiceCount,
    setThreshold,
    setRerollOnes,
  } = useAppState();
  
  // Create a placeholder for last result display
  const lastResult = rollResults.length > 0 ? {
    values: rollResults,
    successes: rollResults.filter(val => val >= threshold).length,
    failures: rollResults.filter(val => val < threshold).length,
    threshold: threshold as DiceFace,
    timestamp: Date.now()
  } : null;
  
  // Handle changing the threshold
  const handleThresholdChange = (newThreshold: DiceFace) => {
    setThreshold(newThreshold);
  };
  
  // Handle changing the number of dice
  const handleNumDiceChange = (delta: number) => {
    provideFeedback('tap', 'light');
    const newValue = Math.max(1, Math.min(10, diceCount + delta));
    setDiceCount(newValue);
  };
  
  // Toggle reroll ones option
  const toggleRerollOnes = () => {
    provideFeedback('tap');
    setRerollOnes(!rerollOnes);
  };
  
  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <H1 align="center" style={styles.title}>
          Blood Bowl Dice Roll
        </H1>
        
        {/* Dice roll display */}
        <View style={styles.section}>
          <DiceRoll
            numDice={diceCount}
            threshold={threshold}
            rerollOnes={rerollOnes}
            useAppContext={true}
            onRollComplete={(result) => {
              // No need to set state here as it's managed by the app context
            }}
          />
        </View>
        
        {/* Dice sequence display */}
        <View style={styles.section}>
          <H2>Roll Sequence</H2>
          <DiceSequence 
            useAppContext={true}
            showPlaceholder={true}
            style={styles.diceSequence}
          />
        </View>
        
        {/* Roll options */}
        <View style={styles.section}>
          <H2>Roll Options</H2>
          
          {/* Number of dice */}
          <View style={styles.optionRow}>
            <Body>Number of Dice:</Body>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterButton} 
                onPress={() => handleNumDiceChange(-1)}
                disabled={diceCount <= 1}
              >
                <Body>-</Body>
              </TouchableOpacity>
              <View style={styles.counterValue}>
                <Body>{diceCount}</Body>
              </View>
              <TouchableOpacity 
                style={styles.counterButton} 
                onPress={() => handleNumDiceChange(1)}
                disabled={diceCount >= 10}
              >
                <Body>+</Body>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Threshold selection */}
          <View style={styles.thresholdContainer}>
            <Body>Threshold:</Body>
            <GridNumberSelection
              selectedNumber={threshold}
              onSelectNumber={handleThresholdChange}
              showThreshold={false}
              showInstructions={false}
              style={styles.thresholdSelection}
            />
          </View>
          
          {/* Reroll ones toggle */}
          <View style={styles.optionRow}>
            <Body>Reroll Ones:</Body>
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                rerollOnes ? styles.toggleButtonActive : null
              ]}
              onPress={toggleRerollOnes}
            >
              <Body style={rerollOnes ? styles.toggleTextActive : null}>
                {rerollOnes ? 'ON' : 'OFF'}
              </Body>
            </TouchableOpacity>
          </View>
          
          {/* Probability Display */}
          <View style={styles.probabilitySection}>
            <ProbabilityDisplay
              title="Probability of Success"
              useAppContext={true}
              showExplanation={true}
            />
          </View>
        </View>
        
        {/* Roll statistics */}
        {lastResult && (
          <View style={styles.section}>
            <H2>Roll Statistics</H2>
            
            {/* Outcome input section */}
            {lastRollSuccess === null && (
              <OutcomeInput style={{ marginBottom: 16 }} />
            )}
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Body>Success Rate:</Body>
                <Body>{((lastResult.successes / lastResult.values.length) * 100).toFixed(0)}%</Body>
              </View>
              <View style={styles.statItem}>
                <Body>Successes:</Body>
                <Body>{lastResult.successes}</Body>
              </View>
              <View style={styles.statItem}>
                <Body>Failures:</Body>
                <Body>{lastResult.failures}</Body>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  diceSequence: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 8,
    borderRadius: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  counterValue: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thresholdContainer: {
    marginVertical: 12,
  },
  thresholdSelection: {
    marginTop: 8,
    paddingHorizontal: 0,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: '#38B000',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  probabilitySection: {
    marginTop: 12,
  },
  statsContainer: {
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});

export default DiceRollScreen; 