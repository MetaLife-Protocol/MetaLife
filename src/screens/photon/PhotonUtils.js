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
import {getCurrentAccount} from '../../utils';
import PasswordDialog from '../tabs/profiles/wallet/modal/PasswordDialog';
import {getAccount} from '../../remote/wallet/WalletAPI';
import {exportPrivateKeyFromKeystore} from 'react-native-web3-wallet';

export function startPhoton({
  dialog,
  wallet,
  navigate,
  directToNetworkPage = true,
}) {
  const currentAccount = getCurrentAccount(wallet);
  console.log('currentAccount::', currentAccount);
  if (currentAccount?.type !== 'spectrum') {
    Toast.show('photon is only used in spectrum chain');
    return;
  }

  dialog.show(
    <PasswordDialog
      onConfirm={pw => {
        console.log('pw::', pw);
        if (!currentAccount?.address) {
          Toast.show('Wallet does not exist!');
          dialog.dismiss();
          return;
        }
        getAccount(currentAccount?.address, (isExit, keystore) => {
          if (isExit) {
            console.log('keystore::', keystore);
            exportPrivateKeyFromKeystore(JSON.stringify(keystore), pw)
              .then(res => {
                console.log('private Key res::::', res);
                dialog.dismiss();
                initPhoton({
                  privateKey: res,
                  address: currentAccount?.address,
                  directToNetworkPage: directToNetworkPage,
                  navigate: navigate,
                });
              })
              .catch(error => {
                console.warn(error);
                // cb && cb(false);
              });
          }
        });
      }}
    />,
  );
}

export function initPhoton({
  privateKey,
  address,
  directToNetworkPage = false,
  navigate,
}) {
  //TODO isLogin  & has wallet
  if (privateKey.startsWith('0x')) {
    privateKey = privateKey.substring(2);
  }
  if (!privateKey.startsWith('0x')) {
    address = '0x' + address;
  }

  console.log('privateKey:', privateKey);
  console.log('address:', address);
  startPhotonServer({
    // privateKey:
    //   '0f82bb8f558af8e5b57b7d05159665a8f9175322e42a7093286974a7758c41be',
    privateKey: privateKey,
    address: address,
    // address: '0x096F7368bC01f438f8De8775DAFD71a566413C6f',
    ethRPCEndPoint: '', //公链节点host,http协议 默认：http://transport01.smartmesh.cn:44444
    // ethRPCEndPoint: 'https://jsonapi1.smartmesh.cn',
  })
    .then(res => {
      console.log('res:::', res);
      if (res?.logFile) {
        store.dispatch({type: 'setPhotonLogin', payload: res.logFile});
        if (directToNetworkPage && navigate) {
          navigate('PhotonNetwork');
        }
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
