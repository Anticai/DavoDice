import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Container } from '../components/Container';
import { Dice, DiceFaceValue } from '../components/Dice';
import { GridNumberSelection } from '../components/NumberSelection';
import { DiceFace } from '../types';
import { DEFAULT_THRESHOLD } from '../constants';
import { Text, Body, H1, H2 } from '../components/Text';

/**
 * Screen that demonstrates the number selection components
 */
const NumberSelectionScreen: React.FC = () => {
  // State for selected number and threshold
  const [selectedNumber, setSelectedNumber] = useState<DiceFace | undefined>(undefined);
  const [threshold, setThreshold] = useState<DiceFace>(DEFAULT_THRESHOLD);
  const [disabledNumbers, setDisabledNumbers] = useState<DiceFace[]>([]);
  
  // Handle selecting a number on the dice
  const handleDiceSelectNumber = (number: DiceFace) => {
    console.log(`Selected number on dice: ${number}`);
    setSelectedNumber(number);
  };
  
  // Handle selecting a number on the grid
  const handleGridSelectNumber = (number: DiceFace) => {
    console.log(`Selected number on grid: ${number}`);
    setSelectedNumber(number);
    
    // Toggle disabled state for the number
    if (disabledNumbers.includes(number)) {
      setDisabledNumbers(disabledNumbers.filter(n => n !== number));
    } else {
      setDisabledNumbers([...disabledNumbers, number]);
    }
  };
  
  // Handle threshold change
  const handleThresholdChange = (newThreshold: DiceFace) => {
    console.log(`Changed threshold to: ${newThreshold}`);
    setThreshold(newThreshold);
  };
  
  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <H1 align="center" style={styles.title}>
          Number Selection Demo
        </H1>
        
        {/* Dice with number selection */}
        <View style={styles.section}>
          <H2>Dice Selection</H2>
          <Body>
            Press and hold the dice to show the number selection
          </Body>
          
          <View style={styles.demoContainer}>
            <Dice
              onSelectNumber={handleDiceSelectNumber}
              onPress={() => console.log('Dice pressed')}
              onLongPress={() => console.log('Dice long pressed')}
            />
          </View>
          
          {selectedNumber && (
            <View style={styles.resultContainer}>
              <Body>
                You selected:
              </Body>
              <DiceFaceValue value={selectedNumber} />
            </View>
          )}
        </View>
        
        {/* Grid number selection */}
        <View style={styles.section}>
          <H2>Grid Selection</H2>
          <Body>
            Select numbers and adjust threshold
          </Body>
          
          <View style={styles.demoContainer}>
            <GridNumberSelection
              selectedNumber={selectedNumber}
              onSelectNumber={handleGridSelectNumber}
              threshold={threshold}
              onThresholdChange={handleThresholdChange}
              disabledNumbers={disabledNumbers}
              showThreshold={true}
              showInstructions={true}
            />
          </View>
        </View>
        
        {/* Summary */}
        <View style={styles.section}>
          <H2>Selection Summary</H2>
          <Body>
            Selected Number: {selectedNumber || 'None'}
          </Body>
          <Body>
            Threshold: {threshold}+
          </Body>
          <Body>
            Disabled Numbers: {disabledNumbers.length > 0 ? disabledNumbers.join(', ') : 'None'}
          </Body>
        </View>
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
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  demoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    minHeight: 180,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default NumberSelectionScreen; 