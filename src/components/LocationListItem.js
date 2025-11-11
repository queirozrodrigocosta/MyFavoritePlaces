import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LocationListItem = ({ location, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: location.color }]} />
      <View style={styles.content}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.coords}>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, marginVertical: 6, marginHorizontal: 10, borderRadius: 8, elevation: 2 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  content: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  coords: { fontSize: 12, color: '#999' },
});

export default LocationListItem;
