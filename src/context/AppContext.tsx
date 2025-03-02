import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { DiceFace, RollOutcome, DiceSequence } from '../types';
import { diceService, statisticsService, settingsService } from '../services';

// Define the state types
interface AppState {
  // Dice roll parameters
  diceCount: number;
  threshold: DiceFace;
  rerollOnes: boolean;
  
  // Roll results
  rollResults: number[];
  isRolling: boolean;
  lastRollSuccess: boolean | null;
  
  // Probability
  successProbability: number | null;
}

// Define action types
type AppAction = 
  | { type: 'SET_DICE_COUNT'; payload: number }
  | { type: 'SET_THRESHOLD'; payload: DiceFace }
  | { type: 'SET_REROLL_ONES'; payload: boolean }
  | { type: 'START_ROLLING' }
  | { type: 'FINISH_ROLLING'; payload: { rolls: number[]; success: boolean } }
  | { type: 'UPDATE_PROBABILITY'; payload: number }
  | { type: 'RECORD_OUTCOME'; payload: boolean }
  | { type: 'RESET_RESULTS' };

// Initial state
const initialState: AppState = {
  diceCount: 1,
  threshold: 4 as DiceFace,
  rerollOnes: false,
  rollResults: [],
  isRolling: false,
  lastRollSuccess: null,
  successProbability: null,
};

// Create the context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  rollDice: () => Promise<void>;
  recordOutcome: (outcome: RollOutcome) => Promise<void>;
  resetResults: () => void;
} | undefined>(undefined);

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_DICE_COUNT':
      return { ...state, diceCount: action.payload };
    
    case 'SET_THRESHOLD':
      return { ...state, threshold: action.payload };
    
    case 'SET_REROLL_ONES':
      return { ...state, rerollOnes: action.payload };
    
    case 'START_ROLLING':
      return { ...state, isRolling: true };
    
    case 'FINISH_ROLLING':
      return {
        ...state,
        isRolling: false,
        rollResults: action.payload.rolls,
        lastRollSuccess: action.payload.success,
      };
    
    case 'UPDATE_PROBABILITY':
      return { ...state, successProbability: action.payload };
    
    case 'RECORD_OUTCOME':
      return { ...state, lastRollSuccess: action.payload };
    
    case 'RESET_RESULTS':
      return {
        ...state,
        rollResults: [],
        lastRollSuccess: null,
      };
    
    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Update probability when inputs change
  useEffect(() => {
    const { diceCount, threshold, rerollOnes } = state;
    const probability = diceService.calculateProbability(
      diceCount,
      threshold,
      rerollOnes
    );
    
    dispatch({ type: 'UPDATE_PROBABILITY', payload: probability });
  }, [state.diceCount, state.threshold, state.rerollOnes]);
  
  // Roll dice function
  const rollDice = async () => {
    if (state.isRolling) return;
    
    dispatch({ type: 'START_ROLLING' });
    
    try {
      const { diceCount, threshold, rerollOnes } = state;
      const result = await diceService.rollDice(diceCount, threshold, rerollOnes);
      
      dispatch({
        type: 'FINISH_ROLLING',
        payload: {
          rolls: result.rolls,
          success: result.outcome === 'success',
        },
      });
      
      // Record statistics
      await statisticsService.addRollAttempt({
        sequence: result.rolls as DiceSequence,
        threshold,
        outcome: result.outcome as RollOutcome,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error rolling dice:', error);
      dispatch({
        type: 'FINISH_ROLLING',
        payload: {
          rolls: [],
          success: false,
        },
      });
    }
  };
  
  // Record outcome function
  const recordOutcome = async (outcome: RollOutcome) => {
    try {
      const isSuccess = outcome === 'success';
      
      // Update state with the outcome
      dispatch({ type: 'RECORD_OUTCOME', payload: isSuccess });
      
      // Record statistics
      if (state.rollResults.length > 0) {
        await statisticsService.addRollAttempt({
          sequence: state.rollResults as DiceSequence,
          threshold: state.threshold,
          outcome,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error recording outcome:', error);
      throw error;
    }
  };
  
  // Reset results function
  const resetResults = () => {
    dispatch({ type: 'RESET_RESULTS' });
  };
  
  return (
    <AppContext.Provider value={{ state, dispatch, rollDice, recordOutcome, resetResults }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 