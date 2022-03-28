'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../../shared/ThemeColors';

const TransactionRecordItem = () => {
  const styles = useStyle(createSty);

  function testFun() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ok');
      }, 1000);
    });
  }

  useEffect(() => {
    // testFun().then(res => {
    //   console.log(res);
    // });
  }, []);

  return (
    <>
      <View style={styles.stateContainer}>
        <Text>Transfer</Text>
        <Text>Completed</Text>
      </View>
    </>
  );
};
const createSty = theme =>
  StyleSheet.create({
    stateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
export default TransactionRecordItem;
