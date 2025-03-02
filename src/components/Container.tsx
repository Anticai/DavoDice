import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  useSafeArea?: boolean;
  center?: boolean;
  padding?: 'none' | 'small' | 'normal' | 'large';
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

/**
 * Container component for consistent screen structure
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  useSafeArea = true,
  center = false,
  padding = 'normal',
  style,
  backgroundColor,
  ...rest
}) => {
  const { colors, theme } = useTheme();
  const bgColor = backgroundColor || colors.background.main;
  
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    { backgroundColor: bgColor },
    center && styles.center,
    padding === 'small' && { padding: theme.spacing.sm },
    padding === 'normal' && { padding: theme.spacing.md },
    padding === 'large' && { padding: theme.spacing.lg },
    style,
  ];

  const Wrapper = useSafeArea ? SafeAreaView : View;

  return (
    <Wrapper style={containerStyle} {...rest}>
      <StatusBar
        backgroundColor={bgColor}
        barStyle={bgColor === colors.background.main ? 'dark-content' : 'light-content'}
      />
      {children}
    </Wrapper>
  );
};

/**
 * Card container with elevated appearance
 */
export const Card: React.FC<Omit<ContainerProps, 'useSafeArea'>> = ({
  children,
  style,
  backgroundColor,
  ...rest
}) => {
  const { colors, theme } = useTheme();
  const bgColor = backgroundColor || colors.background.card;
  
  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    { 
      backgroundColor: bgColor,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      ...theme.shadows.medium,
    },
    style,
  ];

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
};

/**
 * Row container for horizontal layout
 */
export const Row: React.FC<Omit<ContainerProps, 'useSafeArea'>> = ({
  children,
  style,
  ...rest
}) => {
  const rowStyle: StyleProp<ViewStyle> = [
    styles.row,
    style,
  ];

  return (
    <View style={rowStyle} {...rest}>
      {children}
    </View>
  );
};

/**
 * Column container for vertical layout
 */
export const Column: React.FC<Omit<ContainerProps, 'useSafeArea'>> = ({
  children,
  style,
  ...rest
}) => {
  const columnStyle: StyleProp<ViewStyle> = [
    styles.column,
    style,
  ];

  return (
    <View style={columnStyle} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  card: {
    overflow: 'hidden',
  },
}); 