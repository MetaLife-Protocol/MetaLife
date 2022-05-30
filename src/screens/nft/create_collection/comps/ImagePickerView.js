'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useStyle} from 'metalife-base';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-tiny-toast';

const ImagePickerView = ({style, onImagePicker}) => {
  const styles = useStyle(createSty);

  const [image, setImage] = useState();

  const cameraHandler = useCallback(
    ({didCancel, errorCode, errorMessage, assets}) => {
      if (errorCode || didCancel) {
        return errorCode && Toast.show(errorMessage);
      }
      const [file] = assets;
      // uploadFileToIFPS({
      //   fileName: file.fileName,
      //   filepath: file.uri,
      //   fileType: file.type,
      // });
      onImagePicker && onImagePicker(file);
      setImage(file);
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
        source={require('../../../../assets/image/nft/nft_add_icon.png')}
        style={styles.addIcon}
      />
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
