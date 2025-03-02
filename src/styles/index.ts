import { 
  lightTheme, 
  darkTheme, 
  Theme, 
  lightColors, 
  darkColors,
  spacing,
  shadows,
  borderRadius,
  animations
} from './theme';
import typography from './typography';

// Export all style utilities
export {
  lightTheme,
  darkTheme,
  lightColors,
  darkColors,
  typography,
  spacing,
  shadows,
  borderRadius,
  animations,
};

// Re-export types
export type { Theme };

// Export theme as Theme
export const theme = lightTheme;

// Export default theme as light theme
export default lightTheme; 