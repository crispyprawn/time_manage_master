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
import {EventNameMap, ProgressStatus} from '../constants/progress';
import dayjs from 'dayjs';
import {homeProgresses} from '../mock/mock-data';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import CompanyBar from '../components/CompanyBar';
import {pinyin} from 'pinyin-pro';
import {EventWithCompany, Progress} from '../types/progress';
import EventBar from './EventBar';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  database: Progress[];
}

function EventView(props: Props): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const {database} = props;

  const events: EventWithCompany[] = database
    .map(progress => ({
      ...progress,
      events: progress.events.map(event => ({
        ...event,
        companyName: progress.companyName,
        progressID: progress.progressID,
      })),
    }))
    .flatMap(progress => progress.events)
    .sort((a, b) => b.startTime - a.startTime);

  return (
    <View>
      <ScrollView
      //   contentInsetAdjustmentBehavior="automatic"
      >
        {events.map(event => (
          <EventBar event={event} key={event.eventID} />
        ))}
      </ScrollView>
    </View>
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
  modeSwitcher: {
    flexDirection: 'row',
    width: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default EventView;
