import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { settingsService } from './settingsService';
import { SOUND } from '../constants';

// Type for different sounds in the app
export type SoundType = 'success' | 'failure' | 'error' | 'roll' | 'tap' | 'swallow';

/**
 * Service to handle sound effects and haptic feedback
 */
class FeedbackService {
  private sounds: Record<string, Audio.Sound> = {};
  private isInitialized = false;

  /**
   * Initialize the feedback service
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load sound files
      await this.loadSounds();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize feedback service:', error);
    }
  }

  /**
   * Load sound files
   */
  private async loadSounds(): Promise<void> {
    try {
      // Load each sound file
      const { sound: rollSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/dice_roll.mp3')
      );
      const { sound: successSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/success.mp3')
      );
      const { sound: failureSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/failure.mp3')
      );
      const { sound: tapSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/tap.mp3')
      );
      const { sound: swallowSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/swallow.mp3')
      );

      // Store loaded sounds
      this.sounds = {
        roll: rollSound,
        success: successSound,
        failure: failureSound,
        error: failureSound, // Alias for failure
        tap: tapSound,
        swallow: swallowSound,
      };
    } catch (error) {
      console.error('Failed to load sounds:', error);
    }
  }

  /**
   * Play a sound effect
   */
  async playSound(soundType: SoundType): Promise<void> {
    try {
      const settings = settingsService.getSettings();
      
      // Only play sound if enabled in settings
      if (!settings.soundEnabled) return;
      
      const sound = this.sounds[soundType];
      if (!sound) return;

      // Stop any existing playback and reset position
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      
      // Play the sound
      await sound.playAsync();
    } catch (error) {
      console.error(`Failed to play ${soundType} sound:`, error);
    }
  }

  /**
   * Trigger haptic feedback
   */
  triggerHaptic(
    intensity: 'light' | 'medium' | 'heavy' = 'medium'
  ): Promise<void> {
    const settings = settingsService.getSettings();
    
    // Only trigger haptic if enabled in settings and on a device that supports it
    if (!settings.hapticFeedbackEnabled || Platform.OS === 'web') {
      return Promise.resolve();
    }

    try {
      switch (intensity) {
        case 'light':
          return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        case 'medium':
          return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        case 'heavy':
          return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        default:
          return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
      return Promise.resolve();
    }
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    try {
      // Unload all sounds to free up resources
      await Promise.all(
        Object.values(this.sounds).map((sound) => sound.unloadAsync())
      );
      this.sounds = {};
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup feedback service:', error);
    }
  }
}

// Create singleton instance
export const feedbackService = new FeedbackService(); 