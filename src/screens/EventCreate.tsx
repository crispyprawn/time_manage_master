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
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {EventWithCompany, Progress} from '../types/progress';
import {Tabs, PickerView, InputItem, Toast} from '@ant-design/react-native';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {EventNameMap, ProgressStatus} from '../constants/progress';
import {useSettingsStore} from '../hooks/useSettingsStore';
import {useUserDataStore} from '../hooks/useUserDataStore';
import TextAreaItem from '@ant-design/react-native/lib/textarea-item';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker'
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

function EventCreate(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
    height: '100%',
  };

  const userData = useUserDataStore(state => state.bears);
  const setUserData = useUserDataStore(state => state.setData);
  const now = dayjs().valueOf();
  const [form, setForm] = useState<
    Omit<EventWithCompany, 'companyName' | 'eventID'>
  >({
    progressStatus: ProgressStatus.OFFER_CALL,
    eventTime: now,
    calendarSubscribed: false,
    experience: '',
    progressID: '',
  });

  const handleCreateEvent = () => {
    if (!form?.progressID) {
      Toast.fail({
        content: '请先选择已有公司进程',
      });
      return;
    }
    if (!form?.eventTime) {
      Toast.fail({
        content: '请先选择该事件的时间',
      });
      return;
    }
    if (!form?.progressStatus) {
      Toast.fail({
        content: '请先选择该事件的状态',
      });
      return;
    }
    setUserData(
      userData.map(progress => {
        if (progress.progressID !== form.progressID) {
          return progress;
        } else {
          return {
            ...progress,
            events: progress.events.concat([
              {
                eventID: nanoid(),
                ...form,
              },
            ]),
          };
        }
      }),
    );
    if (form.calendarSubscribed) {
    } else {
    }
    navigation.goBack();
  };

  const latestStatus =
    userData
      .find(progress => progress.progressID === form.progressID)
      ?.events.slice()
      .reverse()[0].progressStatus || -1;
  const progressOptions: ProgressStatus[] = Object.values(
    ProgressStatus,
  ).filter(status => typeof status === 'number' && status > latestStatus);
  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.topTabs}>
        <AntDesign name="close" size={36} onPress={() => navigation.goBack()} />
        <Text style={styles.text}>创建事件</Text>
        <AntDesign name="check" size={34} onPress={handleCreateEvent} />
      </View>
      <ScrollView
        style={{flex: 1}}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>公司</Text>
          <Picker
            selectedValue={form?.progressID}
            onValueChange={(value: string) => {
              setForm({
                ...form,
                progressID: value,
              });
            }}>
            {userData.map(progress => (
              <Picker.Item
                style={styles.companyOption}
                label={progress.companyName}
                value={progress.progressID}
                key={progress.progressID}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>事件状态</Text>
          <Picker
            enabled={form.progressID?.length > 0}
            selectedValue={form?.progressStatus}
            onValueChange={(value: ProgressStatus) => {
              setForm({
                ...form,
                progressStatus: value,
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
          <Text style={styles.inputPrefix}>时间</Text>
          <DatePicker
            date={new Date(form?.eventTime)}
            onDateChange={(value: Date) => {
              setForm({
                ...form,
                eventTime: value.valueOf(),
              });
            }}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>订阅该事件到日历并设置闹钟</Text>
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

export default EventCreate;
