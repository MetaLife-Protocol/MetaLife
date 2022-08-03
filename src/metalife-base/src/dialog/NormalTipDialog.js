'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../../shared/comps/ComText';
import RoundBtn from '../comps/RoundBtn';
import {useDialog} from './Dialog';
import {useStyle} from '../ThemeColors';
import DialogTitle from './DialogTitle';

export const NormalTipDialog = ({title, content}) => {
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
        <View style={{flex: 1}}>
          <RoundBtn
            title={'submit'}
            press={() => {
              dialog.dismiss();
            }}
          />
        </View>
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
      padding: 20,
      alignItems: 'center',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      height: 44,
    },
    content: {
      fontSize: 15,
      color: '#8E8E92',
      lineHeight: 18,
      marginTop: 20,
    },
  });
