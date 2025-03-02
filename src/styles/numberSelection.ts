import { StyleSheet } from 'react-native';
import { Theme } from './theme';
// import { DICE_SIZE } from '../constants'; // Temporarily commented out

// Hardcoded value until TypeScript picks up our changes
const DICE_SIZE = 80;

/**
 * Create styles for the number selection components with the provided theme
 */
export const createNumberSelectionStyles = (theme: Theme) => StyleSheet.create({
  // Container for the grid layout
  container: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  
  // Row of numbers
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  
  // Individual number item
  numberItem: {
    width: theme.spacing.xxl,
    height: theme.spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background.main,
    ...theme.shadows.sm,
    margin: theme.spacing.xs,
  },
  
  // Selected number
  selectedNumberItem: {
    backgroundColor: theme.colors.primary,
  },
  
  // Disabled number
  disabledNumberItem: {
    backgroundColor: theme.colors.ui.disabled,
    opacity: 0.5,
  },
  
  // Number text
  numberText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  
  // Selected number text
  selectedNumberText: {
    color: theme.colors.text.light,
  },
  
  // Disabled number text
  disabledNumberText: {
    color: theme.colors.text.secondary,
  },
  
  // Threshold container
  thresholdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  
  // Threshold text
  thresholdText: {
    fontSize: theme.fontSizes.md,
    fontWeight: '500',
    marginRight: theme.spacing.sm,
  },
  
  // Instruction text
  instructionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  
  // Number colors (1-6)
  numberColor1: {
    color: theme.colors.diceNumbers[0],
  },
  numberColor2: {
    color: theme.colors.diceNumbers[1],
  },
  numberColor3: {
    color: theme.colors.diceNumbers[2],
  },
  numberColor4: {
    color: theme.colors.diceNumbers[3],
  },
  numberColor5: {
    color: theme.colors.diceNumbers[4],
  },
  numberColor6: {
    color: theme.colors.diceNumbers[5],
  },
});

// For backward compatibility, export numberSelectionStyles as a constant that uses the default theme
import { theme } from './index';
export const numberSelectionStyles = createNumberSelectionStyles(theme); 