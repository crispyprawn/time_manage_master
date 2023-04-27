import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {EventNameMap, ProgressStatus} from '../constants/progress';
import dayjs from 'dayjs';
import {homeProgresses} from '../mock/mock-data';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
type IndexScreenNavigationProp = NativeStackNavigationProp<RootStackParamList,'Home'>

function Index(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 20,
  };

  const [data, setData] = useState(homeProgresses);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.topTabs}>
        <AntDesign name="setting" size={36} onPress={()=>navigation.navigate('Settings')}/>
        <View style={styles.modeSwitcher}>
          <AntDesign name="home" size={30} />
          <AntDesign name="clockcircleo" size={28} />
        </View>
        <AntDesign name="pluscircleo" size={34} />
      </View>
      <View />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {data.map(progress => (
          <View key={progress.progressID} style={styles.progressEntry}>
            <Text style={styles.companyName}>{progress.companyName}</Text>
            <Text>
              {EventNameMap[progress.events.reverse()[0].progressStatus]}
            </Text>
            <Text>
              {dayjs(progress.events.reverse()[0].eventTime).format(
                'MM-DD HH:mm',
              )}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
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
  modeSwitcher: {
    flexDirection: 'row',
    width: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressEntry: {
    backgroundColor: 'orange',
    borderRadius: 30,
    height: 60,
    marginTop: 10,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyName: {
    width: 80,
    backgroundColor: '#f8bc31',
  },
});

export default Index;
