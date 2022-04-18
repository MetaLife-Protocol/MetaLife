'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useStyle} from 'metalife-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import CameraMarkerView from './comps/CameraMarkerView';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../../shared/Constants';
import FlashLightButton from './comps/FlashLightButton';

const Scan = () => {
  const {onCallbackData} = useRoute().params ?? {};
  const styles = useStyle(createSty);
  const navigation = useNavigation();

  const [flashMode, setFlashMode] = useState(false);
  const qrRef = useRef();
  const cameraRef = useRef();

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Pressable onPress={() => {}}>
  //         <Image
  //           source={require('../../../assets/image/photon/photon_more.png')}
  //           style={styles.moreImg}
  //         />
  //       </Pressable>
  //     ),
  //   });
  // }, [navigation, styles.moreImg]);
  useEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      //   <Pressable
      //     onPress={() => {
      //       console.log('this.camera:', this.camera);
      //       cameraRef.current
      //         .takePhoto({
      //           flash: 'on',
      //         })
      //         .then(res => {
      //           console.log('res::', res);
      //         });
      //     }}
      //     style={{width: 60, height: 30, backgroundColor: 'yellow'}}>
      //     <RNCamera
      //       ref={cameraRef}
      //       cameraProps={{
      //         ref: ref => {
      //           this.camera = ref;
      //         },
      //         photo: true,
      //       }}
      //       // onRead={async result => {
      //       //   if (cameraRef.current) {
      //       //     const options = {
      //       //       quality: 0.9,
      //       //       base64: true,
      //       //       skipProcessing: true,
      //       //     };
      //       //     const data = await this.camera.takePictureAsync(options); // this is photo data with file uri and base64
      //       //   }
      //       // }}
      //     />
      //   </Pressable>
      // ),
    });
  }, [navigation, styles.moreImg]);

  async function onResult(result) {
    if (this.camera) {
      const options = {quality: 0.9, base64: true, skipProcessing: true};
      const data = await this.camera.takePictureAsync(options); // this is photo data with file uri and base64
    }
  }

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
  });
export default Scan;
