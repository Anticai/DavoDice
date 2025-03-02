import { DiceFace, DiceSequence } from '../types';
// import { MAX_DICE_VALUE } from '../constants'; // Temporarily commented out

// Hardcoded value until TypeScript picks up our changes
const MAX_DICE_VALUE = 6;

/**
 * Service for calculating dice roll probabilities
 */
class ProbabilityService {
  /**
   * Calculate the probability of rolling over a threshold on a single die
   * @param threshold Value that must be exceeded (e.g., 4 for "roll over 4")
   * @returns Probability as a number between 0 and 1
   */
  calculateSingleDieProbability(threshold: number): number {
    // Calculate how many faces are "success" faces
    const successFaces = MAX_DICE_VALUE - threshold + 1;
    
    // Probability is number of success faces divided by total faces
    return successFaces / MAX_DICE_VALUE;
  }

  /**
   * Calculate probability of successfully completing a sequence of rolls
   * @param sequence Current dice sequence
   * @param threshold Value that must be exceeded (e.g., 4 for "roll over 4")
   * @returns Probability as a number between 0 and 1
   */
  calculateSequenceProbability(sequence: DiceSequence, threshold: number): number {
    // For each die in the sequence, it must succeed
    // So probability is product of individual probabilities
    
    // First calculate single die probability
    const singleDieProbability = this.calculateSingleDieProbability(threshold);
    
    // Raise to power of sequence length
    return Math.pow(singleDieProbability, sequence.length);
  }

  /**
   * Format probability as a percentage
   * @param probability Probability as a number between 0 and 1
   * @returns Formatted percentage string (e.g., "75%")
   */
  formatAsPercentage(probability: number): string {
    return `${Math.round(probability * 100)}%`;
  }

  /**
   * Format probability as a fraction
   * @param probability Probability as a number between 0 and 1
   * @returns Formatted fraction string (e.g., "3/4")
   */
  formatAsFraction(probability: number): string {
    // For a single die
    if (probability === 0) return '0/6';
    if (probability === 1) return '6/6';
    
    const singleDieSuccessFaces = MAX_DICE_VALUE - Math.ceil(probability * MAX_DICE_VALUE) + 1;
    
    // For sequence of dice with same threshold
    if (probability <= 1/6) return `≤ 1/6^n`;
    
    // For simple fractions, return as is
    if (probability === 1/6) return '1/6';
    if (probability === 2/6) return '1/3';
    if (probability === 3/6) return '1/2';
    if (probability === 4/6) return '2/3';
    if (probability === 5/6) return '5/6';
    
    // For more complex probabilities, use approximation
    return `~${singleDieSuccessFaces}/${MAX_DICE_VALUE}^n`;
  }

  /**
   * Calculate the odds (e.g. "2 to 1") of success vs failure
   * @param probability Probability as a number between 0 and 1
   * @returns Formatted odds string (e.g., "3:1")
   */
  calculateOdds(probability: number): string {
    if (probability <= 0) return '0:1';
    if (probability >= 1) return '1:0';
    
    const successPart = probability;
    const failurePart = 1 - probability;
    
    // Normalize to whole numbers if possible
    if (successPart > failurePart) {
      const ratio = successPart / failurePart;
      const rounded = Math.round(ratio * 10) / 10; // Round to 1 decimal place
      return `${rounded}:1`;
    } else {
      const ratio = failurePart / successPart;
      const rounded = Math.round(ratio * 10) / 10; // Round to 1 decimal place
      return `1:${rounded}`;
    }
  }
}

export default new ProbabilityService(); 