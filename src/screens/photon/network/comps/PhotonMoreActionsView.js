'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */

import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from 'metalife-base';
import {useNavigation} from '@react-navigation/native';

const PhotonMoreActionsView = ({visible, onSelect}) => {
  const styles = useStyle(createSty);
  const {navigate} = useNavigation();

  if (!visible) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        onPress={() => {
          onSelect();
          navigate('ReceivingCode', {
            token: '0x096f7368bc01f438f8de8775dafd71a566413c6f',
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
      <Text style={styles.text}>Upload data</Text>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: 15,
      width: 163,
      height: 144,
      backgroundColor: '#232929',
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
