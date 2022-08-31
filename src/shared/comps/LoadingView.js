import Text from '../../shared/comps/ComText';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../UseSchemaStyles';
import {screenHeight, screenWidth} from '../../utils';
const load = require('../../assets/image/icons/loading.gif');
const w = 125;
const LoadingView = ({width = w, height = 132}) => {
  const {flex1, text, BG} = useSchemaStyles();
  return (
    <View
      style={[
        flex1,
        {
          // width: screenWidth,
          // height: screenHeight,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          // backgroundColor: 'transparent',
        },
      ]}>
      <View
        style={[
          BG,
          {
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12.5,
          },
        ]}>
        <FastImage source={load} style={{width: 50, height: 50}} />
        <Text style={[text, {marginTop: 15}]}>Loading</Text>
      </View>
    </View>
  );
};

export default LoadingView;
