import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { H1, Body } from './Text';
import { statisticsStyles } from '../styles/statistics';
import { useTheme } from '../context/ThemeContext';
import { statisticsService } from '../services';
import { useAppState } from '../hooks';

interface SuccessRateDisplayProps {
  /**
   * Whether to show the total rolls count
   */
  showTotalRolls?: boolean;
  
  /**
   * Optional title override
   */
  title?: string;
  
  /**
   * Optional style overrides
   */
  style?: any;
  
  /**
   * Optional container style overrides
   */
  containerStyle?: any;
}

/**
 * Component to display the overall success rate of dice rolls
 */
export const SuccessRateDisplay: React.FC<SuccessRateDisplayProps> = ({
  showTotalRolls = true,
  title = 'Success Rate',
  style,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const [successRate, setSuccessRate] = useState<number>(0);
  const [totalRolls, setTotalRolls] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load statistics on mount
  useEffect(() => {
    loadStatistics();
  }, []);
  
  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const stats = await statisticsService.getStatistics();
      if (stats) {
        const total = stats.totalRolls || 0;
        const successful = stats.successfulRolls || 0;
        const rate = total > 0 ? (successful / total) * 100 : 0;
        
        setSuccessRate(rate);
        setTotalRolls(total);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine text color based on success rate
  const getColorForRate = (rate: number) => {
    if (rate >= 70) return colors.status.success;
    if (rate >= 40) return colors.primary;
    return colors.status.error;
  };
  
  return (
    <View 
      style={[
        statisticsStyles.container, 
        containerStyle
      ]}
    >
      <View style={[statisticsStyles.successRateContainer, style]}>
        <Body style={{ color: colors.text.primary, marginBottom: 8 }}>
          {title}
        </Body>
        
        {isLoading ? (
          <Body>Loading...</Body>
        ) : (
          <>
            <H1 
              style={[
                statisticsStyles.rateValue, 
                { color: getColorForRate(successRate) }
              ]}
            >
              {successRate.toFixed(1)}%
            </H1>
            
            <Body style={statisticsStyles.rateLabel}>
              of all dice rolls are successful
            </Body>
            
            {showTotalRolls && (
              <Body style={statisticsStyles.totalRolls}>
                Based on {totalRolls} total {totalRolls === 1 ? 'roll' : 'rolls'}
              </Body>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SuccessRateDisplay; 