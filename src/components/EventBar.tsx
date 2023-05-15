import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {EventNameMap, ProgressStage} from '../constants/progress';
import dayjs from 'dayjs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {EventWithCompany, Progress} from '../types/progress';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  event: EventWithCompany;
  key: string;
}
function EventBar(props: Props): JSX.Element {
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const {event} = props;

  const [showDetail, setShowDetail] = useState(false);

  return (
    <TouchableOpacity
      style={styles.EventBar}
      onPress={() => setShowDetail(!showDetail)}
      key={event.eventID}>
      <View style={styles.progressEntry}>
        {!showDetail && (
          <View style={styles.progressBrief}>
            <Text style={styles.companyName}>{event.companyName}</Text>
            <Text>{dayjs(event.startTime).format('MM-DD HH:mm')}</Text>
            <AntDesign name="down-square-o" size={32} />
          </View>
        )}
        {showDetail && (
          <View style={styles.progressDetail}>
            <View style={styles.progressTitle}>
              <View style={styles.companyNameDetail}>
                <Text style={styles.companyName}>{event.companyName}</Text>
                <View style={styles.companyAction}>
                  <AntDesign name="edit" size={24} />
                </View>
              </View>
              <View style={styles.companyAction}>
                <AntDesign name="up-square-o" size={32} />
              </View>
            </View>
            <View style={styles.progressTimeInfo}>
              <Text>{dayjs(event.startTime).format('YYYY-MM-DD HH:mm')}</Text>
              <Text>{dayjs(event.endTime).format('YYYY-MM-DD HH:mm')}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  EventBar: {
    marginTop: 10,
  },
  progressEntry: {
    backgroundColor: 'orange',
    borderRadius: 30,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  progressBrief: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressDetail: {
    backgroundColor: 'pink',
  },
  progressTitle: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTimeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'lightgreen',
    height: 40,
    alignItems: 'center',
  },
  eventBrief: {
    height: 40,
    justifyContent: 'center',
  },
  eventDetail: {},
  companyName: {
    width: 100,
    height: 40,
    lineHeight: 40,
    fontSize: 20,
  },
  companyNameDetail: {
    flexDirection: 'row',
    backgroundColor: '#f8bc31',
  },
  companyAction: {
    justifyContent: 'center',
  },
});

export default EventBar;
