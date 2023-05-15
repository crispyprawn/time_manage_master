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
import {Progress} from '../types/progress';
import {Tabs, Carousel, InputItem, Toast} from '@ant-design/react-native';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {ProgressStage, ProgressStatus, ProgressStatusList} from '../constants/progress';
import {useSettingsStore} from '../hooks/useSettingsStore';
import {useUserDataStore} from '../hooks/useUserDataStore';
import {Picker} from '@react-native-picker/picker';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProgressDetail'
>;
type IndexScreenRouteProp = RouteProp<RootStackParamList, 'ProgressDetail'>;

function ProgressDetail(): JSX.Element {
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
  const [form, setForm] = useState<Pick<Progress, 'companyName' | 'status'>>({
    companyName:
      userData.find(progress => progress.progressID === params.progressID)
        ?.companyName ?? '',
    status:
      userData.find(progress => progress.progressID === params.progressID)
        ?.status ?? ProgressStatus.PENDING,
  });

  const handleCreateEvent = () => {
    if (!form?.companyName) {
      Toast.info({
        content: '请先输入公司名字',
      });
      return;
    }
    const now = dayjs().valueOf();
    setUserData(
      userData?.map(progress =>
        progress.progressID === params.progressID
          ? {
              ...progress,
              ...form,
              updateTime: now,
            }
          : progress,
      ),
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.topTabs}>
        <AntDesign name="close" size={36} onPress={() => navigation.goBack()} />
        <Text style={styles.text}>编辑进程</Text>
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
          <Text style={styles.inputPrefix}>进程状态</Text>
          <Picker
            selectedValue={form.status}
            onValueChange={(value: ProgressStatus) => {
              setForm({
                ...form,
                status: value,
              });
            }}>
            {ProgressStatusList.map(status => (
              <Picker.Item
                style={styles.companyOption}
                label={ProgressStatus[status]}
                value={status}
                key={status}
              />
            ))}
          </Picker>
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
  companyOption: {
    fontSize: 24,
    height: 40,
  },
});

export default ProgressDetail;
