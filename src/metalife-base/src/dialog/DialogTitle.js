'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import Text from '../../../shared/comps/ComText';
import {useStyle} from '../ThemeColors';
import {useDialog} from './Dialog';

const icons = {
  dialogCloseIcon: require('../images/dialog_close.png'),
};

const DialogTitle = ({title = ''}) => {
  const styles = useStyle(createSty);
  const dialog = useDialog();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        onPress={() => {
          dialog.dismiss();
        }}>
        <Image source={icons.dialogCloseIcon} style={styles.closeIcon} />
      </Pressable>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 17,
      lineHeight: 21,
      fontWeight: 'bold',
      color: theme.c_000000_FFFFFF,
      flex: 1,
    },
    closeIcon: {
      width: 17,
      height: 17,
      tintColor: theme.c_000000_FFFFFF,
    },
  });
export default DialogTitle;
