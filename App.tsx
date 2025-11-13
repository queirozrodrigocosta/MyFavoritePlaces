import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/screens/MapScreen';
import AddLocationScreen from './src/screens/AddLocationScreen';
import EditLocationScreen from './src/screens/EditLocationScreen';
import LocationListScreen from './src/screens/LocationListScreen';

export type RootStackParamList = {
  Map: undefined;
  AddLocation: undefined;
  EditLocation: { location: LocationData };
  LocationList: undefined;
};

export interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen 
          name="Map" 
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddLocation" 
          component={AddLocationScreen}
          options={{ title: 'Adicionar Local' }}
        />
        <Stack.Screen 
          name="EditLocation" 
          component={EditLocationScreen}
          options={{ title: 'Editar Local' }}
        />
        <Stack.Screen 
          name="LocationList" 
          component={LocationListScreen}
          options={{ title: 'Meus Locais' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
