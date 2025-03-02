import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';

/**
 * Custom hook for accessing the current theme
 * @returns The current theme context
 */
export const useTheme = (): ThemeContextType => {
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return themeContext;
}; 