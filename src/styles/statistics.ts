import { StyleSheet } from 'react-native';
import { Theme } from './theme';

/**
 * Create styles for the statistics display components with the provided theme
 */
export const createStatisticsStyles = (theme: Theme) => StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
  },
  
  // Success Rate Display styles
  successRateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  
  rateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  rateLabel: {
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  
  totalRolls: {
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    color: theme.colors.text.secondary,
  },
  
  // Stats Display styles
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: theme.spacing.sm,
  },
  
  statsTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
  },
  
  filterButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  
  filterLabel: {
    fontSize: theme.fontSizes.sm,
  },
  
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  
  statLabel: {
    fontSize: theme.fontSizes.md,
    flex: 2,
  },
  
  statValue: {
    fontSize: theme.fontSizes.md,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  
  statPercentage: {
    fontSize: theme.fontSizes.md,
    flex: 1,
    textAlign: 'right',
    color: theme.colors.text.secondary,
  },
  
  noStats: {
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.secondary,
    padding: theme.spacing.md,
  },
  
  // Chart styles
  chartContainer: {
    height: 200,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  
  legendLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
});

// For backward compatibility, export statisticsStyles as a constant that uses the default theme
import { theme } from './index';
export const statisticsStyles = createStatisticsStyles(theme); 