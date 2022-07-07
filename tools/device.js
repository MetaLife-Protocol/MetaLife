import {Dimensions, NativeModules, Platform, StatusBar} from 'react-native';
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
