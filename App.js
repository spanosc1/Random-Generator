/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import Header from './js/Header';
import Numbers from './js/Numbers';
import Colors from './js/Colors';
import Tarot from './js/Tarot';
import Saves from './js/Saves';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode={"none"}
        gestureEnabled={false}
      >
        <Stack.Screen
          name="Numbers"
          component={Numbers}
          options={{
            gestureEnabled: false
          }}
        />
        <Stack.Screen
          name="Colors"
          component={Colors}
          options={{
            gestureEnabled: false
          }}
        />
        <Stack.Screen
          name="Tarot"
          component={Tarot}
          options={{
            gestureEnabled: false
          }}
        />
        <Stack.Screen
          name="Saves"
          component={Saves}
          options={{
            gestureEnabled: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});
