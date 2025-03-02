import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { H2, Body } from './Text';
import { statisticsStyles } from '../styles/statistics';
import { useTheme } from '../context/ThemeContext';
import { statisticsService } from '../services';
import { useAppState } from '../hooks';
import { RollAttempt, RollStatistics } from '../types';

interface StatisticsDisplayProps {
  /**
   * Optional title override
   */
  title?: string;
  
  /**
   * Whether to show a chart
   */
  showChart?: boolean;
  
  /**
   * Optional style overrides
   */
  style?: any;
}

// Types of statistics filters
type StatFilterType = 'all' | 'byThreshold' | 'byDiceCount';

/**
 * Component to display detailed statistics about dice rolls
 */
export const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  title = 'Detailed Statistics',
  showChart = true,
  style,
}) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<StatFilterType>('all');
  const [statistics, setStatistics] = useState<RollStatistics | null>(null);
  const [rollHistory, setRollHistory] = useState<RollAttempt[]>([]);
  
  // Calculate derived statistics
  const [derivedStats, setDerivedStats] = useState({
    byThreshold: {} as Record<string, { totalRolls: number, successfulRolls: number }>,
    byDiceCount: {} as Record<string, { totalRolls: number, successfulRolls: number }>,
  });
  
  // Load statistics on mount
  useEffect(() => {
    loadStatistics();
  }, []);
  
  // Calculate derived statistics when roll history changes
  useEffect(() => {
    if (rollHistory.length === 0) return;
    
    const byThreshold: Record<string, { totalRolls: number, successfulRolls: number }> = {};
    const byDiceCount: Record<string, { totalRolls: number, successfulRolls: number }> = {};
    
    // Process roll history
    rollHistory.forEach(roll => {
      const diceCount = roll.sequence.length;
      const threshold = roll.threshold;
      const isSuccess = roll.outcome === 'success';
      
      // By threshold
      if (!byThreshold[threshold]) {
        byThreshold[threshold] = { totalRolls: 0, successfulRolls: 0 };
      }
      byThreshold[threshold].totalRolls++;
      if (isSuccess) {
        byThreshold[threshold].successfulRolls++;
      }
      
      // By dice count
      if (!byDiceCount[diceCount]) {
        byDiceCount[diceCount] = { totalRolls: 0, successfulRolls: 0 };
      }
      byDiceCount[diceCount].totalRolls++;
      if (isSuccess) {
        byDiceCount[diceCount].successfulRolls++;
      }
    });
    
    setDerivedStats({ byThreshold, byDiceCount });
  }, [rollHistory]);
  
  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const stats = statisticsService.getStatistics();
      const history = statisticsService.getRollHistory();
      
      setStatistics(stats);
      setRollHistory(history);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter buttons
  const renderFilterButtons = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
      <TouchableOpacity
        style={[
          statisticsStyles.filterButton,
          activeFilter === 'all' && { backgroundColor: colors.primary + '33' }
        ]}
        onPress={() => setActiveFilter('all')}
      >
        <Body style={statisticsStyles.filterLabel}>All Rolls</Body>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          statisticsStyles.filterButton,
          { marginHorizontal: 8 },
          activeFilter === 'byThreshold' && { backgroundColor: colors.primary + '33' }
        ]}
        onPress={() => setActiveFilter('byThreshold')}
      >
        <Body style={statisticsStyles.filterLabel}>By Threshold</Body>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          statisticsStyles.filterButton,
          activeFilter === 'byDiceCount' && { backgroundColor: colors.primary + '33' }
        ]}
        onPress={() => setActiveFilter('byDiceCount')}
      >
        <Body style={statisticsStyles.filterLabel}>By Dice Count</Body>
      </TouchableOpacity>
    </View>
  );
  
  // Render statistics data based on filter
  const renderStatistics = () => {
    if (isLoading) {
      return (
        <Body style={statisticsStyles.noStats}>Loading statistics...</Body>
      );
    }
    
    if (!statistics || rollHistory.length === 0) {
      return (
        <Body style={statisticsStyles.noStats}>No statistics available.</Body>
      );
    }
    
    let stats = [];
    
    if (activeFilter === 'byThreshold') {
      const { byThreshold } = derivedStats;
      stats = Object.keys(byThreshold)
        .sort((a, b) => Number(a) - Number(b))
        .map(threshold => {
          const { totalRolls, successfulRolls } = byThreshold[threshold];
          const successRate = totalRolls > 0 ? (successfulRolls / totalRolls) * 100 : 0;
          return {
            label: `Threshold ${threshold}+`,
            value: `${successfulRolls}/${totalRolls}`,
            percentage: `${successRate.toFixed(1)}%`,
          };
        });
    } else if (activeFilter === 'byDiceCount') {
      const { byDiceCount } = derivedStats;
      stats = Object.keys(byDiceCount)
        .sort((a, b) => Number(a) - Number(b))
        .map(count => {
          const { totalRolls, successfulRolls } = byDiceCount[count];
          const successRate = totalRolls > 0 ? (successfulRolls / totalRolls) * 100 : 0;
          return {
            label: `${count} Dice`,
            value: `${successfulRolls}/${totalRolls}`,
            percentage: `${successRate.toFixed(1)}%`,
          };
        });
    } else {
      // Show overall summary
      stats = [
        {
          label: 'Total Rolls',
          value: `${statistics.totalRolls}`,
          percentage: '',
        },
        {
          label: 'Successful Rolls',
          value: `${statistics.successfulRolls}`,
          percentage: `${(statistics.successRate * 100).toFixed(1)}%`,
        },
        {
          label: 'Failed Rolls',
          value: `${statistics.failedRolls}`,
          percentage: `${((1 - statistics.successRate) * 100).toFixed(1)}%`,
        }
      ];
    }
    
    return (
      <ScrollView>
        {stats.map((stat, index) => (
          <View key={index} style={statisticsStyles.statRow}>
            <Body style={statisticsStyles.statLabel}>{stat.label}</Body>
            <Body style={statisticsStyles.statValue}>{stat.value}</Body>
            {stat.percentage && (
              <Body style={statisticsStyles.statPercentage}>{stat.percentage}</Body>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };
  
  return (
    <View style={[statisticsStyles.container, style]}>
      <View style={statisticsStyles.statsHeader}>
        <H2 style={statisticsStyles.statsTitle}>{title}</H2>
      </View>
      
      {renderFilterButtons()}
      {renderStatistics()}
    </View>
  );
};

export default StatisticsDisplay; 