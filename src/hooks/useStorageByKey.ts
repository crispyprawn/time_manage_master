import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
export function useStorageByKey<T>(storageKey: string) {
  const [storage, setStorage] = useState<T>();
  const setData = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(storageKey, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      return null;
    }
  };

  useEffect(() => {
    getData(storageKey).then(res => {
      setStorage(res);
    });
  }, [storageKey]);

  useEffect(() => {
    setData(storage);
  });

  return {storage, setStorage};
}
