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
import {EventNameMap, ProgressStatus} from '../constants/progress';
import dayjs from 'dayjs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Progress} from '../types/progress';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  progress: Progress;
  key: string;
}
function CompanyBar(props: Props): JSX.Element {
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const {progress} = props;
  const progressReversedEvents = progress.events.slice().reverse();

  const [showDetail, setShowDetail] = useState(false);

  return (
    <TouchableOpacity
      style={styles.companyBar}
      onPress={() => setShowDetail(!showDetail)}
      key={progress.progressID}>
      <View style={styles.progressEntry}>
        {!showDetail && (
          <View style={styles.progressBrief}>
            <Text style={styles.companyName}>{progress.companyName}</Text>
            <Text>
              {EventNameMap[progressReversedEvents[0].progressStatus]}
              {progressReversedEvents[0].progressStatus}
            </Text>
            <AntDesign name="down-square-o" size={32} />
          </View>
        )}
        {showDetail && (
          <View style={styles.progressDetail}>
            <View style={styles.progressTitle}>
              <View style={styles.companyNameDetail}>
                <Text style={styles.companyName}>{progress.companyName}</Text>
                <View style={styles.companyAction}>
                  <AntDesign name="edit" size={24} />
                </View>
              </View>
              <View style={styles.companyAction}>
                <AntDesign name="up-square-o" size={32} />
              </View>
            </View>
            <View style={styles.progressTimeInfo}>
              <Text>
                {'create '}
                {dayjs(progress.createTime).format('MM-DD HH:mm')}
              </Text>
              <Text>
                {'update '}
                {dayjs(progress.updateTime).format('MM-DD HH:mm')}
              </Text>
            </View>
            {progressReversedEvents.map(event => (
              <View style={styles.eventBrief} key={event.progressStatus}>
                <Text>
                  {EventNameMap[event.progressStatus]}
                  {event.progressStatus}
                  {'    '}
                  {dayjs(event.eventTime).format('MM-DD HH:mm')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  companyBar: {
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

export default CompanyBar;
