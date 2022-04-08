'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */
import React, {useCallback, useRef} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {loadChannelList} from 'react-native-photon';
import {ProfileView, useDialog} from 'metalife-base';

const ReceivingCode = ({}) => {
  const svg = useRef();
  const dialog = useDialog();

  let logoFromFile = require('../../../assets/image/contacts/nft_icon.png');

  const saveQrToDisk = useCallback(() => {
    // dialog.show('custom', <Text style={{color: 'red'}}>test</Text>);
    dialog.show(
      <ProfileView
        value={'testValue'}
        holderText={'testHolder'}
        submitHandler={v => {
          // dialog.dismiss();
          console.log('submitHandler::', v);
        }}
      />,
    );

    // startPhotonServer({
    //   privateKey:
    //     '0f82bb8f558af8e5b57b7d05159665a8f9175322e42a7093286974a7758c41be',
    //   ethRPCEndPoint: '',
    //   // ethRPCEndPoint: 'https://jsonapi1.smartmesh.cn',
    // });

    // console.log('svg.current::', svg.current);
    // svg.current &&
    //   svg.current.toDataURL(data => {
    //     RNFS.writeFile(
    //       RNFS.CachesDirectoryPath + '/some-name.png',
    //       data,
    //       'base64',
    //     )
    //       .then(success => {
    //         // console.log('url:::', RNFS.CachesDirectoryPath + '/some-name.png');
    //         //保存图片
    //         saveImg(RNFS.CachesDirectoryPath + '/some-name.png');
    //       })
    //       .then(() => {
    //         // this.setState({busy: false, imageSaved: true});
    //         // ToastAndroid.show('Saved to gallery !!', ToastAndroid.SHORT)
    //       });
    //   });
  }, []);

  const getChannelList = useCallback(() => {
    loadChannelList();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <QRCode
        getRef={r => {
          svg.current = r;
        }}
        size={220}
        value="Just some string value"
        // logo={{uri: base64Logo}}
        logo={logoFromFile}
        logoSize={50}
        logoBackgroundColor="transparent"
      />

      <TouchableOpacity
        onPress={saveQrToDisk}
        style={{backgroundColor: 'yellow', marginTop: 40}}>
        <Text>start photon</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={getChannelList}
        style={{backgroundColor: 'yellow', marginTop: 15}}>
        <Text>getChannelList</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default ReceivingCode;
