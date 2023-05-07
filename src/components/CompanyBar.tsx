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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {EventNameMap, ProgressStatus} from '../constants/progress';
import dayjs from 'dayjs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Progress} from '../types/progress';
import {Modal} from '@ant-design/react-native';
import {useUserDataStore} from '../hooks/useUserDataStore';
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
  const [visible, setVisible] = useState(false);
  const subscribe = useUserDataStore(state => state.subscribe);
  const unsubscribe = useUserDataStore(state => state.unsubscribe);
  const footerButtons = [
    {text: '创建进程', onPress: () => navigation.navigate('ProgressCreate')},
    {text: '更新进程', onPress: () => navigation.navigate('EventCreate')},
  ];

  return (
    <View style={styles.companyBar} key={progress.progressID}>
      <Modal
        title="选择想要的操作"
        transparent
        onClose={() => setVisible(false)}
        maskClosable
        visible={visible}
        footer={footerButtons}>
        <View style={styles.info}>
          <Text>点“编辑进程”，可以修改公司名称</Text>
          <Text>点“更新进程”，可以在这个公司进程上添加新事件</Text>
        </View>
      </Modal>
      <View style={styles.progressEntry}>
        {!showDetail && (
          <View style={styles.progressBrief}>
            <Text style={styles.companyName}>{progress.companyName}</Text>
            <Text>
              {progressReversedEvents[0] &&
                EventNameMap[progressReversedEvents[0].progressStatus]}
              {progressReversedEvents[0]?.progressStatus}
            </Text>
            <TouchableOpacity onPress={() => setShowDetail(true)}>
              <AntDesign name="down-square-o" size={32} />
            </TouchableOpacity>
          </View>
        )}
        {showDetail && (
          <View style={styles.progressDetail}>
            <View style={styles.progressTitle}>
              <View style={styles.companyNameDetail}>
                <Text style={styles.companyName}>{progress.companyName}</Text>
              </View>
              <View style={styles.companyAction}>
                <Feather
                  name="edit"
                  size={30}
                  onPress={() => setVisible(true)}
                />
                <TouchableOpacity onPress={() => setShowDetail(false)}>
                  <AntDesign name="up-square-o" size={32} />
                </TouchableOpacity>
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
                <Text style={styles.eventDetail}>
                  {EventNameMap[event.progressStatus]}
                  {event.progressStatus}
                  {'    '}
                  {dayjs(event.eventTime).format('MM-DD HH:mm')}
                </Text>
                {event.calendarSubscribed && (
                  <Feather
                    name="bell"
                    size={24}
                    onPress={() =>
                      unsubscribe(progress.progressID, event.eventID)
                    }
                  />
                )}
                {!event.calendarSubscribed && (
                  <Feather
                    name="bell-off"
                    size={24}
                    onPress={() =>
                      subscribe(progress.progressID, event.eventID)
                    }
                  />
                )}
              </View>
            ))}
            {progressReversedEvents?.length === 0 && (
              <View style={styles.eventBrief}>
                <Text style={styles.eventDetail}>
                  {'还没有添加任何事件哦，去添加->'}
                </Text>
                <FontAwesome
                  name="plus-circle"
                  size={32}
                  onPress={() => navigation.navigate('EventCreate')}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
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
    // backgroundColor: 'pink',
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
    paddingRight: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  eventDetail: {
    fontSize: 18,
  },
  companyName: {
    width: 100,
    height: 40,
    lineHeight: 40,
    fontSize: 20,
  },
  companyNameDetail: {
    flexDirection: 'row',
    backgroundColor: 'pink',
  },
  companyAction: {
    width: 90,
    marginVertical: 2,
    marginRight: -9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 16,
    backgroundColor: '#f8bc31',
  },
  info: {
    paddingVertical: 10,
  },
});

export default CompanyBar;
