import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, LocationData } from '../../App';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

type AddLocationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddLocation'>;

interface Props {
  navigation: AddLocationNavigationProp;
}

export default function AddLocationScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedColor, setSelectedColor] = useState('red');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude.toFixed(6));
        setLongitude(location.coords.longitude.toFixed(6));
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do local');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Erro', 'Coordenadas inválidas');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Erro', 'Coordenadas fora dos limites válidos');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem('locations');
      const locations: LocationData[] = stored ? JSON.parse(stored) : [];

      const newLocation: LocationData = {
        id: Date.now().toString(),
        name: name.trim(),
        latitude: lat,
        longitude: lng,
        color: selectedColor,
      };

      locations.push(newLocation);
      await AsyncStorage.setItem('locations', JSON.stringify(locations));

      Alert.alert('Sucesso', 'Local adicionado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o local');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Local:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Minha casa"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Latitude:</Text>
        <TextInput
          style={styles.input}
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
          placeholder="Ex: -23.550520"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Longitude:</Text>
        <TextInput
          style={styles.input}
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
          placeholder="Ex: -46.633308"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Cor do Marcador:</Text>
        <View style={styles.colorContainer}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Local</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 3,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
