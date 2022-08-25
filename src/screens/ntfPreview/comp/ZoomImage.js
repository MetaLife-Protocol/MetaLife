import ImageViewer from 'react-native-image-zoom-viewer';
import {Modal, Platform} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {getRandomPathName, savePicture} from '../../../utils';
import RNFS from 'react-native-fs';

const ZoomImage = ({image, visible, setIsVisible}) => {
  const imgs = [{url: image}];
  function saveHandler(url) {
    let path;
    Platform.OS === 'ios'
      ? savePicture(url, 'photo', 'MetaLife', r => {
          console.log('photo saved in: ', r);
        })
      : RNFS.downloadFile({
          fromUrl: url,
          background: false,
          toFile: (path = getRandomPathName()),
        }).promise.then(_ =>
          savePicture(path, 'photo', 'MetaLife', r =>
            console.log('photo saved in: ', r),
          ),
        );
  }
  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        enableSwipeDown={true}
        useNativeDriver={true}
        onSwipeDown={() => setIsVisible(false)}
        onClick={() => setIsVisible(false)}
        onSave={saveHandler}
        imageUrls={imgs}
      />
    </Modal>
  );
};

export default ZoomImage;
