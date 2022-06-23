'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-25
 * @Project:MetaLife
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyNFTListView from './MyNFTListView';

const MyNFTList = ({}) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName={'Already'}
      backBehavior={'none'}
      sceneContainerStyle={{backgroundColor: 'transparent'}}
      screenOptions={{lazy: true}}>
      <Tab.Screen
        name={'Already'}
        component={MyNFTListView}
        options={{
          tabBarLabel: 'Already',
        }}
      />
      <Tab.Screen
        name={'Sold'}
        component={MyNFTListView}
        options={{
          tabBarLabel: 'Sold',
        }}
      />
      <Tab.Screen
        name={'NotActivated'}
        component={MyNFTListView}
        options={{
          tabBarLabel: 'Not Activated',
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default MyNFTList;
