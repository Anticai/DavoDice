import { Platform } from 'react-native';

// Types of errors that can occur in the app
export enum ErrorType {
  NETWORK = 'network',
  STORAGE = 'storage', 
  CALCULATION = 'calculation',
  NAVIGATION = 'navigation',
  UI = 'ui',
  UNKNOWN = 'unknown'
}

// Structured error object for consistent error handling
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  context?: Record<string, any>;
  timestamp: number;
}

// Options for creating an error
interface CreateErrorOptions {
  type?: ErrorType;
  message?: string;
  originalError?: any;
  context?: Record<string, any>;
}

// Basic storage for errors in development
let errorHistory: AppError[] = [];

/**
 * Creates a standardized app error object
 */
export function createError(options: CreateErrorOptions = {}): AppError {
  const {
    type = ErrorType.UNKNOWN,
    message = 'An unknown error occurred',
    originalError,
    context,
  } = options;

  return {
    type,
    message,
    originalError,
    context,
    timestamp: Date.now(),
  };
}

/**
 * Handles an error by logging it and optionally reporting it
 */
export function handleError(error: Error | AppError | string, options: CreateErrorOptions = {}): AppError {
  // Convert to AppError if not already
  const appError = isAppError(error)
    ? error
    : createError({
        ...options,
        message: typeof error === 'string' ? error : options.message || error.message,
        originalError: typeof error !== 'string' ? error : undefined,
      });

  // Log error to console (in development)
  if (__DEV__) {
    console.error('Error:', appError.message);
    if (appError.originalError) {
      console.error('Original error:', appError.originalError);
    }
    if (appError.context) {
      console.error('Context:', appError.context);
    }
  }

  // Store in history (in development)
  if (__DEV__) {
    errorHistory = [...errorHistory, appError].slice(-20); // Keep last 20 errors
  }

  // In production, we might send to a monitoring service
  if (!__DEV__) {
    // Example: send to analytics or error monitoring
    // analyticsService.logError(appError);
  }

  return appError;
}

/**
 * Type guard to check if an object is an AppError
 */
function isAppError(error: any): error is AppError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'type' in error &&
    'message' in error &&
    'timestamp' in error
  );
}

/**
 * Gets the error history (development only)
 */
export function getErrorHistory(): AppError[] {
  return __DEV__ ? [...errorHistory] : [];
}

/**
 * Clears the error history (development only)
 */
export function clearErrorHistory(): void {
  if (__DEV__) {
    errorHistory = [];
  }
}

/**
 * Helper to get friendly message for different error types
 */
export function getFriendlyErrorMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection.';
    case ErrorType.STORAGE:
      return 'Unable to save or load your data. Please try again.';
    case ErrorType.CALCULATION:
      return 'There was a problem with the probability calculation. Please try again.';
    case ErrorType.NAVIGATION:
      return 'Unable to navigate to the selected screen. Please try again.';
    case ErrorType.UI:
      return 'There was a problem displaying the interface. Please restart the app.';
    default:
      return 'Something went wrong. Please try again or restart the app if the problem persists.';
  }
}

/**
 * Utility to check if an error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('network') ||
    error.message.includes('connection') ||
    error.message.includes('Network request failed')
  );
}

/**
 * Get device info for error reporting
 */
export function getDeviceInfo(): Record<string, any> {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isEmulator: Platform.OS === 'ios' ? false : false, // Would use actual detection in a real app
    apiLevel: Platform.OS === 'android' ? Platform.Version : undefined,
  };
}

export default {
  handleError,
  createError,
  getErrorHistory,
  clearErrorHistory,
  getFriendlyErrorMessage,
  isNetworkError,
  getDeviceInfo,
  ErrorType,
}; 