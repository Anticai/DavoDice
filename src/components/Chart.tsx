import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Body } from './Text';
import { useTheme } from '../hooks/useTheme';

/**
 * Data point for the bar chart
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * Props for the BarChart component
 */
interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  maxValue?: number;
  showValues?: boolean;
  title?: string;
  valueFormatter?: (value: number) => string;
}

/**
 * A simple bar chart component for displaying statistics
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 180,
  maxValue,
  showValues = true,
  title,
  valueFormatter = (value) => value.toString(),
}) => {
  const { colors } = useTheme();
  
  // Calculate maximum value for scaling
  const calculatedMaxValue = maxValue || Math.max(...data.map(item => item.value), 1);
  
  return (
    <View style={styles.container}>
      {title && <Body style={styles.title}>{title}</Body>}
      
      <View style={[styles.chartContainer, { height }]}>
        {data.map((item, index) => {
          // Calculate the height percentage based on the value
          const percentage = (item.value / calculatedMaxValue) * 100;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${percentage}%`,
                      backgroundColor: item.color || colors.primary
                    }
                  ]} 
                />
              </View>
              
              {showValues && (
                <Text style={styles.value}>
                  {valueFormatter(item.value)}
                </Text>
              )}
              
              <Text style={styles.label} numberOfLines={2}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/**
 * Props for the percentage bar component
 */
interface PercentageBarProps {
  percentage: number;
  height?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

/**
 * A horizontal percentage bar component
 */
export const PercentageBar: React.FC<PercentageBarProps> = ({
  percentage,
  height = 24,
  color,
  label,
  showPercentage = true,
}) => {
  const { colors } = useTheme();
  const barColor = color || colors.primary;
  
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  return (
    <View style={styles.percentageContainer}>
      {label && <Text style={styles.percentageLabel}>{label}</Text>}
      
      <View style={[styles.percentageBarContainer, { height }]}>
        <View 
          style={[
            styles.percentageBar, 
            { 
              width: `${clampedPercentage}%`,
              backgroundColor: barColor
            }
          ]} 
        />
        
        {showPercentage && (
          <Text style={styles.percentageValue}>
            {clampedPercentage.toFixed(0)}%
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20, // Space for value labels
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  value: {
    position: 'absolute',
    top: -16,
    fontSize: 10,
    color: '#FFFFFF',
  },
  label: {
    marginTop: 4,
    height: 20,
    width: '100%',
    fontSize: 10,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  percentageContainer: {
    marginVertical: 8,
  },
  percentageLabel: {
    marginBottom: 4,
  },
  percentageBarContainer: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  percentageBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageValue: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 