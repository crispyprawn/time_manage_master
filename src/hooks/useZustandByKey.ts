import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function useZustandByKey<T>(storageKey: string) {
  const useBearStore = create<{
    bears: T | undefined;
    getData: () => Promise<any>;
    setData: (value: any) => Promise<any>;
  }>()(set => ({
    bears: undefined,
    getData: async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(storageKey);
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
        await AsyncStorage.setItem(storageKey, jsonValue);
        set({
          bears: value,
        });
        return value;
      } catch (e) {
        // saving error
      }
    },
  }));

  return useBearStore;
}
