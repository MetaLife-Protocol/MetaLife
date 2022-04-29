'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-29
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useStyle} from 'metalife-base';

const CreateChooseView = ({
  title = '',
  onPress = () => {},
  style,
  titleStyle,
  isSelect = true,
}) => {
  const styles = useStyle(styleFun);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, styles.borderView, {flex: 1}, style]}>
      {isSelect ? (
        <Image
          style={{width: 20, height: 20}}
          source={require('../../../../assets/image/nft/select_icon.png')}
        />
      ) : (
        <View style={styles.unselectView} />
      )}

      <Text style={[styles.selectText, titleStyle]}>{title}</Text>
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
      marginLeft: 10,
    },
    unselectView: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.primary,
    },
  });
export default CreateChooseView;
