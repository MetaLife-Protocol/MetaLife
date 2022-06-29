'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */

import React, {memo, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDialog, useStyle} from '../../../../metalife-base';
import {useNavigation} from '@react-navigation/native';
import {uploadPhotonLogDialog} from '../hooks';
import {getCurrentAccount} from '../../../../utils';

const PhotonMoreActionsView = ({visible, onSelect, onClose, wallet}) => {
  const styles = useStyle(createSty);
  const {navigate} = useNavigation();
  const dialog = useDialog();

  const uploadLog = useCallback(() => {
    onSelect();
    uploadPhotonLogDialog({dialog: dialog});
  }, [dialog, onSelect]);

  if (!visible) {
    return null;
  }
  return (
    <TouchableOpacity
      style={[styles.fullView, StyleSheet.absoluteFill]}
      onPress={onClose}>
      <View style={styles.container}>
        <Text
          style={styles.text}
          onPress={() => {
            onSelect();
            const currentAccount = getCurrentAccount(wallet);
            // console.log('currentAccount::', currentAccount);
            navigate('ReceivingCode', {
              token: currentAccount?.address,
            });
          }}>
          QR code
        </Text>
        <Text
          style={styles.text}
          onPress={() => {
            onSelect();
            navigate('CreateChannel');
          }}>
          Create channel
        </Text>
        <Text
          style={styles.text}
          onPress={() => {
            onSelect();
            navigate('PhotonTransactionRecord');
          }}>
          Transaction record
        </Text>
        <Text style={styles.text} onPress={uploadLog}>
          Upload data
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const createSty = theme =>
  StyleSheet.create({
    fullView: {backgroundColor: 'rgba(0, 0, 0, 0.8)'},
    container: {
      position: 'absolute',
      right: 15,
      width: 163,
      height: 144,
      backgroundColor: theme.c_FFFFFF_232929,
      borderRadius: 6,
      paddingHorizontal: 15,
      paddingVertical: 17,
      justifyContent: 'space-between',
    },
    text: {
      color: theme.c_000000_FFFFFF,
      fontSize: 15,
      lineHeight: 18,
    },
  });
export default memo(PhotonMoreActionsView);
