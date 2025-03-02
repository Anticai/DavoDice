import { TextStyle } from 'react-native';

export type FontFamily = 'regular' | 'medium' | 'semiBold' | 'bold';

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export type FontWeight = '400' | '500' | '600' | '700' | '800' | '900';

export interface TypographyStyles {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  bodyLarge: TextStyle;
  button: TextStyle;
  caption: TextStyle;
  label: TextStyle;
  overline: TextStyle;
}

// Font sizes in pixels
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Font weights
export const fontWeights = {
  regular: '400' as FontWeight,
  medium: '500' as FontWeight,
  semiBold: '600' as FontWeight,
  bold: '700' as FontWeight,
  extraBold: '800' as FontWeight,
  black: '900' as FontWeight,
};

// Font families - you would replace these with actual font names if you add custom fonts
export const fontFamilies = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

// Line heights (multiplier of font size)
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

// Letter spacing
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  extraWide: 1,
};

// Create a type style
const createTextStyle = (
  size: number,
  weight: FontWeight,
  lineHeight: number = lineHeights.normal,
  spacing: number = letterSpacing.normal
): TextStyle => ({
  fontSize: size,
  fontWeight: weight,
  lineHeight: size * lineHeight,
  letterSpacing: spacing,
});

// Typography styles
export const typography: TypographyStyles = {
  h1: createTextStyle(fontSizes.xxxl, fontWeights.bold, lineHeights.tight),
  h2: createTextStyle(fontSizes.xxl, fontWeights.bold, lineHeights.tight),
  h3: createTextStyle(fontSizes.xl, fontWeights.semiBold, lineHeights.tight),
  h4: createTextStyle(fontSizes.lg, fontWeights.semiBold, lineHeights.tight),
  h5: createTextStyle(fontSizes.md, fontWeights.medium, lineHeights.tight),
  body: createTextStyle(fontSizes.md, fontWeights.regular),
  bodySmall: createTextStyle(fontSizes.sm, fontWeights.regular),
  bodyLarge: createTextStyle(fontSizes.lg, fontWeights.regular),
  button: createTextStyle(fontSizes.md, fontWeights.medium, lineHeights.tight),
  caption: createTextStyle(fontSizes.sm, fontWeights.regular, lineHeights.normal, letterSpacing.wide),
  label: createTextStyle(fontSizes.sm, fontWeights.medium),
  overline: createTextStyle(fontSizes.xs, fontWeights.semiBold, lineHeights.normal, letterSpacing.extraWide),
};

// Helper functions for text transformations
export const textTransforms = {
  uppercase: { textTransform: 'uppercase' as const },
  lowercase: { textTransform: 'lowercase' as const },
  capitalize: { textTransform: 'capitalize' as const },
};

export default typography; 