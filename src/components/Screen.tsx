import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  safeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
}

/**
 * Base screen component that handles safe area and common styling
 */
export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  safeArea = true,
  statusBarStyle,
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // Determine status bar style based on theme if not explicitly provided
  const statusBar = statusBarStyle || (isDarkMode ? 'light-content' : 'dark-content');
  
  const Container = safeArea ? SafeAreaView : View;
  
  return (
    <Container style={[
      styles.container,
      { backgroundColor: colors.background.main },
      style
    ]}>
      <StatusBar
        barStyle={statusBar}
        backgroundColor={colors.background.main}
        translucent={false}
      />
      <View style={styles.content}>
        {children}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Screen; 