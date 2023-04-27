/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Index from './src/screens/index';
import Settings from './src/screens/settings';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Details: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
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
