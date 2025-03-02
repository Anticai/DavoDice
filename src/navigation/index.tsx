/**
 * Navigation exports
 */
export * from './AppNavigator';

// Export screens for navigation
export { default as AnimationExampleScreen } from '../screens/AnimationExampleScreen';

// ... existing code ...
// Add to navigator screens list
<Stack.Screen name="AnimationExample" component={AnimationExampleScreen} />
// ... existing code ... 