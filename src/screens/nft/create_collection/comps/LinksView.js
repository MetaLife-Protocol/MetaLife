'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from 'metalife-base';

const LinksView = () => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Text>LinksView</Text>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      width: 345,
      paddingVertical: 15,
      backgroundColor: theme.c_FFFFFF_111717,
      borderRadius: 12,
      marginTop: 10,
      paddingHorizontal: 12,
    },
  });
export default LinksView;
