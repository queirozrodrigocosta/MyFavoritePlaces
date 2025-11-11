import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadLocations, saveLocations } from '../utils/locationStorage';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationsFromStorage();
  }, []);

  const loadLocationsFromStorage = async () => {
    try {
      setLoading(true);
      const data = await loadLocations();
      setLocations(data || []);
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async (location) => {
    const id = Date.now().toString();
    const newLocation = { ...location, id };
    const updated = [...locations, newLocation];
    setLocations(updated);
    await saveLocations(updated);
    return newLocation;
  };

  const updateLocation = async (id, data) => {
    const updated = locations.map(loc => loc.id === id ? { ...loc, ...data } : loc);
    setLocations(updated);
    await saveLocations(updated);
  };

  const removeLocation = async (id) => {
    const updated = locations.filter(loc => loc.id !== id);
    setLocations(updated);
    await saveLocations(updated);
  };

  return (
    <LocationContext.Provider value={{ locations, loading, addLocation, updateLocation, removeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => useContext(LocationContext);
