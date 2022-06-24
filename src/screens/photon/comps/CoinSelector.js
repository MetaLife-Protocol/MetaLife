'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colorsSchema, SchemaStyles} from '../../../metalife-base';

const iconDic = {
  arrowIcon: require('../../../assets/image/icons/icons_down_arrow.png'),
};

const CoinSelector = ({coin, onPress}) => {
  const {row, alignItemsCenter, justifySpaceBetween, text, btnInactiveFG} =
      SchemaStyles(),
    {coinContainer, textCoin, arrowIcon} = styles,
    {textHolder} = colorsSchema;

  return (
    <View
      style={[
        row,
        alignItemsCenter,
        justifySpaceBetween,
        coinContainer,
        {borderColor: textHolder},
      ]}>
      <Text style={[textCoin, text]}>Coin</Text>
      <TouchableOpacity onPress={onPress} style={[row, alignItemsCenter]}>
        <Text style={btnInactiveFG}>{coin}</Text>
        <Image source={iconDic.arrowIcon} style={arrowIcon} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  coinContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
  },
  textCoin: {
    fontSize: 16,
    lineHeight: 23,
  },
  arrowIcon: {width: 9, height: 5, marginLeft: 9},
});
export default CoinSelector;
