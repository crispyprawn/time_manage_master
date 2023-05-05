import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Progress} from '../types/progress';
export const useUserDataStore = create<{
  bears: Progress[];
  getData: () => Promise<any>;
  setData: (value: any) => Promise<any>;
}>()(set => ({
  bears: [],
  getData: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      const jsonParsed = jsonValue != null ? JSON.parse(jsonValue) : null;
      set({
        bears: jsonParsed,
      });
      return jsonParsed;
    } catch (e) {
      // error reading value
      return null;
    }
  },
  setData: async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('userData', jsonValue);
      set({
        bears: value,
      });
      return value;
    } catch (e) {
      // saving error
    }
  },
}));
