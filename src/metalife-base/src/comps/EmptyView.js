'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../ThemeColors';

const EmptyView = ({emptyText = 'no data', style}) => {
  const styles = useStyle(createSty);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../images/empty_icon.png')}
        style={styles.emptyImg}
      />
      {!!emptyText && <Text style={styles.emptyText}>{emptyText}</Text>}
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      marginTop: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyImg: {
      width: 250,
      height: 165,
    },
    emptyText: {
      fontSize: 15,
      color: theme.c_8E8E92,
    },
  });
export default EmptyView;
