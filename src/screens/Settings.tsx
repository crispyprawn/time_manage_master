import React, {useEffect, useState} from 'react';
import {ScrollView, Text, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  //   Switch,
  List,
  WhiteSpace,
  WingBlank,
  Button,
} from '@ant-design/react-native';
import type {Settings} from '../types/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Progress} from '../types/progress';
import {defaultSettings} from '../constants/defaultSettings';
import { useSettingsStore } from '../hooks/useSettingsStore';
import { useUserDataStore } from '../hooks/useUserDataStore';
export default function Settings(): JSX.Element {
  const navigation = useNavigation();
  //   const {storage: settings, setStorage: setSettings} =
  //     useStorageByKey<Settings>('settings');
  //   const {storage: userData, setStorage: setUserData} =
  //     useStorageByKey<Progress[]>('userData');


  const settings = useSettingsStore(state => state.bears);
  const userData = useUserDataStore(state => state.bears);
  const setSettings = useSettingsStore(state => state.setData);
  const setUserData = useUserDataStore(state => state.setData);
  return (
    <ScrollView>
      {settings && (
        <List renderHeader="基本">
          <List.Item
            extra={
              <Switch
                onValueChange={value =>
                  setSettings({
                    ...settings,
                    useMockData: value,
                  })
                }
                value={settings.useMockData}
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
                setSettings(defaultSettings);
              }}>
              恢复默认设置
            </Button>
          </WingBlank>
          <WhiteSpace />
          <WingBlank>
            <Button
              type="primary"
              onPress={() => {
                setUserData([]);
              }}>
              清空用户数据
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

