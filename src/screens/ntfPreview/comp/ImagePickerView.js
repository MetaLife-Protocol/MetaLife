'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useStyle} from '../../../metalife-base';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-tiny-toast';
import {uploadImageToIFPS, uploadNftAssetsJson} from '../../../remote/ipfsOP';
import {uploadFileToIFPS} from '../../nft/nftUtils';
import LoadingView from '../../../shared/comps/LoadingView';

const ImagePickerView = ({style, onImagePicker}) => {
  const styles = useStyle(createSty);

  const [image, setImage] = useState();
  const [showLoading, setShowLoading] = useState(false);

  const cameraHandler = useCallback(
    async ({didCancel, errorCode, errorMessage, assets}) => {
      // console.log('ddddddddddd', errorCode, errorMessage, assets);
      if (errorCode || didCancel) {
        return errorCode && Toast.show(errorMessage);
      }
      setShowLoading(true);
      const [file] = assets;
      // console.log('file::', file);
      const res = await uploadNftAssetsJson({
        fileName: file.fileName,
        filepath: file.uri,
        fileType: file.type,
      });
      // console.log('res::', res);
      onImagePicker && onImagePicker(res.IpfsHash);
      setImage(file);
      setShowLoading(false);
    },
    [onImagePicker],
  );

  const imagePicker = useCallback(() => {
    launchImageLibrary(
      {
        cameraType: 'front',
        maxHeight: 1920,
        maxWidth: 1080,
        quality: 0.88,
        mediaType: 'mixed',
        selectionLimit: 1,
      },
      cameraHandler,
    );
  }, [cameraHandler]);

  if (image) {
    return (
      <Image source={{uri: image.uri}} style={[styles.container, style]} />
    );
  }
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={imagePicker}>
      <Image
        source={require('../../../assets/image/nft/nft_add_icon.png')}
        style={styles.addIcon}
      />
      {showLoading && <LoadingView width={style.width} height={style.height} />}
    </TouchableOpacity>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      marginTop: 10,
      backgroundColor: theme.c_FFFFFF_111717,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addIcon: {width: 30, height: 30},
  });
export default ImagePickerView;
