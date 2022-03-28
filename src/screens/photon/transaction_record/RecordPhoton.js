'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../shared/ThemeColors';

const RecordPhoton = () => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Text style={{color: 'red'}}>RecordPhoton</Text>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
  });
export default RecordPhoton;
