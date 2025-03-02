import { UserSettings } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../constants';
import storageService from './storage';

/**
 * Service for managing user settings
 */
class SettingsService {
  private settings: UserSettings = DEFAULT_SETTINGS;
  private storageService = storageService;
  private listeners: Array<(settings: UserSettings) => void> = [];

  /**
   * Initialize the settings service
   */
  async init(): Promise<UserSettings> {
    try {
      const savedSettings = await this.storageService.loadSettings();
      if (savedSettings) {
        // Merge saved settings with defaults in case new settings were added
        this.settings = { ...DEFAULT_SETTINGS, ...savedSettings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return this.settings;
  }

  /**
   * Get the current settings
   */
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  /**
   * Update user settings
   */
  async updateSettings(newSettings: Partial<UserSettings>): Promise<UserSettings> {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
    this.notifyListeners();
    return this.settings;
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(): Promise<UserSettings> {
    this.settings = { ...DEFAULT_SETTINGS };
    await this.saveSettings();
    this.notifyListeners();
    return this.settings;
  }

  /**
   * Save settings to storage
   */
  private async saveSettings(): Promise<void> {
    try {
      await this.storageService.saveSettings(this.settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(listener: (settings: UserSettings) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of settings changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getSettings()));
  }
}

// Create singleton instance
export const settingsService = new SettingsService(); 