import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, LocationData } from '../../App';

type LocationListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocationList'>;

interface Props {
  navigation: LocationListNavigationProp;
}

export default function LocationListScreen({ navigation }: Props) {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useEffect(() => {
    loadLocations();

    // Listener para recarregar quando a tela recebe foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadLocations();
    });

    return unsubscribe;
  }, [navigation]);

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

  const handleItemPress = (location: LocationData) => {
    navigation.navigate('EditLocation', { location });
  };

  const renderItem = ({ item }: { item: LocationData }) => (
    <TouchableOpacity
      style={[
        styles.item,
        isTablet && styles.itemTablet,
      ]}
      onPress={() => handleItemPress(item)}
    >
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCoords}>
          Lat: {item.latitude.toFixed(6)}, Lng: {item.longitude.toFixed(6)}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {locations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum local cadastrado</Text>
          <Text style={styles.emptySubtext}>
            Toque no botão + no mapa para adicionar um local
          </Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={isTablet ? 2 : 1}
          key={isTablet ? 'tablet' : 'phone'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemTablet: {
    flex: 0.48,
    marginHorizontal: '1%',
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemCoords: {
    fontSize: 12,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
