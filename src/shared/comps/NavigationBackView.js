'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-22
 * @Project:MetaLife
 */

import React, {memo} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const NavigationBackView = props => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{padding: 3}}
      onPress={() => {
        if (props && props.canGoBack) {
          navigation.goBack();
        }
      }}>
      <Image
        source={require('../../../src/assets/image/icons/icon_back.png')}
        style={{width: 18, height: 16}}
      />
    </TouchableOpacity>
  );
};
export default memo(NavigationBackView);
