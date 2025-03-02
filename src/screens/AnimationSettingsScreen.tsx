import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import NavigationTransition from '../components/NavigationTransition';

// Define additional settings properties for animations
interface AnimationSettings {
  animationsEnabled?: boolean;
  reduceMotion?: boolean;
  followSystemReduceMotion?: boolean;
  animationDurationScale?: number;
}

/**
 * Screen for configuring animation settings and accessibility preferences
 */
const AnimationSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { settings, updateSetting } = useSettings();
  
  // Local state for animation settings
  const [animationsEnabled, setAnimationsEnabled] = useState(
    settings?.animationsEnabled !== false
  );
  const [reduceMotion, setReduceMotion] = useState(false);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const [followSystemSettings, setFollowSystemSettings] = useState(
    settings?.followSystemReduceMotion !== false
  );
  const [durationScale, setDurationScale] = useState(
    settings?.animationDurationScale || 1.0
  );
  
  // Check system accessibility settings
  useEffect(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      AccessibilityInfo.isReduceMotionEnabled().then(isEnabled => {
        setSystemReduceMotion(isEnabled);
        
        // If following system settings, update reduceMotion
        if (followSystemSettings) {
          setReduceMotion(isEnabled);
        }
      });
      
      // Subscribe to changes
      const listener = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        isEnabled => {
          setSystemReduceMotion(isEnabled);
          
          // If following system settings, update reduceMotion
          if (followSystemSettings) {
            setReduceMotion(isEnabled);
          }
        }
      );
      
      return () => {
        listener.remove();
      };
    }
  }, [followSystemSettings]);
  
  // Save settings when they change
  const saveSettings = () => {
    // Update each setting individually
    updateSetting('animationsEnabled', animationsEnabled);
    updateSetting('reduceMotion', followSystemSettings ? systemReduceMotion : reduceMotion);
    updateSetting('followSystemReduceMotion', followSystemSettings);
    updateSetting('animationDurationScale', durationScale);
  };
  
  // Toggle follow system settings
  const handleToggleFollowSystem = () => {
    const newValue = !followSystemSettings;
    setFollowSystemSettings(newValue);
    
    // If turning on follow system, update reduceMotion to match system
    if (newValue) {
      setReduceMotion(systemReduceMotion);
    }
  };
  
  // Change duration scale
  const handleChangeDurationScale = (scale: number) => {
    setDurationScale(scale);
  };
  
  // Get appropriate colors for borders and disabled elements
  const borderColor = colors.text.secondary + '33'; // Add transparency
  const disabledColor = colors.text.secondary + '66'; // Add transparency
  
  return (
    <NavigationTransition type="fade">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.main }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Animation Settings
        </Text>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              General
            </Text>
            
            <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                  Enable Animations
                </Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Turn off for a static interface with no animations
                </Text>
              </View>
              <Switch
                value={animationsEnabled}
                onValueChange={setAnimationsEnabled}
                trackColor={{ false: disabledColor, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : colors.background.card}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Accessibility
            </Text>
            
            <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                  Follow System Settings
                </Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Use your device's "Reduce Motion" setting
                  {systemReduceMotion ? " (Currently ON)" : " (Currently OFF)"}
                </Text>
              </View>
              <Switch
                value={followSystemSettings}
                onValueChange={handleToggleFollowSystem}
                trackColor={{ false: disabledColor, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : colors.background.card}
              />
            </View>
            
            {!followSystemSettings && (
              <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                    Reduce Motion
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                    Simplify animations for reduced motion sensitivity
                  </Text>
                </View>
                <Switch
                  value={reduceMotion}
                  onValueChange={setReduceMotion}
                  trackColor={{ false: disabledColor, true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? undefined : colors.background.card}
                  disabled={followSystemSettings}
                />
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Advanced
            </Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                  Animation Speed
                </Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Adjust how fast animations play
                </Text>
              </View>
            </View>
            
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={[
                  styles.speedButton,
                  durationScale === 0.5 && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleChangeDurationScale(0.5)}
              >
                <Text style={styles.speedButtonText}>Fast</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.speedButton,
                  durationScale === 1.0 && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleChangeDurationScale(1.0)}
              >
                <Text style={styles.speedButtonText}>Normal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.speedButton,
                  durationScale === 1.5 && { backgroundColor: colors.primary }
                ]}
                onPress={() => handleChangeDurationScale(1.5)}
              >
                <Text style={styles.speedButtonText}>Slow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={saveSettings}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </NavigationTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  speedButton: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    padding: 12,
    margin: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  speedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AnimationSettingsScreen; 