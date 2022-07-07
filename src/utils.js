import {
  Keyboard,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Dimensions,
  NativeModules,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
import Toast from 'react-native-tiny-toast';
import {stopCurrentPhoton} from './screens/photon/PhotonUtils';
import {Buffer} from 'buffer';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

let screenWidth = Dimensions.get('window').width;
let screenH = Dimensions.get('window').height;
let androidScreenHeight =
  Dimensions.get('window').height / Dimensions.get('window').width > 1.8
    ? screenH + NativeModules.StatusBarManager.HEIGHT
    : screenH; //适配安卓全面屏
let screenHeight = Platform.OS == 'android' ? androidScreenHeight : screenH;

// 设计稿宽度
const DISING_WIDTH = 750;
const X_WIDTH = 375;
const X_HEIGHT = 812;
/**
 * 屏幕尺寸适配
 * @param {*} size
 */
export const pxToDp = size => {
  return size * (screenWidth / X_WIDTH);
};
/**
 * px 转换dp
 * @param {*} targetPX
 */
export const pxAndDp = targetPX => {
  return (screenWidth * targetPX) / DISING_WIDTH;
};

/**
 *
 * 字体大小适配
 */
export function setSpText(size: Number) {
  // return (size * widthScale) * fontScale;
  return size * (screenWidth / X_WIDTH);
}
// iPhoneX 以上的机型

export function isIphoneX_Up() {
  return (
    Platform.OS === 'ios' &&
    ((screenHeight >= X_HEIGHT && screenWidth >= X_WIDTH) ||
      (screenHeight >= X_WIDTH && screenWidth >= X_HEIGHT))
  );
}

//状态栏高度
const StatusBarHeight =
  Platform.OS === 'android' ? StatusBar.currentHeight : getStatusBarHeight();

export {screenHeight, screenWidth, StatusBarHeight};

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
export function checkPubExist(pub, which) {
  return pub.some(pub => pub.content.address.key === which.key);
}

/*************************** wallet ***************************/
export function checkSum(add) {
  return Buffer.from(add, 'hex');
}

export function shuffle(mnemonic) {
  let cMne = mnemonic.split(' '),
    res = [];
  while (cMne.length > 0) {
    let index = Math.floor(Math.random() * cMne.length);
    res.push(cMne.splice(index, 1)[0]);
  }
  return res;
}

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
    (wallet.accounts[wallet.current.type] &&
      wallet.accounts[wallet.current.type][wallet.current.index].balance) ||
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

/**
 * 关闭钱包账户相关
 */
export function stopAboutWalletAccount() {
  stopCurrentPhoton();
}
