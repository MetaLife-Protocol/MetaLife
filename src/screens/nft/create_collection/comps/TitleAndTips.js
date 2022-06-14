'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from 'metalife-base';

const TitleAndTips = ({title = '', tips = '', rightView}) => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>{title}</Text>
        {!!tips && <Text style={styles.tipsText}>{tips}</Text>}
      </View>
      <View>{rightView}</View>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      fontWeight: 'bold',
      lineHeight: 19,
      marginTop: 20,
    },
    tipsText: {
      fontSize: 14,
      color: theme.c_8E8E92,
      lineHeight: 17,
      marginTop: 10,
    },
  });
export default TitleAndTips;
