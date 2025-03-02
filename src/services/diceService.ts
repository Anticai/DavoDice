import { RollOutcome } from '../types';

interface DiceRollResult {
  rolls: number[];
  outcome: RollOutcome;
}

/**
 * Service for handling dice rolls and probability calculations
 */
const diceService = {
  /**
   * Roll dice with the given parameters
   * @param diceCount Number of dice to roll
   * @param threshold Minimum value for success
   * @param rerollOnes Whether to reroll ones
   * @returns Result of the dice roll
   */
  rollDice: async (
    diceCount: number,
    threshold: number,
    rerollOnes: boolean
  ): Promise<DiceRollResult> => {
    // Simulate dice rolling with a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const rolls: number[] = [];
    
    // Roll each die
    for (let i = 0; i < diceCount; i++) {
      let roll = Math.floor(Math.random() * 6) + 1;
      
      // Reroll ones if enabled
      if (rerollOnes && roll === 1) {
        roll = Math.floor(Math.random() * 6) + 1;
      }
      
      rolls.push(roll);
    }
    
    // Determine outcome
    const successCount = rolls.filter(roll => roll >= threshold).length;
    const outcome = successCount > 0 ? 'success' as RollOutcome : 'failure' as RollOutcome;
    
    return {
      rolls,
      outcome
    };
  },
  
  /**
   * Calculate the probability of success for a single die
   * @param threshold Minimum value for success
   * @param rerollOnes Whether to reroll ones
   * @returns Probability of success (0-1)
   */
  calculateSingleDieProbability: (
    threshold: number,
    rerollOnes: boolean
  ): number => {
    // Calculate success probability for a single die
    const successValues = 7 - threshold; // Number of faces that are successful
    const totalFaces = 6;
    
    if (!rerollOnes) {
      return successValues / totalFaces;
    } else {
      // With reroll ones, we need to calculate differently
      if (threshold <= 1) {
        return 1; // Always success if threshold is 1 or less
      }
      
      // Probability of success on first roll
      const firstRollSuccess = successValues / totalFaces;
      
      // Probability of rolling a 1 and then succeeding on reroll
      const rerollSuccess = (1 / totalFaces) * (successValues / totalFaces);
      
      return firstRollSuccess + rerollSuccess;
    }
  },
  
  /**
   * Calculate the probability of at least one success with multiple dice
   * @param diceCount Number of dice
   * @param threshold Minimum value for success
   * @param rerollOnes Whether to reroll ones
   * @returns Probability of at least one success (0-1)
   */
  calculateProbability: (
    diceCount: number,
    threshold: number,
    rerollOnes: boolean
  ): number => {
    // Get single die probability
    const singleDieProbability = diceService.calculateSingleDieProbability(
      threshold,
      rerollOnes
    );
    
    // Probability of all dice failing
    const allFailProbability = Math.pow(1 - singleDieProbability, diceCount);
    
    // Probability of at least one success
    return 1 - allFailProbability;
  }
};

export default diceService; 