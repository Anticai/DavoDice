import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Body } from './Text';
import { useFeedback } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import { theme } from '../styles';

/**
 * Props for the SettingToggle component
 */
export interface SettingToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
}

/**
 * A toggle component for boolean settings
 */
export const SettingToggle: React.FC<SettingToggleProps> = ({
  label,
  value,
  onChange,
  description,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const { provideFeedback } = useFeedback();

  const handleToggle = () => {
    if (disabled) return;
    
    provideFeedback('tap');
    onChange(!value);
  };

  return (
    <View style={[
      styles.container,
      { borderBottomColor: colors.ui.border }
    ]}>
      <View style={styles.labelContainer}>
        <Body style={[
          styles.label,
          disabled && { color: colors.text.secondary }
        ]}>
          {label}
        </Body>
        {description && (
          <Body style={[
            styles.description,
            { color: colors.text.secondary },
            disabled && { opacity: 0.5 }
          ]}>
            {description}
          </Body>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          { backgroundColor: colors.ui.border },
          value && { backgroundColor: colors.primary },
          disabled && { opacity: 0.5 }
        ]}
        onPress={handleToggle}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <Body color={value ? '#FFFFFF' : undefined}>
          {value ? 'ON' : 'OFF'}
        </Body>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Props for the SettingOption component
 */
interface SettingOptionProps<T> {
  label: string;
  value: T;
  options: Array<{label: string; value: T}>;
  onChange: (value: T) => void;
  description?: string;
  disabled?: boolean;
}

/**
 * A component for selecting between multiple options in settings
 */
export function SettingOption<T>({
  label,
  value,
  options,
  onChange,
  description,
  disabled = false,
}: SettingOptionProps<T>) {
  const { colors } = useTheme();
  const { provideFeedback } = useFeedback();

  const handleOptionSelect = (optionValue: T) => {
    if (disabled) return;
    
    provideFeedback('tap');
    onChange(optionValue);
  };

  return (
    <View style={[
      styles.container,
      { borderBottomColor: colors.ui.border }
    ]}>
      <View style={styles.labelContainer}>
        <Body style={[
          styles.label,
          disabled && { color: colors.text.secondary }
        ]}>
          {label}
        </Body>
        {description && (
          <Body style={[
            styles.description,
            { color: colors.text.secondary },
            disabled && { opacity: 0.5 }
          ]}>
            {description}
          </Body>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              { backgroundColor: colors.ui.border },
              value === option.value && { backgroundColor: colors.primary },
              index > 0 && styles.optionButtonNotFirst,
              disabled && { opacity: 0.5 }
            ]}
            onPress={() => handleOptionSelect(option.value)}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
          >
            <Body
              color={value === option.value ? '#FFFFFF' : undefined}
              style={styles.optionLabel}
            >
              {option.label}
            </Body>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

/**
 * Props for the SettingGroup component
 */
interface SettingGroupProps {
  title: string;
  children: React.ReactNode;
}

/**
 * A component for grouping related settings
 */
export const SettingGroup: React.FC<SettingGroupProps> = ({
  title,
  children,
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.groupContainer}>
      <Body style={[
        styles.groupTitle,
        { color: colors.text.secondary }
      ]}>
        {title}
      </Body>
      <View style={[
        styles.groupContent,
        { backgroundColor: colors.background.card, ...theme.shadows.sm }
      ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  labelContainer: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    marginTop: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 66,
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  optionButtonNotFirst: {
    marginLeft: 8,
  },
  optionLabel: {
    fontSize: 14,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  groupContent: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default SettingToggle; 