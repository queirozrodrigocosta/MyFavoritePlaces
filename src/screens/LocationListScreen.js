import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useLocations } from '../context/LocationContext';
import LocationListItem from '../components/LocationListItem';

const LocationListScreen = ({ navigation }) => {
  const { locations } = useLocations();

  return (
    <View style={styles.container}>
      {locations.length === 0 ? (
        <View style={styles.empty}><Text>Nenhuma localização</Text></View>
      ) : (
        <FlatList
          data={locations}
          renderItem={({ item }) => (
            <LocationListItem location={item} onPress={() => navigation.navigate('LocationDetails', { location: item })} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default LocationListScreen;
