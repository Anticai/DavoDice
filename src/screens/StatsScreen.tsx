import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, H1, Body } from '../components/Text';
import { Button } from '../components/Button';
import { useFeedback } from '../hooks';
import { statisticsService } from '../services';
import { useTheme } from '../context/ThemeContext';
import { SuccessRateDisplay } from '../components/SuccessRateDisplay';
import { StatisticsDisplay } from '../components/StatisticsDisplay';

/**
 * Statistics screen showing dice roll performance
 */
const StatsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { provideFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      // Simply initialize the service
      await statisticsService.initialize();
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetStats = () => {
    provideFeedback('tap');
    
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all statistics? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            provideFeedback('tap', 'heavy');
            try {
              await statisticsService.resetStatistics();
              // Reload stats after reset
              loadStats();
              Alert.alert('Success', 'Statistics have been reset successfully.');
            } catch (error) {
              console.error('Failed to reset statistics:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      <View style={styles.header}>
        <H1 style={{ color: colors.text.primary }}>Statistics</H1>
        <Button 
          title="Back"
          onPress={() => {
            provideFeedback('tap');
            navigation.goBack();
          }}
        />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <Body style={{ color: colors.text.primary }}>Loading statistics...</Body>
        ) : (
          <>
            {/* Success Rate Display */}
            <SuccessRateDisplay
              showTotalRolls={true}
              title="Overall Success Rate"
            />
            
            {/* Detailed Statistics */}
            <StatisticsDisplay 
              title="Roll Performance"
              showChart={false}
            />
            
            <Button
              title="Reset Statistics"
              onPress={handleResetStats}
              style={styles.resetButton}
            />
          </>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  statCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 24,
  },
});

export default StatsScreen; 