import React, { useCallback } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

const CustomMarker = React.memo(({ location, onPress }) => {
  const handlePress = useCallback(() => onPress(location), [location, onPress]);

  return (
    <Marker
      coordinate={{ latitude: location.latitude, longitude: location.longitude }}
      onPress={handlePress}
      tracksViewChanges={false}
    >
      <View style={styles.container}>
        <View style={[styles.body, { backgroundColor: location.color }]}>
          <View style={styles.dot} />
        </View>
        <View style={[styles.arrow, { borderBottomColor: location.color }]} />
      </View>
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.title}>{location.name}</Text>
          <Text style={styles.text}>Lat: {location.latitude.toFixed(4)}</Text>
          <Text style={styles.text}>Lon: {location.longitude.toFixed(4)}</Text>
        </View>
      </Callout>
    </Marker>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', width: 50, height: 50 },
  body: { width: 30, height: 30, borderRadius: 15, borderWidth: 3, borderColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' },
  arrow: { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 16, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -5 },
  callout: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'white', borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  text: { fontSize: 12, color: '#666' },
});

export default CustomMarker;
