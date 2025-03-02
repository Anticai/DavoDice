import { useCallback } from 'react';
import { feedbackService, SoundType } from '../services/feedbackService';

/**
 * Hook to access sound and haptic feedback functionality
 */
export const useFeedback = () => {
  /**
   * Play a sound effect if enabled in settings
   */
  const playSound = useCallback(async (sound: SoundType) => {
    await feedbackService.playSound(sound);
  }, []);

  /**
   * Trigger haptic feedback if enabled in settings
   */
  const triggerHaptic = useCallback(
    (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
      return feedbackService.triggerHaptic(intensity);
    },
    []
  );

  /**
   * Trigger both sound and haptic feedback
   */
  const provideFeedback = useCallback(
    async (sound: SoundType, hapticIntensity: 'light' | 'medium' | 'heavy' = 'medium') => {
      await Promise.all([
        feedbackService.playSound(sound),
        feedbackService.triggerHaptic(hapticIntensity),
      ]);
    },
    []
  );

  return {
    playSound,
    triggerHaptic,
    provideFeedback,
  };
}; 