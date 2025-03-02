import { StyleSheet } from 'react-native';
import { Theme } from './theme';

// Hardcoded value until TypeScript picks up our changes
const DICE_SIZE = 80;

/**
 * Create styles for the dice component with the provided theme
 */
export const createDiceStyles = (theme: Theme) => StyleSheet.create({
  // Container for the dice
  diceContainer: {
    width: DICE_SIZE,
    height: DICE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.dice,
    ...theme.shadows.md,
  },
  
  // Dice image
  diceImage: {
    width: DICE_SIZE * 0.8,
    height: DICE_SIZE * 0.8,
    resizeMode: 'contain',
  },
  
  // Active state when pressing
  diceContainerActive: {
    backgroundColor: theme.colors.ui.highlight,
    transform: [{ scale: 1.05 }],
  },
  
  // Shadow when lifted
  diceShadowLifted: {
    ...theme.shadows.lg,
  },
  
  // Container for numbers around the dice
  numbersContainer: {
    position: 'absolute',
    width: DICE_SIZE * 2.5,
    height: DICE_SIZE * 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Individual number circle
  numberCircle: {
    position: 'absolute',
    width: theme.spacing.xl,
    height: theme.spacing.xl,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.sm,
  },
  
  // Number positioning
  numberPosition1: {
    top: 0,
    left: '50%',
    transform: [{ translateX: -theme.spacing.xl / 2 }],
  },
  numberPosition2: {
    top: '25%',
    right: 0,
  },
  numberPosition3: {
    bottom: '25%',
    right: 0,
  },
  numberPosition4: {
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -theme.spacing.xl / 2 }],
  },
  numberPosition5: {
    bottom: '25%',
    left: 0,
  },
  numberPosition6: {
    top: '25%',
    left: 0,
  },
  
  // Number text
  numberText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    textAlign: 'center',
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

// For backward compatibility, export diceStyles as a constant that uses the default theme
import { theme } from './index';
export const diceStyles = createDiceStyles(theme); 