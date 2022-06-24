'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../../metalife-base';

const BlockchainView = () => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Image
        style={styles.icon}
        source={require('../../../../assets/image/nft/icon_nft_spectrum.png')}
      />
      <Text style={styles.titleText}>Add category</Text>
      <Image
        style={styles.arrow}
        source={require('../../../../assets/image/nft/arrow_down.png')}
      />
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: 345,
      height: 65,
      alignItems: 'center',
      backgroundColor: theme.c_FFFFFF_111717,
      borderRadius: 12,
      marginTop: 10,
      paddingHorizontal: 12,
    },
    titleText: {
      fontSize: 15,
      lineHeight: 18,
      color: theme.c_000000_FFFFFF,
      flex: 1,
      marginLeft: 6,
    },
    categoryType: {
      fontSize: 15,
      lineHeight: 18,
      color: theme.c_8E8E92,
    },
    icon: {width: 33, height: 33},
    arrow: {width: 16, height: 16, marginLeft: 9},
  });
export default BlockchainView;
