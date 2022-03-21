'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */
import {NativeModules} from 'react-native';
import Constants from '../../shared/Constants';

export function createChannelMethod() {
  //TODO
  Constants.isAndroid &&
    NativeModules.Photon.createChannelMethod().then(res => {
      console.log('res:::', res);
    });
}
