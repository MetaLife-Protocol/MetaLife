'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../../metalife-base';
import Constants from '../../../../shared/Constants';

const PhotonTokenOptionItem = () => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/image/icons/icons_search.png')}
        style={styles.coinIcon}
      />
      <View style={styles.coinContainer}>
        <Text style={styles.textTitle}>SMT</Text>
        <Text style={styles.textValue}>$0.00391</Text>
      </View>
      <View>
        <Text style={[styles.textTitle, styles.num]}>439983.3298</Text>
        <Text style={[styles.textValue, styles.num]}>$123.4</Text>
      </View>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 15,
      paddingBottom: 18,
    },
    coinIcon: {
      width: 40,
      height: 40,
      backgroundColor: 'red',
    },
    textTitle: {
      fontSize: 16,
      lineHeight: 19,
      fontWeight: Constants.bold,
      color: theme.c_000000_FFFFFF,
    },
    coinContainer: {
      marginLeft: 10,
      flex: 1,
    },
    textValue: {
      fontSize: 14,
      lineHeight: 17,
      color: '#A5ABB7',
    },
    num: {
      textAlign: 'right',
    },
  });
export default PhotonTokenOptionItem;
