'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Constants from '../../../../shared/Constants';
import {useStyle} from 'metalife-base';

const flashIcon = require('../../../../assets/image/icons/icon_flashlight_light.png');
const FlashLightButton = ({onPress}) => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Pressable style={{}} onPress={onPress}>
        <Image source={flashIcon} style={styles.img} />
      </Pressable>
      <Text style={styles.buttonText}>Turn on the flashlight</Text>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: Constants.safeBottom + 50,
      alignItems: 'center',
    },
    img: {width: 48, height: 48},
    buttonText: {color: 'white', fontSize: 14, marginTop: 15},
  });
export default FlashLightButton;
