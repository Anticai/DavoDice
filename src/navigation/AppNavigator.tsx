import React, { useRef, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { 
  CalculatorScreen, 
  SettingsScreen, 
  StatsScreen, 
  NumberSelectionScreen, 
  DiceRollScreen,
  AnimationDemoScreen
} from '../screens';
import { setupAndroidBackHandler } from '../utils/platform';

// Define app screens and their params
export type RootStackParamList = {
  Calculator: undefined;
  Settings: undefined;
  Stats: undefined;
  NumberSelection: undefined;
  DiceRoll: undefined;
  AnimationDemo: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Main app navigation stack
 */
export const AppNavigator: React.FC = () => {
  // Create a ref for the navigation container
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Setup Android back button handler
  useEffect(() => {
    if (navigationRef.current) {
      const cleanup = setupAndroidBackHandler(navigationRef.current);
      return cleanup;
    }
  }, [navigationRef.current]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Calculator"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
        <Stack.Screen name="NumberSelection" component={NumberSelectionScreen} />
        <Stack.Screen name="DiceRoll" component={DiceRollScreen} />
        <Stack.Screen name="AnimationDemo" component={AnimationDemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 