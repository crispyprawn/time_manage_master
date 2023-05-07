import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Progress} from '../types/progress';
export const useUserDataStore = create<{
  bears: Progress[];
  getData: () => Promise<any>;
  setData: (value: any) => Promise<any>;
  subscribe: (progressID: string, eventID: string) => Promise<any>;
  unsubscribe: (progressID: string, eventID: string) => Promise<any>;
}>()((set, get) => ({
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
  subscribe: async (progressID: string, eventID: string) => {
    try {
      const value = get().bears.map(progress => {
        if (progress.progressID !== progressID) {
          return progress;
        } else {
          return {
            ...progress,
            events: progress.events.map(event =>
              event.eventID !== eventID
                ? event
                : {
                    ...event,
                    calendarSubscribed: true,
                  },
            ),
          };
        }
      });

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
  unsubscribe: async (progressID: string, eventID: string) => {
    try {
      const value = get().bears.map(progress => {
        if (progress.progressID !== progressID) {
          return progress;
        } else {
          return {
            ...progress,
            events: progress.events.map(event =>
              event.eventID !== eventID
                ? event
                : {
                    ...event,
                    calendarSubscribed: false,
                  },
            ),
          };
        }
      });

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
