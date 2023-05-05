/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Index from './src/screens/Index';
import Settings from './src/screens/Settings';
import {defaultSettings} from './src/constants/defaultSettings';
import ProgressCreate from './src/screens/ProgressCreate';
import {Provider as AntdProvider} from '@ant-design/react-native';
import {useSettingsStore} from './src/hooks/useSettingsStore';
import {useUserDataStore} from './src/hooks/useUserDataStore';
import EventCreate from './src/screens/EventCreate';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Details: undefined;
  ProgressCreate: undefined;
  ProgressDetail: undefined;
  EventCreate: undefined;
  EventDetail: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  //   const {setData, getData} = useStore();
  //   useEffect(() => {
  //     getData('settings').then(res => {
  //       if (res === null) {
  //         setData('settings', defaultSettings);
  //       }
  //     });
  //     getData('userData').then(res => {
  //       if (res === null) {
  //         setData('userData', []);
  //       }
  //     });
  //   }, []);
  const settings = useSettingsStore(state => state.bears);
  const userData = useUserDataStore(state => state.bears);
  const getSettings = useSettingsStore(state => state.getData);
  const setSettings = useSettingsStore(state => state.setData);
  const getUserData = useUserDataStore(state => state.getData);
  const setUserData = useUserDataStore(state => state.setData);

  useEffect(() => {
    getSettings().then(
      res => {
        if (res === null) {
          setSettings(defaultSettings);
        }
      },
      err => {
        console.log(err);
      },
    );
    getUserData().then(
      res => {
        if (res === null) {
          setUserData([]);
        }
      },
      err => {
        console.log(err);
      },
    );
  }, []);

  return (
    <NavigationContainer>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}
      {userData && settings && (
        <AntdProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Index} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="ProgressCreate" component={ProgressCreate} />
            <Stack.Screen name="EventCreate" component={EventCreate} />
          </Stack.Navigator>
        </AntdProvider>
      )}
    </NavigationContainer>
  );
}

export default App;
export type {RootStackParamList};
