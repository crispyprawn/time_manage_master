import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  SafeAreaView,
  StatusBar,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Event, EventWithCompany, Progress} from '../types/progress';
import {Tabs, PickerView, InputItem, Toast} from '@ant-design/react-native';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {
  EventNameMap,
  ProgressStage,
  ProgressStageKey,
  ProgressStageList,
} from '../constants/progress';
import {useSettingsStore} from '../hooks/useSettingsStore';
import {useUserDataStore} from '../hooks/useUserDataStore';
import TextAreaItem from '@ant-design/react-native/lib/textarea-item';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
type IndexScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

function EventDetail(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const {params} = useRoute<IndexScreenRouteProp>();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
    height: '100%',
  };

  const userData = useUserDataStore(state => state.bears);
  const setUserData = useUserDataStore(state => state.setData);
  const subscribe = useUserDataStore(state => state.subscribe);

  const progressFromParams = userData.find(
    progress => progress.progressID === params.progressID,
  );

  const eventFromParams = progressFromParams?.events.find(
    event => event.eventID === params?.eventID,
  ) as Event;
  const [form, setForm] = useState<
    Omit<EventWithCompany, 'companyName' | 'eventID'>
  >({
    progressStage: eventFromParams.progressStage,
    startTime: eventFromParams.startTime,
    endTime: eventFromParams.endTime,
    calendarSubscribed: eventFromParams.calendarSubscribed,
    calendarEventID: eventFromParams.calendarEventID,
    experience: eventFromParams.experience,
    progressID: params?.progressID,
  });

  const handleEditEvent = async () => {
    if (!form?.progressID) {
      Toast.info({
        content: '请先选择已有公司进程',
      });
      return;
    }
    if (!form?.startTime || !form?.endTime || form?.startTime > form?.endTime) {
      Toast.info({
        content: '请正确选择该事件的起止时间',
      });
      return;
    }
    if (!form?.progressStage) {
      Toast.info({
        content: '请先选择该事件的状态',
      });
      return;
    }
    const newEventID = nanoid();
    await setUserData(
      userData.map(progress => {
        if (progress.progressID !== form.progressID) {
          return progress;
        } else {
          return {
            ...progress,
            events: progress.events.concat([
              {
                eventID: newEventID,
                ...form,
              },
            ]),
          };
        }
      }),
    );
    if (form.calendarSubscribed) {
      await subscribe(form.progressID, newEventID);
    }
    navigation.goBack();
  };

  const progressOptions: ProgressStage[] = ProgressStageList.filter(
    stage => stage >= eventFromParams.progressStage,
  );
  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.topTabs}>
        <AntDesign name="close" size={36} onPress={() => navigation.goBack()} />
        <Text style={styles.text}>编辑事件</Text>
        <AntDesign name="check" size={34} onPress={handleEditEvent} />
      </View>
      <ScrollView
        style={{flex: 1}}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>公司</Text>
          <View>
            <Text style={styles.companyOption}>
              {progressFromParams?.companyName}
            </Text>
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>事件状态</Text>
          <Picker
            enabled={form.progressID?.length > 0}
            selectedValue={form?.progressStage}
            onValueChange={(value: ProgressStage) => {
              setForm({
                ...form,
                progressStage: value,
              });
            }}>
            {progressOptions.map(option => (
              <Picker.Item
                style={styles.companyOption}
                label={EventNameMap[option]}
                value={option}
                key={option}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>开始时间</Text>
          <DatePicker
            date={new Date(form?.startTime)}
            onDateChange={(value: Date) => {
              setForm(prev => ({
                ...prev,
                startTime: value.valueOf(),
                endTime: value.valueOf() + prev.endTime - prev.startTime,
              }));
            }}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>结束时间</Text>
          <DatePicker
            date={new Date(form?.endTime)}
            onDateChange={(value: Date) => {
              setForm({
                ...form,
                endTime: value.valueOf(),
              });
            }}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>添加该事件到日历</Text>
          <Switch
            style={styles.switch}
            value={form?.calendarSubscribed}
            onValueChange={(value: boolean) => {
              setForm({
                ...form,
                calendarSubscribed: value,
              });
            }}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>面经/备注</Text>
          <TextAreaItem
            value={form?.experience}
            placeholder="人人为我，我为人人"
            rows={6}
            onChange={value => {
              setForm({
                ...form,
                experience: value,
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topTabs: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  inputWrapper: {
    // textAlign: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  inputPrefix: {
    fontSize: 24,
    height: 40,
    color: '#2177b8',
  },
  inputText: {
    fontSize: 24,
    // textAlign: 'center',
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 0,
    lineHeight: 40,
  },
  companyOption: {
    fontSize: 24,
    height: 40,
  },
  switch: {
    // backgroundColor: 'blue',
    // justifyContent: 'flex-start',
    width: 44,
    paddingVertical: 10,
    transform: [{scale: 1.4}],
    marginLeft: 8,
  },
});

export default EventDetail;
