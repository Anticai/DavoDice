import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { typography } from '../styles/typography';
import { useTheme } from '../hooks/useTheme';

export type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5'
  | 'body' 
  | 'bodySmall' 
  | 'bodyLarge' 
  | 'button' 
  | 'caption'
  | 'label'
  | 'overline';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

/**
 * Text component with typography variants
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}) => {
  const textStyle: StyleProp<TextStyle> = [
    typography[variant],
    align && { textAlign: align },
    color && { color },
    style,
  ];

  return (
    <RNText style={textStyle} {...rest}>
      {children}
    </RNText>
  );
};

/**
 * Heading level 1
 */
export const H1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

/**
 * Heading level 2
 */
export const H2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

/**
 * Heading level 3
 */
export const H3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

/**
 * Heading level 4
 */
export const H4: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h4" {...props} />
);

/**
 * Body text (primary)
 */
export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

/**
 * Caption text (smaller)
 */
export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

/**
 * Error text
 */
export const ErrorText: React.FC<Omit<TextProps, 'variant'>> = (props) => {
  const { colors } = useTheme();
  return (
    <Text 
      variant="bodySmall" 
      color={colors.status.error} 
      {...props} 
    />
  );
};

/**
 * Success text
 */
export const SuccessText: React.FC<Omit<TextProps, 'variant'>> = (props) => {
  const { colors } = useTheme();
  return (
    <Text 
      variant="bodySmall" 
      color={colors.status.success} 
      {...props} 
    />
  );
}; 