import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocations } from '../context/LocationContext';
import * as Location from 'expo-location';

const AddLocationScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState(route.params?.currentLocation?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(route.params?.currentLocation?.longitude?.toString() || '');
  const [color, setColor] = useState('#FF6B6B');
  const { addLocation } = useLocations();

  const handleGetLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização');
    }
  };

  const handleSave = async () => {
    if (!name || !latitude || !longitude) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    await addLocation({ name, latitude: parseFloat(latitude), longitude: parseFloat(longitude), color });
    Alert.alert('Sucesso', 'Adicionado!');
    navigation.goBack();
  };

  return (
    <ScrollView><View style={styles.container}>
      <Text style={styles.title}>Adicionar Localização</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} placeholder="Digite o nome" value={name} onChangeText={setName} />
      <Text style={styles.label}>Latitude</Text>
      <TextInput style={styles.input} placeholder="Latitude" value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" />
      <Text style={styles.label}>Longitude</Text>
      <TextInput style={styles.input} placeholder="Longitude" value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" />
      <TouchableOpacity style={styles.button} onPress={handleGetLocation}><Text style={styles.btnText}>Usar Localização Atual</Text></TouchableOpacity>
      <Text style={styles.label}>Cor</Text>
      <TextInput style={styles.input} placeholder="#FF6B6B" value={color} onChangeText={setColor} />
      <TouchableOpacity style={[styles.button, {backgroundColor: '#4CAF50'}]} onPress={handleSave}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
    </View></ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 12 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default AddLocationScreen;
