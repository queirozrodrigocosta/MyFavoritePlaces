import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocations } from '../context/LocationContext';
import styled from 'styled-components/native';

const Container = styled.View`flex: 1; padding: 20px; background-color: #fff;`;
const Title = styled.Text`font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333;`;
const InputLabel = styled.Text`font-size: 14px; font-weight: 600; margin-top: 12px; color: #666;`;
const StyledInput = styled.TextInput`border-width: 1px; border-color: #ddd; border-radius: 8px; padding: 12px; margin-bottom: 12px;`;
const ButtonContainer = styled.View`flex-direction: row; justify-content: space-between; margin-top: 20px;`;
const Button = styled.TouchableOpacity`flex: 1; padding: 12px; border-radius: 8px; margin-horizontal: 5px; background-color: ${props => props.primary ? '#4CAF50' : '#f44336'};`;
const ButtonText = styled.Text`color: white; text-align: center; font-weight: bold;`;

const LocationDetailsScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { updateLocation, removeLocation } = useLocations();
  const [name, setName] = useState(location.name);
  const [color, setColor] = useState(location.color);

  const handleSave = async () => {
    await updateLocation(location.id, { name, color });
    Alert.alert('Sucesso', 'Atualizado!');
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => { await removeLocation(location.id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView><Container>
      <Title>Editar</Title>
      <InputLabel>Nome</InputLabel>
      <StyledInput value={name} onChangeText={setName} />
      <InputLabel>Latitude</InputLabel>
      <StyledInput value={location.latitude.toString()} editable={false} />
      <InputLabel>Longitude</InputLabel>
      <StyledInput value={location.longitude.toString()} editable={false} />
      <InputLabel>Cor</InputLabel>
      <StyledInput value={color} onChangeText={setColor} />
      <ButtonContainer>
        <Button primary onPress={handleSave}><ButtonText>Salvar</ButtonText></Button>
        <Button onPress={handleDelete}><ButtonText>Excluir</ButtonText></Button>
      </ButtonContainer>
    </Container></ScrollView>
  );
};

export default LocationDetailsScreen;
