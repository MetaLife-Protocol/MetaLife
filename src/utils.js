import {Keyboard, PermissionsAndroid, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import CameraRoll from '@react-native-community/cameraroll';

/**
 * Created on 22 Feb 2022 by lonmee
 */

export const localDate = timestamp => {
  const date = new Date(timestamp),
    time = date.toLocaleTimeString(),
    day = date.toLocaleDateString();
  return time + ' ' + day;
};

export function cameraHandler(submit) {
  ImagePicker.openCamera({
    cropping: false,
    multiple: false,
    compressImageMaxWidth: 1080,
    compressImageMaxHeight: 1920,
    compressImageQuality: 0.88,
    mediaType: 'photo',
  })
    .then(r => ImagePicker.openCropper({path: r.path}).then(submit))
    .catch(null);
}

export function photoHandler(submit) {
  Keyboard.dismiss();
  ImagePicker.openPicker({
    cropping: false,
    multiple: false,
    compressImageMaxWidth: 1080,
    compressImageMaxHeight: 1920,
    compressImageQuality: 0.88,
    mediaType: 'photo',
  })
    .then(r => ImagePicker.openCropper({path: r.path}).then(submit))
    .catch(null);
}

export async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

export async function savePicture(tag, type, album, cb) {
  if (Platform.OS === 'android' && !hasAndroidPermission()) {
    return;
  }

  CameraRoll.save(tag, {type, album}).then(r => cb && cb(r));
}
