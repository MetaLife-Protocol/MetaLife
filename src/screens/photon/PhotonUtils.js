'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */
import {NativeModules} from 'react-native';
import Constants from '../../shared/Constants';

/**
 * 启动服务
 */
export function startPhotonServer({privateKey, ethRPCEndPoint}) {
  //TODO
  Constants.isAndroid &&
    NativeModules.Photon.startPhotonServer(privateKey, ethRPCEndPoint).then(
      res => {
        console.log('res:::', res);
      },
    );
}

export function createChannelMethod() {
  //TODO
  Constants.isAndroid &&
    NativeModules.Photon.createChannelMethod().then(res => {
      console.log('res:::', res);
    });
}
