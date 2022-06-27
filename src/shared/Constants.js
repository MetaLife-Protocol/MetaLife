'use strict';

import {Dimensions, Platform} from 'react-native';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */

export default class Constants {
  static debug: boolean = __DEV__;
  static isAndroid: boolean = Platform.OS === 'android';
  static isIos: boolean = Platform.OS === 'ios';
  static screenWidth = Dimensions.get('window').width;
  static screenHeight = Dimensions.get('window').height;
  static bold: 'bold' | '500' = Constants.isAndroid ? 'bold' : '500';
  static safeBottom = 40;
}
