'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../../shared/ThemeColors';
import Constants from '../../../../shared/Constants';

const AddressContactItem = () => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>Aries</Text>
      <Text style={styles.addressText}>0xA761A79a2D0B…84aFBB4a5123406</Text>
      {true && <Text style={styles.addressText}>Friend</Text>}
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_F8F9FD_000000,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 9,
      marginTop: 10,
    },
    nameText: {
      fontSize: 16,
      lineHeight: 19,
      color: theme.c_000000_FFFFFF,
      fontWeight: Constants.bold,
    },
    addressText: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_8E8E92,
      marginTop: 6,
    },
  });
export default AddressContactItem;
