'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */
import React, {useCallback, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {useStyle} from 'metalife-base';
import {useRoute} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {saveImg} from '../../../utils';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-tiny-toast';

const ReceivingCode = () => {
  const {token} = useRoute().params ?? {};
  console.log('token::', token);

  const styles = useStyle(styleFun);
  const svg = useRef();

  let logoFromFile = require('../../../assets/image/contacts/nft_icon.png');

  const saveQrToDisk = useCallback(() => {
    console.log('svg.current::', svg.current);
    svg.current &&
      svg.current.toDataURL(data => {
        RNFS.writeFile(
          RNFS.CachesDirectoryPath + '/some-name.png',
          data,
          'base64',
        ).then(success => {
          // console.log('url:::', RNFS.CachesDirectoryPath + '/some-name.png');
          //保存图片
          saveImg(RNFS.CachesDirectoryPath + '/some-name.png');
        });
      });
  }, []);

  const copyFunc = useCallback(() => {
    Clipboard.setString(token);
    Toast.show('Copy Success');
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.qrCodeContainer}>
          <QRCode
            getRef={r => {
              svg.current = r;
            }}
            size={220}
            value={token}
            logo={logoFromFile}
            logoSize={50}
            logoBackgroundColor="transparent"
          />
        </View>

        <TouchableOpacity onPress={copyFunc} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Copy address</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={saveQrToDisk} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Save Picture</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
    },
    contentContainer: {
      width: 345,
      marginHorizontal: 15,
      alignItems: 'center',
      backgroundColor: theme.c_FFFFFF_111717,
      justifyContent: 'center',
      paddingBottom: 50,
      paddingTop: 55,
      borderRadius: 12,
    },
    qrCodeContainer: {
      padding: 15,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#4E586E',
    },
    buttonContainer: {
      width: 260,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.c_F8F9FD_000000,
      marginTop: 20,
      borderRadius: 20,
    },
    buttonText: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
    },
  });
export default ReceivingCode;
