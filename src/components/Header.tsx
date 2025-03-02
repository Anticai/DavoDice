import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { H1 } from './Text';
import { useTheme } from '../context/ThemeContext';
import { useFeedback } from '../hooks/useFeedback';

// Icon imports - using a placeholder for now
// In a real app, we would import icons from a library like react-native-vector-icons
const ICON_SIZE = 24;
const BackIcon = () => <View style={{ width: ICON_SIZE, height: ICON_SIZE, borderBottomWidth: 2, borderLeftWidth: 2, transform: [{ rotate: '45deg' }] }} />;

interface HeaderProps {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  style?: StyleProp<ViewStyle>;
  showBack?: boolean;
}

/**
 * Header component for screens
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  onBackPress,
  style,
  showBack = true,
}) => {
  const { colors } = useTheme();
  const { provideFeedback } = useFeedback();
  
  // Handle back button press with feedback
  const handleBackPress = () => {
    provideFeedback('tap');
    if (onBackPress) onBackPress();
  };
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.background.main, borderBottomColor: colors.ui.border },
      style
    ]}>
      <View style={styles.leftContainer}>
        {showBack && onBackPress ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityLabel="Back"
          >
            <BackIcon />
          </TouchableOpacity>
        ) : leftComponent}
      </View>
      
      <View style={styles.titleContainer}>
        <H1 style={{ color: colors.text.primary }}>{title}</H1>
      </View>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 3,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
});

export default Header; 