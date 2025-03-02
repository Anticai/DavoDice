import * as errorService from '../services/error';

/**
 * Safely executes a function and handles any errors
 * @param operation Function to execute
 * @param errorType Type of error if it occurs
 * @param context Additional context about the operation
 * @returns Result of the operation or undefined if an error occurred
 */
export async function safeExecute<T>(
  operation: () => Promise<T>,
  errorType = errorService.ErrorType.UNKNOWN,
  context: Record<string, any> = {}
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    errorService.handleError(error as Error, {
      type: errorType,
      context,
    });
    return undefined;
  }
}

/**
 * Synchronous version of safeExecute
 */
export function safeExecuteSync<T>(
  operation: () => T,
  errorType = errorService.ErrorType.UNKNOWN,
  context: Record<string, any> = {}
): T | undefined {
  try {
    return operation();
  } catch (error) {
    errorService.handleError(error as Error, {
      type: errorType,
      context,
    });
    return undefined;
  }
}

/**
 * Safely parses JSON and handles any errors
 */
export function safeParseJSON<T>(
  json: string,
  defaultValue: T
): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    errorService.handleError(error as Error, {
      type: errorService.ErrorType.STORAGE,
      message: 'Failed to parse JSON',
      context: { json: json.substring(0, 100) + (json.length > 100 ? '...' : '') },
    });
    return defaultValue;
  }
}

/**
 * Creates a wrapped version of a component's event handler that catches errors
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  handler: T,
  errorType = errorService.ErrorType.UI,
  context: Record<string, any> = {}
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    try {
      return handler(...args);
    } catch (error) {
      errorService.handleError(error as Error, {
        type: errorType,
        context: {
          ...context,
          handlerName: handler.name,
          args: args.map(arg => 
            typeof arg === 'object' ? 'Object' : 
            typeof arg === 'function' ? 'Function' : 
            String(arg)
          ),
        },
      });
      return undefined;
    }
  };
}

export default {
  safeExecute,
  safeExecuteSync,
  safeParseJSON,
  withErrorHandling,
}; 