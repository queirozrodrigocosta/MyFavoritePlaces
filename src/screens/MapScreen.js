import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocations } from '../context/LocationContext';
import CustomMarker from '../components/CustomMarker';
import FloatingActionButton from '../components/FloatingActionButton';
import AppHeader from '../components/AppHeader';

const MapScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const { locations } = useLocations();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude, longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Meus Favoritos" onListPress={() => navigation.navigate('LocationList')} />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -23.5505,
          longitude: -46.6333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      >
        {locations.map((location) => (
          <CustomMarker
            key={location.id}
            location={location}
            onPress={() => navigation.navigate('LocationDetails', { location })}
          />
        ))}
      </MapView>
      <FloatingActionButton onPress={() => navigation.navigate('AddLocation', { currentLocation: userLocation })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
});

export default MapScreen;
