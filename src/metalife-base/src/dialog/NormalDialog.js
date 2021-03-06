'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RoundBtn from '../comps/RoundBtn';
import {useDialog} from './Dialog';
import {useStyle} from '../ThemeColors';
import DialogTitle from './DialogTitle';

export const NormalDialog = ({
  title,
  confirmStr = 'confirm',
  content,
  onConfirm,
}) => {
  const styles = useStyle(createSty);
  const dialog = useDialog();
  return (
    <View style={styles.container}>
      <DialogTitle title={title || ''} />
      {typeof content === 'string' ? (
        <Text style={styles.content}>{content}</Text>
      ) : (
        content
      )}
      <View style={styles.row}>
        <RoundBtn
          style={styles.btnContainer}
          title={'cancel'}
          press={() => {
            dialog.dismiss();
          }}
        />
        <RoundBtn
          style={styles.btnContainer}
          title={confirmStr}
          press={() => {
            dialog.dismiss();
            onConfirm && onConfirm();
          }}
        />
      </View>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_FFFFFF_111717,
      margin: 20,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    btnContainer: {
      width: 80,
      height: 30,
    },
    content: {
      fontSize: 15,
      color: '#8E8E92',
      lineHeight: 18,
      marginTop: 20,
    },
  });
