'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-16
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useStyle} from 'metalife-base';

const DetailTitle = ({title, style}) => {
  const styles = useStyle(styleFun);

  return (
    <View>
      <Text style={[styles.detailTitle, style]}>About Collection</Text>
    </View>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    detailTitle: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      lineHeight: 19,
      fontWeight: 'bold',
      marginTop: 20,
    },
  });
export default DetailTitle;
