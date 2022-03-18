'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */

import React, {useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import CameraMarkerView from './comps/CameraMarkerView';

const Scan = ({}) => {
  const {flex1, BG} = SchemaStyles(),
    {container} = styles;
  const [scanData, setScanData] = useState('');

  const qrRef = useRef();
  return (
    <QRCodeScanner
      ref={qrRef}
      showMarker={true}
      onRead={res => {
        console.log('res::', res);
        if (res.data) {
          setScanData(res.data);
        }
      }}
      customMarker={<CameraMarkerView />}
      fadeIn={false}
      // flashMode={RNCamera.Constants.FlashMode.auto}
      cameraProps={{flashMode: RNCamera.Constants.FlashMode.off}}
      reactivate={true}
      topContent={<Text style={styles.centerText}>{scanData}</Text>}
      // bottomContent={
      //   <TouchableOpacity
      //     style={styles.buttonTouchable}
      //     onPress={() => {
      //       // qrRef.current.reactivate();
      //     }}>
      //     <Text style={styles.buttonText}>OK. Got it!</Text>
      //   </TouchableOpacity>
      // }
    />
  );
};
const styles = StyleSheet.create({
  container: {},
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
export default Scan;
