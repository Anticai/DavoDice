import { DiceFace, RollAttempt } from '../types';
import statisticsService from './statistics';
import { DEFAULT_THRESHOLD } from '../constants';

export interface DiceRollResult {
  values: DiceFace[];
  successes: number;
  failures: number;
  threshold: DiceFace;
  timestamp: number;
}

export interface RollOptions {
  numDice?: number;
  threshold?: DiceFace;
  rerollOnes?: boolean;
}

/**
 * Service for handling dice rolls and calculations
 */
export const diceRollService = {
  /**
   * Roll a specified number of dice
   * @param options Roll options including number of dice and threshold
   * @returns Roll result with values and success count
   */
  rollDice: (options: RollOptions = {}): DiceRollResult => {
    const {
      numDice = 1,
      threshold = DEFAULT_THRESHOLD,
      rerollOnes = false
    } = options;
    
    // Roll the dice
    const values: DiceFace[] = [];
    for (let i = 0; i < numDice; i++) {
      let roll = getRandomDiceValue();
      
      // Re-roll ones if enabled
      if (rerollOnes && roll === 1) {
        roll = getRandomDiceValue();
      }
      
      values.push(roll);
    }
    
    // Calculate successes and failures
    const successes = values.filter(value => value >= threshold).length;
    const failures = values.length - successes;
    
    // Create result object
    const result: DiceRollResult = {
      values,
      successes,
      failures,
      threshold,
      timestamp: Date.now()
    };
    
    // Track roll in statistics
    const rollAttempt: RollAttempt = {
      sequence: values,
      threshold: threshold,
      timestamp: result.timestamp,
      outcome: successes > 0 ? 'success' : 'failure',
      failedAt: failures > 0 ? values.findIndex(v => v < threshold) : undefined
    };
    
    statisticsService.addRollAttempt(rollAttempt);
    
    return result;
  },
  
  /**
   * Calculate the probability of success for a given threshold
   * @param threshold The minimum value needed for success
   * @param rerollOnes Whether ones are rerolled
   * @returns Probability as a decimal (0-1)
   */
  calculateSuccessProbability: (threshold: DiceFace, rerollOnes: boolean = false): number => {
    // For a fair six-sided die
    const successValues = 7 - threshold; // Number of sides that count as success
    
    if (!rerollOnes) {
      // Simple probability = success values / total sides
      return successValues / 6;
    } else {
      // With reroll ones, we need to account for two probability branches
      if (threshold <= 1) {
        // If 1 is considered a success, rerolling doesn't change probability
        return successValues / 6;
      } else {
        // Initial probability without 1
        const initialSuccessProb = successValues / 6;
        // Probability of rolling 1 and then success on reroll
        const rerollSuccessProb = (1/6) * (successValues / 6);
        
        return initialSuccessProb + rerollSuccessProb;
      }
    }
  },
  
  /**
   * Calculate expected number of successes for multiple dice
   * @param numDice Number of dice to roll
   * @param threshold The minimum value needed for success
   * @param rerollOnes Whether ones are rerolled
   * @returns Expected number of successes
   */
  calculateExpectedSuccesses: (numDice: number, threshold: DiceFace, rerollOnes: boolean = false): number => {
    const singleDieProb = diceRollService.calculateSuccessProbability(threshold, rerollOnes);
    return numDice * singleDieProb;
  }
};

/**
 * Generate a random dice value (1-6)
 * @returns Random dice value
 */
function getRandomDiceValue(): DiceFace {
  // Generate random integer from 1-6
  return (Math.floor(Math.random() * 6) + 1) as DiceFace;
} 