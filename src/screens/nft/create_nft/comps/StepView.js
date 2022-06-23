'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-26
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useStyle} from 'metalife-base';

const StepView = ({style, content = ''}) => {
  const styles = useStyle(styleFun);
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.contentText}>{content}</Text>
    </View>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.primary,
      height: 27,
      paddingLeft: 10,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      justifyContent: 'center',
      width: 62,
    },
    contentText: {
      fontSize: 14,
      color: '#000',
    },
  });
export default StepView;
