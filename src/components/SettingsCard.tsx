import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { H2 } from './Text';
import { useTheme } from '../context/ThemeContext';

interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card component for settings sections
 */
export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  children,
  style,
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.background.card, borderColor: colors.ui.border },
      style
    ]}>
      <View style={styles.titleContainer}>
        <H2 style={{ color: colors.text.primary }}>{title}</H2>
      </View>
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
});

export default SettingsCard; 