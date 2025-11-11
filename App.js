import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { LocationProvider } from './src/context/LocationContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </LocationProvider>
    </SafeAreaProvider>
  );
}