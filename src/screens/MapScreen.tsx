import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, LocationData } from '../../App';
import styled from 'styled-components/native';

// Styled Components
const Container = styled.View`
  flex: 1;
`;

const MapContainer = styled.View`
  flex: 1;
`;

const HeaderBar = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #2196F3;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const HeaderTitle = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const HeaderButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const FABContainer = styled.View`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const FAB = styled.TouchableOpacity`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #2196F3;
  justify-content: center;
  align-items: center;
  elevation: 6;
  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.27;
  shadow-radius: 4.65px;
`;

const FABText = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Map'>;

interface Props {
  navigation: MapScreenNavigationProp;
}

export default function MapScreen({ navigation }: Props) {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
    loadLocations();

    // Listener para recarregar quando a tela recebe foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadLocations();
    });

    return unsubscribe;
  }, [navigation]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      } else {
        Alert.alert(
          'Permissão Negada',
          'É necessário permitir o acesso à localização para usar o aplicativo.'
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      Alert.alert('Erro', 'Não foi possível obter permissão de localização');
    }
  };

  const loadLocations = async () => {
    try {
      const stored = await AsyncStorage.getItem('locations');
      if (stored) {
        setLocations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    }
  };

  const handleMarkerPress = (location: LocationData) => {
    navigation.navigate('EditLocation', { location });
  };

  return (
    <Container>
      <HeaderBar>
        <HeaderTitle>Locais Favoritos</HeaderTitle>
        <HeaderButton onPress={() => navigation.navigate('LocationList')}>
          <HeaderButtonText>Lista</HeaderButtonText>
        </HeaderButton>
      </HeaderBar>

      <MapContainer style={{ marginTop: 60 }}>
        {hasPermission && currentLocation ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {locations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                pinColor={location.color}
                title={location.name}
                onPress={() => handleMarkerPress(location)}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <HeaderTitle>Carregando mapa...</HeaderTitle>
          </View>
        )}
      </MapContainer>

      <FABContainer>
        <FAB onPress={() => navigation.navigate('AddLocation')}>
          <FABText>+</FABText>
        </FAB>
      </FABContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
