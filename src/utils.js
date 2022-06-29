import {Keyboard, PermissionsAndroid, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
import Toast from 'react-native-tiny-toast';

/**
 * Created on 22 Feb 2022 by lonmee
 */

export const localDate = timestamp => {
  const date = new Date(timestamp),
    time = date.toLocaleTimeString(),
    day = date.toLocaleDateString();
  return time + ' ' + day;
};

/*************************** wallet ***************************/
export function abbreviationAccount(addr, pre, post) {
  return addr ? '0x' + addr.substring(0, pre) + '...' + addr.substr(-post) : '';
}

export function getCurrentAccount(wallet) {
  return (
    (wallet.accounts[wallet.current.type] &&
      wallet.accounts[wallet.current.type][wallet.current.index]) ||
    {}
  );
}

export function fixWalletAddress(address) {
  if (!address.startsWith('0x')) {
    address = '0x' + address;
  }
  return address;
}

export function getCurrentBalance(wallet) {
  return (
    (wallet.balance[wallet.current.type] &&
      wallet.balance[wallet.current.type][wallet.current.index]) ||
    0
  );
}

export function cameraHandler(submit) {
  ImagePicker.openCamera({
    cropping: false,
    multiple: false,
    compressImageMaxWidth: 1080,
    compressImageMaxHeight: 1920,
    compressImageQuality: 0.88,
    mediaType: 'photo',
  })
    .then(submit)
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
    .then(submit)
    .catch(null);
}

export function cameraHandlerWithCrop(submit) {
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

export function photoHandlerWithCrop(submit) {
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

export function getRandomPathName() {
  return `${RNFS.ExternalDirectoryPath}/${(Math.random() * 10e6) | 0}.png`;
}

export function saveImg(img) {
  // console.log('saveImg', img);
  const promise = CameraRoll.saveToCameraRoll(img);
  promise
    .then(function (result) {
      // alert('保存成功！地址如下：\n' + result);
      Toast.show('Save Success');
    })
    .catch(function (error) {
      // alert('保存失败！\n' + error);
      Toast.show('Save Fail');
    });
}
export const restrict = event => {
  const regex = new RegExp('^[a-zA-Z]+$');
  const key = String.fromCharCode(
    !event.charCode ? event.which : event.charCode,
  );
  if (!regex.test(key)) {
    event.preventDefault();
    return false;
  }
};
