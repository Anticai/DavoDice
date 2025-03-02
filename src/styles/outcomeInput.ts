import { StyleSheet } from 'react-native';
import { Theme } from './theme';

/**
 * Create styles for the outcome input component with the provided theme
 */
export const createOutcomeInputStyles = (theme: Theme) => StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  prompt: {
    fontSize: theme.fontSizes.md,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: 120,
    ...theme.shadows.sm,
  },
  
  successButton: {
    backgroundColor: theme.colors.status.success,
  },
  
  failureButton: {
    backgroundColor: theme.colors.status.error,
  },
  
  buttonText: {
    color: theme.colors.text.light,
    fontWeight: '700',
    fontSize: theme.fontSizes.md,
    marginLeft: theme.spacing.xs,
  },
  
  feedbackText: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'italic',
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: theme.fontSizes.md,
    fontWeight: '700',
  },
  
  statLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
  },
});

// For backward compatibility, export outcomeInputStyles as a constant that uses the default theme
import { theme } from './index';
export const outcomeInputStyles = createOutcomeInputStyles(theme); 