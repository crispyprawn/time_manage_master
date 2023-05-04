import React, {useState} from 'react';
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
import {homeProgresses} from '../mock/mock-data';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {pinyin} from 'pinyin-pro';
import {Progress} from '../types/progress';
import CompanyView from '../components/CompanyView';
import EventView from '../components/EventView';
import {Tabs, Carousel} from '@ant-design/react-native';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
type IndexTab = 'company' | 'event';

function Index(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
    height: '100%',
  };

  const [data, setData] = useState(homeProgresses);
  const [currentTab, setCurrentTab] = useState<IndexTab>('company');


  const tabs = [{title: 'company'}, {title: 'event'}];
  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.topTabs}>
        <AntDesign
          name="setting"
          size={36}
          onPress={() => navigation.navigate('Settings')}
        />
        <View style={styles.modeSwitcher}>
          <TouchableOpacity>
            <AntDesign
              name="home"
              size={30}
              onPress={() => setCurrentTab('company')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign
              name="clockcircleo"
              size={28}
              onPress={() => setCurrentTab('event')}
            />
          </TouchableOpacity>
        </View>
        <AntDesign name="pluscircleo" size={34} />
      </View>
      <View style={styles.tabContents}>
        {currentTab === 'company' && <CompanyView database={data} />}
        {currentTab === 'event' && <EventView database={data} />}
      </View>


      {/* <Tabs
        tabs={tabs}
        renderTabBar={tabProps => (
          <View style={styles.tabBar}>
            {tabProps.tabs.map((tab, i) => (
              // change the style to fit your needs
              <TouchableOpacity
                activeOpacity={0.9}
                key={tab.key || i}
                style={{
                  // width: '30%',
                  padding: 6,
                }}
                onPress={() => {
                  const {goToTab, onTabClick} = tabProps;
                  // tslint:disable-next-line:no-unused-expression
                  onTabClick && onTabClick(tabs[i], i);
                  // tslint:disable-next-line:no-unused-expression
                  goToTab && goToTab(i);
                }}>
                <Text
                  style={{
                    color: tabProps.activeTab === i ? 'green' : '#333333',
                  }}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        style={styles.tabContents}>
        <CompanyView database={data} />
        <EventView database={data} />
      </Tabs> */}
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
});

export default Index;
