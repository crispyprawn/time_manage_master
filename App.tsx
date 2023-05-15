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
import {Provider as AntdProvider} from '@ant-design/react-native';
import {useSettingsStore} from './src/hooks/useSettingsStore';
import {useUserDataStore} from './src/hooks/useUserDataStore';
import ProgressCreate from './src/screens/ProgressCreate';
import EventCreate from './src/screens/EventCreate';
import ProgressDetail from './src/screens/ProgressDetail';
import EventDetail from './src/screens/EventDetail';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Details: undefined;
  ProgressCreate: undefined;
  ProgressDetail: {progressID: string};
  EventCreate: {progressID: string} | undefined;
  EventDetail: {progressID: string; eventID: string};
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
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
            <Stack.Group screenOptions={{headerShown: false}}>
              <Stack.Screen name="Home" component={Index} />
            </Stack.Group>
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="ProgressCreate" component={ProgressCreate} />
            <Stack.Screen name="ProgressDetail" component={ProgressDetail} />
            <Stack.Screen name="EventCreate" component={EventCreate} />
            <Stack.Screen name="EventDetail" component={EventDetail} />
          </Stack.Navigator>
        </AntdProvider>
      )}
    </NavigationContainer>
  );
}

export default App;
export type {RootStackParamList};
