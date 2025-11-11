import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@favorite_locations';

export const loadLocations = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const saveLocations = async (locations) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
};
