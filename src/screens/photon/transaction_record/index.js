'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React from 'react';
import RecordPhoton from './RecordPhoton';
import RecordSpectrum from './RecordSpectrum';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const PhotonTransactionRecord = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={'RecordPhoton'}
      lazy={true}
      backBehavior={'none'}
      // tabBar={(props) => {
      //   return <TopTabBar {...props} />;
      // }}
      sceneContainerStyle={{backgroundColor: 'transparent'}}
      // style={{ backgroundColor: theme.colorBackground3, paddingTop: Constants.statusBarHeight }}
    >
      <Tab.Screen
        name={'RecordPhoton'}
        component={RecordPhoton}
        options={{
          tabBarLabel: 'Photon',
        }}
      />
      <Tab.Screen
        name={'RecordSpectrum'}
        component={RecordSpectrum}
        options={{
          tabBarLabel: 'Spectrum',
        }}
      />
    </Tab.Navigator>
  );
};

export default PhotonTransactionRecord;
