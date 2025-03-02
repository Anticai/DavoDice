/**
 * Theme configuration for the Blood Bowl Dice Calculator
 */

import { Dimensions } from 'react-native';

export type ThemeColors = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  danger: string;
  dangerLight: string;
  dangerDark: string;
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  text: {
    primary: string;
    secondary: string;
    inverse: string;
    muted: string;
    highlight: string;
    light: string;
  };
  background: {
    main: string;
    card: string;
    elevated: string;
    input: string;
    dice: string;
  };
  ui: {
    border: string;
    disabled: string;
    highlight: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  status: {
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  dice: {
    face: string;
    shadow: string;
    highlight: string;
    success: string;
    fail: string;
    neutral: string;
  };
  diceNumbers: string[];
};

export type ThemeSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type ThemeShadows = {
  light: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  medium: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  heavy: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  // Aliases for convenience
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
};

export type ThemeAnimations = {
  durations: {
    short: number;
    medium: number;
    long: number;
  };
  timings: {
    default: string;
    spring: string;
    bounce: string;
  };
  scales: {
    pressed: number;
    active: number;
    selected: number;
  };
};

export type ThemeBorderRadius = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
};

export type Theme = {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  borderRadius: ThemeBorderRadius;
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  screenWidth: number;
  screenHeight: number;
};

// Device dimensions for responsive layouts
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Light theme colors
export const lightColors: ThemeColors = {
  primary: '#5E35B1', // Rich purple
  primaryLight: '#9162E4',
  primaryDark: '#4527A0',
  secondary: '#00BCD4', // Cyan
  secondaryLight: '#62EFFF',
  secondaryDark: '#008BA3',
  danger: '#F44336', // Red
  dangerLight: '#FF7961',
  dangerDark: '#BA000D',
  success: '#4CAF50', // Green
  successLight: '#80E27E',
  successDark: '#087F23',
  warning: '#FFC107', // Amber
  warningLight: '#FFF350',
  warningDark: '#C79100',
  text: {
    primary: '#212121',
    secondary: '#757575',
    inverse: '#FFFFFF',
    muted: '#9E9E9E',
    highlight: '#5E35B1',
    light: '#FFFFFF',
  },
  background: {
    main: '#F5F5F5',
    card: '#FFFFFF',
    elevated: '#FAFAFA',
    input: '#EEEEEE',
    dice: '#FFFFFF',
  },
  ui: {
    border: '#E0E0E0',
    disabled: '#9E9E9E',
    highlight: '#5E35B1',
  },
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#9E9E9E',
  },
  status: {
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
  },
  dice: {
    face: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.2)',
    highlight: 'rgba(255, 255, 255, 0.8)',
    success: '#4CAF50',
    fail: '#F44336',
    neutral: '#9E9E9E',
  },
  diceNumbers: ['1', '2', '3', '4', '5', '6'],
};

// Dark theme colors
export const darkColors: ThemeColors = {
  primary: '#B39DDB', // Lighter purple for dark theme
  primaryLight: '#E6CEFF',
  primaryDark: '#836FA9',
  secondary: '#80DEEA', // Lighter cyan
  secondaryLight: '#B4FFFF',
  secondaryDark: '#4BACB8',
  danger: '#EF9A9A', // Lighter red
  dangerLight: '#FFCCCB',
  dangerDark: '#BA6B6C',
  success: '#81C784', // Lighter green
  successLight: '#B2FAB4',
  successDark: '#519657',
  warning: '#FFD54F', // Lighter amber
  warningLight: '#FFFF81',
  warningDark: '#C8A415',
  text: {
    primary: '#EEEEEE',
    secondary: '#BDBDBD',
    inverse: '#212121',
    muted: '#757575',
    highlight: '#B39DDB',
    light: '#FFFFFF',
  },
  background: {
    main: '#121212',
    card: '#1E1E1E',
    elevated: '#2C2C2C',
    input: '#333333',
    dice: '#2C2C2C',
  },
  ui: {
    border: '#424242',
    disabled: '#757575',
    highlight: '#B39DDB',
  },
  border: {
    light: '#424242',
    medium: '#616161',
    dark: '#757575',
  },
  status: {
    error: '#EF9A9A',
    success: '#81C784',
    warning: '#FFD54F',
    info: '#90CAF9',
  },
  dice: {
    face: '#2C2C2C',
    shadow: 'rgba(0, 0, 0, 0.5)',
    highlight: 'rgba(255, 255, 255, 0.1)',
    success: '#81C784',
    fail: '#EF9A9A',
    neutral: '#757575',
  },
  diceNumbers: ['1', '2', '3', '4', '5', '6'],
};

// Spacing values for consistent layout
export const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Shadow styles for elevation
export const shadows: ThemeShadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  // Aliases for convenience
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Animation configurations
export const animations: ThemeAnimations = {
  durations: {
    short: 150,
    medium: 300,
    long: 500,
  },
  timings: {
    default: 'ease-in-out',
    spring: 'spring',
    bounce: 'bounce',
  },
  scales: {
    pressed: 0.96,
    active: 1.05,
    selected: 1.1,
  },
};

// Border radius values
export const borderRadius: ThemeBorderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Light theme (default)
export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  shadows,
  animations,
  borderRadius,
  fontSizes: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
    xxxl: 36,
  },
  screenWidth,
  screenHeight,
};

// Dark theme
export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  shadows,
  animations,
  borderRadius,
  fontSizes: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
    xxxl: 36,
  },
  screenWidth,
  screenHeight,
};

export default lightTheme; 