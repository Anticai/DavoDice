import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import NavigationTransition from '../components/NavigationTransition';
import { PerformanceLevel } from '../hooks/useAnimationPerformance';

/**
 * Screen that allows users to adjust animation performance settings
 * for optimal experience across different devices
 */
const PerformanceSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { settings, updateSetting } = useSettings();
  const [selectedLevel, setSelectedLevel] = useState<PerformanceLevel>(
    (settings?.performanceLevel as PerformanceLevel) || PerformanceLevel.HIGH
  );

  // Save performance level when it changes
  const savePerformanceLevel = (level: PerformanceLevel) => {
    setSelectedLevel(level);
    updateSetting('performanceLevel', level);
  };

  // Get appropriate border color
  const borderColor = colors.text.secondary + '33'; // Add transparency

  // Performance level descriptions
  const levelDescriptions = {
    [PerformanceLevel.HIGH]: 'Full animations with all effects. Best for newer, high-end devices.',
    [PerformanceLevel.MEDIUM]: 'Balanced animations with moderate effects. Good for most devices.',
    [PerformanceLevel.LOW]: 'Reduced animations with minimal effects. For older or budget devices.',
    [PerformanceLevel.CRITICAL]: 'Minimal animations only when necessary. For very old or slow devices.'
  };

  return (
    <NavigationTransition type="fade">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.main }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Performance Settings
        </Text>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Animation Performance
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.text.secondary }]}>
              Adjust animation quality based on your device's performance. Higher settings look better but may run slower on some devices.
            </Text>
            
            {Object.values(PerformanceLevel).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.performanceOption,
                  { 
                    borderColor: borderColor,
                    backgroundColor: selectedLevel === level 
                      ? colors.primary + '20' // Semi-transparent primary
                      : 'transparent'
                  }
                ]}
                onPress={() => savePerformanceLevel(level)}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)} Quality
                  </Text>
                  <View style={[
                    styles.indicator, 
                    { 
                      backgroundColor: selectedLevel === level ? colors.primary : 'transparent',
                      borderColor: colors.primary
                    }
                  ]} />
                </View>
                
                <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                  {levelDescriptions[level]}
                </Text>
                
                <View style={styles.featureList}>
                  {level === PerformanceLevel.HIGH && (
                    <>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Full particle effects
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Staggered animations
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Advanced physics effects
                      </Text>
                    </>
                  )}
                  
                  {level === PerformanceLevel.MEDIUM && (
                    <>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Reduced particle effects
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Staggered animations
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Simplified physics effects
                      </Text>
                    </>
                  )}
                  
                  {level === PerformanceLevel.LOW && (
                    <>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Minimal particle effects
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • No staggered animations
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Simplified animations
                      </Text>
                    </>
                  )}
                  
                  {level === PerformanceLevel.CRITICAL && (
                    <>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • No particle effects
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Essential animations only
                      </Text>
                      <Text style={[styles.feature, { color: colors.text.secondary }]}>
                        • Optimized for low-end devices
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              About Auto-Detection
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.text.secondary }]}>
              By default, the app will automatically detect your device's capabilities and adjust animation quality accordingly. Selecting a specific level above will override this behavior.
            </Text>
            
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: colors.status.info }]}
              onPress={() => {
                updateSetting('performanceLevel', undefined);
                setSelectedLevel(PerformanceLevel.HIGH);
              }}
            >
              <Text style={styles.resetButtonText}>
                Reset to Auto-Detect
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </NavigationTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  performanceOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  optionDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  featureList: {
    marginTop: 8,
  },
  feature: {
    fontSize: 14,
    marginBottom: 4,
  },
  resetButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PerformanceSettingsScreen; 