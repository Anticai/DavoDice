/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Root from './src/Root';
import ErrorBoundary from './src/components/ErrorBoundary';

/**
 * Main application component
 * Wraps the application with error handling and providers
 */
function App() {
  return (
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  );
}

export default App;
