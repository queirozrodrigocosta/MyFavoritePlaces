import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MapScreen from '../screens/MapScreen';
import LocationListScreen from '../screens/LocationListScreen';
import LocationDetailsScreen from '../screens/LocationDetailsScreen';
import AddLocationScreen from '../screens/AddLocationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} options={{ title: 'Detalhes' }} />
    <Stack.Screen name="AddLocation" component={AddLocationScreen} options={{ title: 'Adicionar' }} />
  </Stack.Navigator>
);

const ListStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="List" component={LocationListScreen} options={{ title: 'Minhas Localizações' }} />
    <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} options={{ title: 'Detalhes' }} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsTablet(width >= 600);
    };

    updateLayout();
    const unsub = Dimensions.addEventListener('change', updateLayout);
    return () => unsub?.remove();
  }, []);

  if (isTablet) return <MapStack />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const name = route.name === 'MapTab' ? 'map' : 'list';
          return <Icon name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="MapTab" component={MapStack} options={{ title: 'Mapa', headerShown: false }} />
      <Tab.Screen name="ListTab" component={ListStack} options={{ title: 'Lista', headerShown: false }} />
    </Tab.Navigator>
  );
};

export default RootNavigator;
