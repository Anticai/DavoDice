/**
 * Styles for the FailedRollSelector component
 */
import { StyleSheet } from 'react-native';
import { Theme } from './theme';

/**
 * Create styles for the failed roll selector with the provided theme
 */
export const createFailedRollSelectorStyles = (theme: Theme) => StyleSheet.create({
  // Container for the entire selector
  container: {
    marginVertical: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.md,
  },
  
  // Title for the failed roll selection
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  
  // Description text
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  
  // Row of dice
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: theme.spacing.sm,
  },
  
  // Individual dice item wrapper for highlighting
  diceWrapper: {
    margin: theme.spacing.xs,
    borderRadius: theme.spacing.sm,
    overflow: 'visible',
  },
  
  // Selected die
  selectedDie: {
    borderWidth: 2,
    borderColor: theme.colors.status.error,
    borderRadius: theme.spacing.sm,
  },
  
  // Failed die style
  failedDie: {
    borderWidth: 2,
    borderColor: theme.colors.status.error,
    borderRadius: theme.spacing.sm,
  },
  
  // Controls row
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  
  // Individual control button
  controlButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  
  // Confirm button
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  
  // Skip button
  skipButton: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  
  // Button text
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Confirm button text
  confirmButtonText: {
    color: theme.colors.text.light,
  },
  
  // Skip button text
  skipButtonText: {
    color: theme.colors.text.primary,
  },
});

// For backward compatibility, export failedRollSelectorStyles as a constant that uses the default theme
import { theme } from './index';
export const failedRollSelectorStyles = createFailedRollSelectorStyles(theme); 