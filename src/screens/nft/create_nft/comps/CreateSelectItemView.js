'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-29
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useStyle} from 'metalife-base';

const CreateSelectItemView = ({
  title = '',
  onPress = () => {},
  style,
  titleStyle,
}) => {
  const styles = useStyle(styleFun);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.row,
        styles.borderView,
        styles.selectRightContainer,
        style,
      ]}>
      <Text style={[styles.selectText, titleStyle]}>{title}</Text>
      <Image
        style={{width: 16, height: 16}}
        source={require('../../../../assets/image/nft/arrow_down.png')}
      />
    </TouchableOpacity>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    borderView: {
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      height: 50,
      borderRadius: 12,
      paddingHorizontal: 10,
    },
    selectText: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      flex: 1,
    },
    selectRightContainer: {
      marginLeft: 15,
      width: 85,
    },
  });
export default CreateSelectItemView;
