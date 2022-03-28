'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../../shared/ThemeColors';
import Constants from '../../../../shared/Constants';

const PhotonListItemView = () => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Text style={styles.channelName}>SMT</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Remark</Text>
        <Text style={styles.itemValue}>小白羊</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Balance</Text>
        <Text style={styles.itemValue}>276432</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Address</Text>
        <Text style={styles.itemValue}>0xA761A79a2048…229868BB123406</Text>
      </View>
      <Text style={styles.dis}>Withdrawal, estimated 1~2 minutes</Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Replenish</Text>
        <Text style={styles.buttonText}>withdraw</Text>
        <Text style={styles.buttonText}>closure</Text>
      </View>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {marginHorizontal: 15, marginTop: 20},
    channelName: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      lineHeight: 19,
      fontWeight: Constants.bold,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    itemTitle: {
      fontSize: 15,
      lineHeight: 18,
      color: theme.c_8E8E92,
    },
    itemValue: {
      fontSize: 14,
      color: theme.c_000000_FFFFFF,
      lineHeight: 17,
      marginLeft: 12,
    },
    dis: {
      fontSize: 14,
      lineHeight: 20,
      marginTop: 12,
      color: theme.c_64D39F,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.c_FFFFFF_111717,
      justifyContent: 'space-around',
      height: 36,
      borderRadius: 18,
      marginTop: 10,
    },
    buttonText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.primary,
    },
  });
export default PhotonListItemView;
