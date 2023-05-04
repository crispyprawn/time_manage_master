import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Switch,
  List,
  WhiteSpace,
  WingBlank,
  Button,
} from '@ant-design/react-native';
import {useStore} from '../hooks/useStore';
import type {Settings} from '../types/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Progress} from '../types/progress';
import {defaultSettings} from '../constants/defaultSettings';
function Settings(): JSX.Element {
  const navigation = useNavigation();
  const {getData, setData} = useStore();
  const [settings, setSettings] = useState<Settings>();
  const [userData, setUserData] = useState<Progress[]>();

  useEffect(() => {
    getData('settings')
      .then(res => {
        setSettings(res);
      })
      .catch(err => console.log(err));
    getData('userData')
      .then(res => {
        setUserData(res);
      })
      .catch(err => console.log(err));
  }, [getData]);

  return (
    <ScrollView>
      {settings && (
        <List renderHeader="基本">
          <List.Item
            extra={
              <Switch
                checked={settings.useMockData}
                onPress={() =>
                  setData('settings', {
                    ...settings,
                    useMockData: !settings.useMockData,
                  })
                }
              />
            }>
            使用模拟数据
          </List.Item>
          <WhiteSpace />
          <WingBlank>
            <Button type="primary" onPress={() => AsyncStorage.clear()}>
              清除全部缓存
            </Button>
          </WingBlank>
          <WhiteSpace />
          <WingBlank>
            <Button
              type="primary"
              onPress={() => {
                setData('settings', defaultSettings);
              }}>
              恢复默认设置
            </Button>
          </WingBlank>
          <WhiteSpace />
          <List.Item>
            <Text>{JSON.stringify(userData)}</Text>
          </List.Item>
          <List.Item>
            <Text>{JSON.stringify(settings)}</Text>
          </List.Item>
        </List>
      )}
    </ScrollView>
  );
}

export default Settings;
