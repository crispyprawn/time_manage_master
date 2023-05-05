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
import {Progress} from '../types/progress';
import {Tabs, Carousel, InputItem, Toast} from '@ant-design/react-native';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {ProgressStatus} from '../constants/progress';
import {useSettingsStore} from '../hooks/useSettingsStore';
import {useUserDataStore} from '../hooks/useUserDataStore';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

function ProgressCreate(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
    height: '100%',
  };

  const userData = useUserDataStore(state => state.bears);
  const setUserData = useUserDataStore(state => state.setData);
  const [form, setForm] = useState<Pick<Progress, 'companyName'>>();
  const [createDeliverResume, setCreateDeliverResume] = useState(false);

  const handleCreateEvent = () => {
    if (!form?.companyName) {
      Toast.fail({
        content: '请先输入公司名字',
      });
      return;
    }
    if (createDeliverResume) {
      const now = dayjs().valueOf();
      setUserData(
        userData?.concat([
          {
            ...form,
            createTime: now,
            updateTime: now,
            progressID: nanoid(),
            events: [
              {
                progressStatus: ProgressStatus.DELIVER_RESUME,
                eventTime: now,
                calendarSubscribed: false,
                eventID: nanoid(),
              },
            ],
          },
        ] as Progress[]),
      );
    } else {
      setUserData(
        userData?.concat([
          {
            ...form,
            createTime: dayjs().valueOf(),
            updateTime: dayjs().valueOf(),
            progressID: nanoid(),
            events: [],
          },
        ] as Progress[]),
      );
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.topTabs}>
        <AntDesign name="close" size={36} onPress={() => navigation.goBack()} />
        <Text style={styles.text}>创建进程</Text>
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
          <TextInput
            style={styles.inputText}
            value={form?.companyName}
            onChangeText={(value: any) => {
              setForm({
                ...form,
                companyName: value,
              });
            }}
            placeholder="公司名称"
            placeholderTextColor={'#e2e1e4'}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>同时添加“投递简历”事件</Text>
          <Switch
            style={styles.switch}
            value={createDeliverResume}
            onValueChange={value => setCreateDeliverResume(value)}
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
  switch: {
    // backgroundColor: 'blue',
    // justifyContent: 'flex-start',
    width: 44,
    paddingVertical: 10,
    transform: [{scale: 1.4}],
    marginLeft: 8,
  },
});

export default ProgressCreate;
