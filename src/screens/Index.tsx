import React, {useEffect, memo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import {homeProgresses} from '../mock/mock-data';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Progress} from '../types/progress';
import CompanyView from '../components/CompanyView';
import EventView from '../components/EventView';
import {Modal} from '@ant-design/react-native';
import {useIsFocused} from '@react-navigation/native';
import {useSettingsStore} from '../hooks/useSettingsStore';
import {useUserDataStore} from '../hooks/useUserDataStore';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
type IndexTab = 'company' | 'event';

function Index(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();

  const settings = useSettingsStore(state => state.bears);
  const userData = useUserDataStore(state => state.bears);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
    height: '100%',
  };

  const database = settings?.useMockData ? homeProgresses : userData;
  const [currentTab, setCurrentTab] = useState<IndexTab>('company');
  const [visible, setVisible] = useState(false);

  const footerButtons = [
    {text: '创建进程', onPress: () => navigation.navigate('ProgressCreate')},
    {text: '更新进程', onPress: () => navigation.navigate('EventCreate')},
  ];

  return (
    <SafeAreaView style={backgroundStyle}>
      <Modal
        title="选择想要的操作"
        transparent
        onClose={() => setVisible(false)}
        maskClosable
        visible={visible}
        footer={footerButtons}>
        <View style={styles.info}>
          <Text>创建进程，就是增加一个公司</Text>
          <Text>更新进程，就是在原有的公司进程上添加新事件</Text>
        </View>
      </Modal>
      <View style={styles.topTabs}>
        <AntDesign
          name="setting"
          size={36}
          onPress={() => navigation.navigate('Settings')}
        />
        <View style={styles.modeSwitcher}>
          <TouchableOpacity>
            <Octicons
              name="organization"
              size={30}
              onPress={() => setCurrentTab('company')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather
              name="calendar"
              size={32}
              onPress={() => setCurrentTab('event')}
            />
          </TouchableOpacity>
        </View>
        <AntDesign
          name="pluscircleo"
          size={34}
          onPress={() => setVisible(true)}
        />
      </View>
      {database.length > 0 && (
        <View style={styles.tabContents}>
          {currentTab === 'company' && <CompanyView database={database} />}
          {currentTab === 'event' && <EventView database={database} />}
        </View>
      )}
      {database.length === 0 && (
        <View style={styles.tabContents}>
          <Text style={styles.tabEmptyHint}>
            点右上角加号，去添加第一个求职进程吧
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sortBy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  highlight: {
    fontWeight: '700',
  },
  topTabs: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tabBar: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  modeSwitcher: {
    flexDirection: 'row',
    width: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContents: {
    flex: 1,
  },
  tabEmptyHint: {
    fontSize: 20,
    top: '40%',
  },
  info: {
    paddingVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Index;
