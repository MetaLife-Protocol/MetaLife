'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */
import React from 'react';
import PhotonUrl from './PhotonUrl';
import {NormalDialog} from '../../metalife-base';
import {photonSettleChannel, startPhotonServer} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';
import {store} from '../../store/configureStore';

export function initPhoton({privateKey, address}) {
  //TODO isLogin  & has wallet
  startPhotonServer({
    privateKey:
      '0f82bb8f558af8e5b57b7d05159665a8f9175322e42a7093286974a7758c41be',
    // privateKey: privateKey,
    // address: address,
    address: '0x096F7368bC01f438f8De8775DAFD71a566413C6f',
    ethRPCEndPoint: '', //公链节点host,http协议 默认：http://transport01.smartmesh.cn:44444
    // ethRPCEndPoint: 'https://jsonapi1.smartmesh.cn',
  })
    .then(res => {
      console.log('res:::', res);
      if (res?.logFile) {
        store.dispatch({type: 'setPhotonLogin', payload: res.logFile});
      }
    })
    .catch(e => {
      console.log('initPhoton e:::', e);
      Toast.show(e.toString());
    });
}

/**
 * photon token symbol
 */
export function getPhotonTokenSymbol(photonTokenAddress = '') {
  let tokenSymbol = 'SMT';
  if (PhotonUrl.PHOTON_SMT_TOKEN_ADDRESS === photonTokenAddress.toLowerCase()) {
    tokenSymbol = 'SMT';
  } else if (
    PhotonUrl.PHOTON_MESH_TOKEN_ADDRESS === photonTokenAddress.toLowerCase()
  ) {
    tokenSymbol = 'MESH';
  }
  return tokenSymbol;
}

/**
 *
 * @param dialog
 * @param channelIdentifier
 */
export function settleChannelDialog(dialog, channelIdentifier) {
  dialog.show(
    <NormalDialog
      title={'Settle the channel?'}
      content={
        '*Settle channel consumes Gas：approximately 0.002 SMT,Because it is on chain transaction, it takes a certain amount of time.'
      }
      onConfirm={() => {
        photonSettleChannel(channelIdentifier)
          .then(res => {
            const resJson = JSON.parse(res);
            if (resJson.error_code === 0) {
              //  TODO
              Toast.show('success');
            } else {
              Toast.show(resJson.error_message + '');
            }
            console.log('settleChannelDialog success::res::', res);
          })
          .catch(e => {
            console.log('settleChannelDialog success::err::', e);
          });
      }}
    />,
  );
}
