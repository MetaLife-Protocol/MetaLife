'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */

import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {useTheme} from '../../../../metalife-base';

const CameraMarkerView = ({}) => {
  const theme = useTheme();
  const animatedLine = useRef(new Animated.Value(0));

  const startAnimation = () => {
    Animated.timing(animatedLine.current, {
      toValue: 250,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      animatedLine.current.setValue(0);
      startAnimation();
    });
  };
  useEffect(() => {
    startAnimation();
    // eslint-disable-next-line
  }, []);
  return (
    <View style={{width: '100%', height: '100%', flexDirection: 'column'}}>
      <View style={{flex: 1, opacity: 0.7, backgroundColor: 'black'}} />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, opacity: 0.7, backgroundColor: 'black'}} />
        <View style={{height: 250, width: 250}}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: theme.primary,
              width: 2,
              height: 10,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: theme.primary,
              width: 10,
              height: 2,
            }}
          />

          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: theme.primary,
              width: 2,
              height: 10,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: theme.primary,
              width: 10,
              height: 2,
            }}
          />

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              backgroundColor: theme.primary,
              width: 2,
              height: 10,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              backgroundColor: theme.primary,
              width: 10,
              height: 2,
            }}
          />

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: theme.primary,
              width: 2,
              height: 10,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: theme.primary,
              width: 10,
              height: 2,
            }}
          />
          <Animated.View
            style={{
              width: '100%',
              height: 2,
              backgroundColor: theme.primary,
              transform: [{translateY: animatedLine.current}],
            }}
          />
        </View>
        <View style={{flex: 1, opacity: 0.7, backgroundColor: 'black'}} />
      </View>
      <View
        style={{
          flex: 2,
          opacity: 0.7,
          backgroundColor: 'black',
          paddingTop: 40,
        }}
      />
    </View>
  );
};

export default CameraMarkerView;
