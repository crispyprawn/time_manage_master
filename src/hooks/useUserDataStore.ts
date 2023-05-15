import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCalendarEvents from 'react-native-calendar-events';
import {Progress} from '../types/progress';
import {Toast} from '@ant-design/react-native';
import dayjs from 'dayjs';
import {EventNameMap} from '../constants/progress';
export const useUserDataStore = create<{
  bears: Progress[];
  getData: () => Promise<any>;
  setData: (value: Progress[]) => Promise<any>;
  subscribe: (progressID: string, eventID: string) => Promise<any>;
  unsubscribe: (progressID: string, eventID: string) => Promise<any>;
  setEventSubscribed: (
    progressID: string,
    eventID: string,
    subscribed: boolean,
    calendarEventID: string,
  ) => Promise<any>;
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
  setData: async (value: Progress[]) => {
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
    const calendarPermission = await RNCalendarEvents.checkPermissions();
    if (calendarPermission !== 'authorized') {
      const calendarPermissionRequest =
        await RNCalendarEvents.requestPermissions();
      if (calendarPermissionRequest !== 'authorized') {
        Toast.info({
          content: '请先开启日历读写权限',
        });
        return;
      }
    }
    const progressSelected = get().bears.find(
      progress => progress.progressID === progressID,
    );
    const eventSelected = progressSelected?.events.find(
      event => event.eventID === eventID,
    );
    if (progressSelected && eventSelected) {
      try {
        const savedEventID = await RNCalendarEvents.saveEvent(
          `${progressSelected.companyName}-${
            EventNameMap[eventSelected.progressStage]
          }`,
          {
            alarms: [{date: 0}],
            endDate: dayjs(eventSelected.endTime).toISOString(),
            startDate: dayjs(eventSelected.startTime).toISOString(),
          },
        );
        if (savedEventID?.length > 0) {
          await get().setEventSubscribed(
            progressID,
            eventID,
            true,
            savedEventID,
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  unsubscribe: async (progressID: string, eventID: string) => {
    const calendarPermission = await RNCalendarEvents.checkPermissions();
    if (calendarPermission !== 'authorized') {
      const calendarPermissionRequest =
        await RNCalendarEvents.requestPermissions();
      if (calendarPermissionRequest !== 'authorized') {
        Toast.info({
          content: '请先开启日历读写权限',
        });
        return;
      }
    }
    const progressSelected = get().bears.find(
      progress => progress.progressID === progressID,
    );
    const eventSelected = progressSelected?.events.find(
      event => event.eventID === eventID,
    );
    if (progressSelected && eventSelected?.calendarEventID) {
      try {
        const checkEventStillExist = await RNCalendarEvents.findEventById(
          eventSelected.calendarEventID,
        );
        if (checkEventStillExist !== null) {
          const removeSucceeded = await RNCalendarEvents.removeEvent(
            eventSelected.calendarEventID,
          );
          if (removeSucceeded) {
            Toast.info('已经从系统日历中移除该事件');
          }
        } else {
          Toast.info('您可能已经自己删掉该事件了哦');
        }
      } catch (err) {
        console.log(err);
      }
    }
    await get().setEventSubscribed(progressID, eventID, false, '');
  },
  setEventSubscribed: async (
    progressID: string,
    eventID: string,
    subscribed: boolean,
    calendarEventID: string,
  ) => {
    try {
      const value = get().bears.map(progress =>
        progress.progressID !== progressID
          ? progress
          : {
              ...progress,
              events: progress.events.map(event =>
                event.eventID !== eventID
                  ? event
                  : {
                      ...event,
                      calendarSubscribed: subscribed,
                      calendarEventID,
                    },
              ),
            },
      );

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
