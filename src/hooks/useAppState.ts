/**
 * Custom hook for accessing app state
 */
import { useAppContext } from '../context/AppContext';
import { DiceFace, RollOutcome } from '../types';

/**
 * Hook to access and modify app state
 */
export const useAppState = () => {
  const { state, dispatch, rollDice, recordOutcome, resetResults } = useAppContext();
  
  // Setter functions
  const setDiceCount = (count: number) => {
    dispatch({ type: 'SET_DICE_COUNT', payload: count });
  };
  
  const setThreshold = (threshold: DiceFace) => {
    dispatch({ type: 'SET_THRESHOLD', payload: threshold });
  };
  
  const setRerollOnes = (reroll: boolean) => {
    dispatch({ type: 'SET_REROLL_ONES', payload: reroll });
  };
  
  return {
    // State values
    diceCount: state.diceCount,
    threshold: state.threshold,
    rerollOnes: state.rerollOnes,
    rollResults: state.rollResults,
    isRolling: state.isRolling,
    successProbability: state.successProbability,
    lastRollSuccess: state.lastRollSuccess,
    
    // Actions
    setDiceCount,
    setThreshold,
    setRerollOnes,
    rollDice,
    recordOutcome,
    resetResults,
  };
}; 