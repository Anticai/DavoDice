import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { H1, H2, Body } from '../components/Text';
import { Button } from '../components/Button';
import { DiceSequence } from '../components/DiceSequence';
import { Calculator } from '../components/Calculator';
import { ProbabilityDisplay } from '../components/ProbabilityDisplay';
import { OutcomeInput } from '../components/OutcomeInput';
import { useFeedback } from '../hooks';
import { useSettings } from '../hooks';
import { useAppState } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import { DiceFace } from '../types';

/**
 * Main calculator screen for dice probability calculations
 */
const CalculatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { settings } = useSettings();
  const { provideFeedback } = useFeedback();
  const {
    diceCount,
    threshold,
    rerollOnes,
    isRolling,
    rollResults,
    lastRollSuccess,
    successProbability,
    setDiceCount,
    setThreshold,
    setRerollOnes,
    rollDice,
    resetResults
  } = useAppState();

  // Handle threshold changes with type casting
  const handleThresholdChange = (value: number) => {
    setThreshold(value as DiceFace);
  };

  const handleRoll = useCallback(async () => {
    provideFeedback('tap', 'medium');
    try {
      await rollDice();
      provideFeedback(
        lastRollSuccess ? 'success' : 'error', 
        'heavy'
      );
    } catch (error) {
      console.error('Error rolling dice:', error);
      Alert.alert('Error', 'Failed to roll dice. Please try again.');
    }
  }, [rollDice, lastRollSuccess, provideFeedback]);

  const showStats = useCallback(() => {
    provideFeedback('tap');
    navigation.navigate('Stats' as never);
  }, [navigation, provideFeedback]);

  const showSettings = useCallback(() => {
    provideFeedback('tap');
    navigation.navigate('Settings' as never);
  }, [navigation, provideFeedback]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      <View style={styles.header}>
        <H1 style={{ color: colors.text.primary }}>Blood Bowl Dice</H1>
        <View style={styles.headerButtons}>
          <Button 
            title="Settings"
            onPress={showSettings} 
            style={styles.iconButton} 
          />
          <Button 
            title="Stats"
            onPress={showStats} 
            style={styles.iconButton} 
          />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.calculatorContainer}>
          <Calculator
            diceCount={diceCount}
            threshold={threshold}
            rerollOnes={rerollOnes}
            onDiceCountChange={setDiceCount}
            onThresholdChange={handleThresholdChange}
            onRerollOnesChange={setRerollOnes}
          />
          
          <ProbabilityDisplay />
          
          <Button
            title={isRolling ? 'Rolling...' : 'Roll Dice'}
            onPress={handleRoll}
            disabled={isRolling}
            style={styles.rollButton}
          />
        </View>
        
        {rollResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <H2 style={{ color: colors.text.primary, marginBottom: 16 }}>
              {lastRollSuccess !== null ? (lastRollSuccess ? 'Success!' : 'Failure!') : 'Roll Result'}
            </H2>
            
            <DiceSequence 
              useAppContext={true}
              diceSize={60}
              style={styles.diceSequence}
            />
            
            {lastRollSuccess === null && (
              <OutcomeInput style={{ marginTop: 16 }} />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  calculatorContainer: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  probabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rollButton: {
    marginTop: 8,
  },
  resultsContainer: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  diceSequence: {
    width: '100%',
    justifyContent: 'center',
  },
});

export default CalculatorScreen; 