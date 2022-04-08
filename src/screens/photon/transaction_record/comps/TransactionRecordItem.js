'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from 'metalife-base';
import Constants from '../../../../shared/Constants';

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
    <View style={styles.container}>
      {/*   <View style={styles.stateContainer}>
        <Text style={styles.transfer}>Transfer</Text>
        <Text style={styles.transferState}>Completed</Text>
      </View>*/}
      <View style={[styles.tabsContainer, styles.row]}>
        <Text style={[styles.tabTitle, styles.firstFlex]}>Quantity</Text>
        <Text style={[styles.tabTitle, styles.secondFlex]}>State</Text>
        <Text style={[styles.tabTitle, styles.thirdFlex]}>Time</Text>
      </View>
      <View style={[styles.valueContainer, styles.row]}>
        <Text style={[styles.tabValue, styles.firstFlex]}>+180.0000 SMT</Text>
        <Text style={[styles.tabValue, styles.secondFlex]}>Withdrawing</Text>
        <Text style={[styles.tabValue, styles.thirdFlex]}>14:00 03/10</Text>
      </View>
      <Text style={styles.address}>地址 0xA761A79a2048…229868BB123406</Text>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {paddingVertical: 15},
    stateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    transfer: {
      fontSize: 16,
      lineHeight: 23,
      color: theme.c_000000_FFFFFF,
      fontWeight: Constants.bold,
    },
    transferState: {
      fontSize: 15,
      lineHeight: 21,
      color: theme.primary,
    },
    tabsContainer: {
      marginTop: 22,
    },
    valueContainer: {
      marginTop: 10,
    },
    tabTitle: {fontSize: 14, lineHeight: 17, color: theme.c_8E8E92},
    firstFlex: {
      flex: 160,
    },
    secondFlex: {
      flex: 150,
    },
    thirdFlex: {
      flex: 130,
      textAlign: 'right',
    },
    tabValue: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_000000_FFFFFF,
    },
    address: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_4E586E,
      marginTop: 8,
    },
  });
export default TransactionRecordItem;
