import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, LocationData } from '../../App';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

type EditLocationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditLocation'>;
type EditLocationRouteProp = RouteProp<RootStackParamList, 'EditLocation'>;

interface Props {
  navigation: EditLocationNavigationProp;
  route: EditLocationRouteProp;
}

export default function EditLocationScreen({ route, navigation }: Props) {
  const { location } = route.params;
  const [name, setName] = useState(location.name);
  const [latitude, setLatitude] = useState(location.latitude.toString());
  const [longitude, setLongitude] = useState(location.longitude.toString());
  const [selectedColor, setSelectedColor] = useState(location.color);

  const handleUpdate = async () => {
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

      const index = locations.findIndex((loc) => loc.id === location.id);
      if (index !== -1) {
        locations[index] = {
          ...location,
          name: name.trim(),
          latitude: lat,
          longitude: lng,
          color: selectedColor,
        };
        await AsyncStorage.setItem('locations', JSON.stringify(locations));
        Alert.alert('Sucesso', 'Local atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Map') }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o local');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir "${location.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem('locations');
              const locations: LocationData[] = stored ? JSON.parse(stored) : [];
              const filtered = locations.filter((loc) => loc.id !== location.id);
              await AsyncStorage.setItem('locations', JSON.stringify(filtered));
              Alert.alert('Sucesso', 'Local excluído com sucesso!', [
                { text: 'OK', onPress: () => navigation.navigate('Map') }
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o local');
              console.error(error);
            }
          },
        },
      ]
    );
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
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Longitude:</Text>
        <TextInput
          style={styles.input}
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
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

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Atualizar Local</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Excluir Local</Text>
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
  updateButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
