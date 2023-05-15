import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import CompanyBar from '../components/CompanyBar';
import {pinyin} from 'pinyin-pro';
import {Progress} from '../types/progress';
type CompanySortConditions = 'name' | 'create' | 'update' | 'stage';
interface Props {
  database: Progress[];
}

function CompanyView(props: Props): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {database} = props;

  const [condition, setCondition] = useState<CompanySortConditions>('create');

  /**
   * 目前的设计是新公司进程添加到列表末尾，因此进程存储顺序和按照createTime排序一致
   * @param sortBy comparer type
   * @returns compare function as a param for .sort() function
   */
  const comparer = (sortBy: CompanySortConditions) => {
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
      case 'stage':
        return (a: Progress, b: Progress) => {
          const a1 = a.events.slice().reverse()[0]?.progressStage;
          const b1 = b.events.slice().reverse()[0]?.progressStage;
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
        <TouchableOpacity onPress={() => setCondition('name')}>
          <Text>by name</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCondition('create')}>
          <Text>by create time</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCondition('update')}>
          <Text>by update time</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCondition('stage')}>
          <Text>by event stage</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.companyScrollView}>
        {condition !== 'create' &&
          database
            .slice()
            .sort(comparer(condition))
            .map(progress => (
              <CompanyBar progress={progress} key={progress.progressID} />
            ))}
        {condition === 'create' &&
          database
            .slice()
            .reverse()
            .map(progress => (
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
