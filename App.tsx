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
import {useStore} from './src/hooks/useStore';
import {defaultSettings} from './src/constants/defaultSettings';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Details: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const {setData, getData} = useStore();
  useEffect(() => {
    getData('settings').then(res => {
      if (res === null) {
        setData('settings', defaultSettings);
      }
    });
  }, [setData, getData]);
  return (
    <NavigationContainer>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Index} />
        <Stack.Screen name="Settings" component={Settings} />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
export type {RootStackParamList};
