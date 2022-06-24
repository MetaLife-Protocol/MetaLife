'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {useStyle} from '../../../metalife-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import CameraMarkerView from './comps/CameraMarkerView';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../../shared/Constants';
import FlashLightButton from './comps/FlashLightButton';
import {launchImageLibrary} from 'react-native-image-picker';
import LocalBarcodeRecognizer from 'react-native-local-barcode-recognizer';

const Scan = () => {
  const {onCallbackData} = useRoute().params ?? {};
  const styles = useStyle(createSty);
  const navigation = useNavigation();

  const [flashMode, setFlashMode] = useState(false);
  const qrRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            // const options = {quality: 0.9, base64: true, skipProcessing: true};
            // console.log('cameraRef.current:', cameraRef.current);
            // cameraRef.current &&
            //   cameraRef.current.takePictureAsync(options).then(res => {
            //     console.log('camera photo res:', res);
            //   });
            // RNCamera.takePictureAsync();
            launchImageLibrary({
              maxHeight: 1920,
              maxWidth: 1080,
              quality: 0.88,
              mediaType: 'photo',
              includeBase64: true,
              selectionLimit: 1,
            }).then(res => {
              const base64 = res?.assets?.[0]?.base64 ?? '';
              console.log('res uri::', res);
              // QRreader(uri)
              //   .then(data => {
              //     console.log('QRreader::', data);
              //   })
              //   .catch(err => {
              //     console.log('识别失败');
              //   });
              LocalBarcodeRecognizer.decode(
                base64.replace('data:image/jpeg;base64,', ''),
                {codeTypes: ['ean13', 'qr']},
              ).then(qrUri => {
                console.log('qrUri uri::', qrUri);
                if (qrUri) {
                  onCallbackData && onCallbackData(qrUri);
                  navigation.goBack();
                }
              });
              // alert('识别结果：'+result);
            });
          }}>
          <Image
            source={require('../../../assets/image/icons/icon_scan_photo.png')}
            style={styles.photoImg}
          />
        </Pressable>
      ),
    });
  }, [navigation, styles.photoImg]);

  const onQrCallBack = useCallback(
    res => {
      if (res.data) {
        console.log('res::', res);
        onCallbackData && onCallbackData(res.data);
        navigation.goBack();
      }
    },
    [navigation, onCallbackData],
  );

  return (
    <View style={styles.container}>
      <QRCodeScanner
        ref={qrRef}
        showMarker={true}
        onRead={onQrCallBack}
        customMarker={<CameraMarkerView />}
        fadeIn={false}
        cameraProps={{
          ref: cameraRef,
          flashMode: flashMode
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off,
        }}
        reactivate={false}
        cameraStyle={{height: Constants.screenHeight}}
        bottomContent={
          <FlashLightButton
            onPress={() => {
              setFlashMode(pre => {
                setFlashMode(!pre);
              });
            }}
          />
        }
      />
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      height: Constants.screenHeight,
    },
    photoImg: {
      width: 20,
      height: 19,
      tintColor: 'white',
    },
  });
export default Scan;
