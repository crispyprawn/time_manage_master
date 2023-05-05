import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import CompanyBar from '../components/CompanyBar';
import {pinyin} from 'pinyin-pro';
import {Progress} from '../types/progress';
type IndexScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  database: Progress[];
}

function CompanyView(props: Props): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const {database} = props;

  const [data, setData] = useState(database);

  const handleRearrange =
    (sortBy: 'name' | 'create' | 'update' | 'status') => () => {
      setData(prevData => {
        let dataCopy = prevData.slice();
        dataCopy.sort(comparer(sortBy));
        return dataCopy;
      });
    };

  const comparer = (sortBy: 'name' | 'create' | 'update' | 'status') => {
    switch (sortBy) {
      case 'name':
        return (a: Progress, b: Progress) => {
          const a1 = pinyin(a.companyName, {
            toneType: 'none',
            type: 'array',
          }).join();
          const b1 = pinyin(b.companyName, {
            toneType: 'none',
            type: 'array',
          }).join();
          if (a1 < b1) {
            return -1;
          } else if (a1 > b1) {
            return 1;
          } else {
            return 0;
          }
        };
      case 'create':
        return (a: Progress, b: Progress) => a.createTime - b.createTime;
      case 'update':
        return (a: Progress, b: Progress) => a.updateTime - b.updateTime;
      case 'status':
        return (a: Progress, b: Progress) => {
          const a1 = a.events.slice().reverse()[0]?.progressStatus;
          const b1 = b.events.slice().reverse()[0]?.progressStatus;
          if (a1 && b1) {
            return b1 - a1;
          } else if (a1 && !b1) {
            return -1;
          } else if (!a1 && b1) {
            return 1;
          } else {
            return a.createTime - b.createTime;
          }
        };
      default:
        return (a: Progress, b: Progress) => {
          const a1 = a.progressID;
          const b1 = b.progressID;
          if (a1 < b1) {
            return -1;
          } else if (a1 > b1) {
            return 1;
          } else {
            return 0;
          }
        };
    }
  };

  return (
    <View style={styles.companyViewContainer}>
      <View style={styles.sortBy}>
        <TouchableOpacity onPress={handleRearrange('name')}>
          <Text>by name</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleRearrange('create')}>
          <Text>by create time</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleRearrange('update')}>
          <Text>by update time</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRearrange('status')}>
          <Text>by event status</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.companyScrollView}>
        {data.map(progress => (
          <CompanyBar progress={progress} key={progress.progressID} />
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
    flex: 0,
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
  companyScrollView: {
    flex: 1,
  },
  companyViewContainer: {
    height: '100%',
  },
});

export default CompanyView;
