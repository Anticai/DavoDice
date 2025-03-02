import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSettings } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import { Body } from '../components/Text';
import { Button } from '../components/Button';
import { Screen, Header, SettingsCard } from '../components';
import { SettingToggle, SettingOption } from '../components/SettingToggle';
import { DisplayMode } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

// Define the type for our navigation prop
type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * Settings screen to configure app preferences
 */
const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors } = useTheme();
  const {
    settings,
    setSoundEnabled,
    setVibrationEnabled,
    setAnimationsEnabled, 
    setTheme,
    setDefaultRerollOnes,
    resetSettings
  } = useSettings();

  // Use non-null assertion for settings or provide defaults
  const theme = settings?.displayMode || 'system';
  const soundEnabled = settings?.soundEnabled ?? true;
  const vibrationEnabled = settings?.hapticFeedbackEnabled ?? true;
  const animationsEnabled = settings?.animationsEnabled ?? true;
  const defaultRerollOnes = settings?.defaultRerollOnes ?? false;

  // Handle reset confirmation
  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: resetSettings
        }
      ]
    );
  };

  // Theme options for display mode setting
  const themeOptions = [
    { label: 'Light', value: DisplayMode.Light },
    { label: 'Dark', value: DisplayMode.Dark },
    { label: 'System', value: DisplayMode.System },
  ];

  return (
    <Screen>
      <Header title="Settings" onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.container}>
        <SettingsCard title="Display">
          <SettingOption
            label="App Theme"
            value={theme}
            options={themeOptions}
            onChange={(value) => setTheme(value)}
            description="Choose the appearance of the app"
          />
          
          <SettingToggle
            label="Animations"
            value={animationsEnabled}
            onChange={setAnimationsEnabled}
            description="Enable interface animations"
          />
        </SettingsCard>
        
        <SettingsCard title="Feedback">
          <SettingToggle
            label="Sound Effects"
            value={soundEnabled}
            onChange={setSoundEnabled}
            description="Play sound effects for user actions"
          />

          <SettingToggle
            label="Vibration"
            value={vibrationEnabled}
            onChange={setVibrationEnabled}
            description="Enable haptic feedback for user actions"
          />
        </SettingsCard>

        <SettingsCard title="Gameplay">
          <SettingToggle
            label="Auto Reroll Ones"
            value={defaultRerollOnes}
            onChange={setDefaultRerollOnes}
            description="Automatically reroll dice that show 1"
          />
        </SettingsCard>

        <SettingsCard title="About">
          <Body style={styles.aboutText}>
            Blood Bowl Dice Calculator helps players calculate dice probabilities for various rolls in the game.
          </Body>
          <Body style={styles.version}>Version: 1.0.0</Body>
          
          <Button
            title="Animation Demo"
            onPress={() => navigation.navigate('AnimationDemo')}
            style={styles.demoButton}
            variant="primary"
          />
          
          <Button
            title="Reset All Settings"
            onPress={handleResetSettings}
            style={styles.resetButton}
            variant="secondary"
          />
        </SettingsCard>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  aboutText: {
    marginBottom: 8,
  },
  version: {
    opacity: 0.7,
    marginBottom: 24,
  },
  demoButton: {
    marginBottom: 12,
  },
  resetButton: {
    marginTop: 8,
  },
});

export default SettingsScreen; 