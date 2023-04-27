import React from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
function Settings(): JSX.Element {
  const navigation = useNavigation();
  return (
    <View>
      <Text onPress={() => navigation.goBack()}>
        click here to go back to home page
      </Text>
    </View>
  );
}

export default Settings;
