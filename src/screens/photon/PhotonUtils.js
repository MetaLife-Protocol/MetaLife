'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */
import React from 'react';
import PhotonUrl from './PhotonUrl';
import {NormalDialog} from '../../metalife-base';
import {
  photonSettleChannel,
  photonStop,
  startPhotonServer,
  subscribePhoton,
  unsubscribePhoton,
} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';
import {store} from '../../store/configureStore';
import {getCurrentAccount} from '../../utils';
import PasswordDialog from '../tabs/profiles/wallet/modal/PasswordDialog';
import {exportAccountPrivateKey} from '../../remote/wallet/WalletAPI';
import {bindIDAndWallet, pubHostByIp} from '../../remote/pubOP';
import {sddsafsadf, yjggfjgjghfg} from '../../store/Foo';

export function startPhoton({
  dialog,
  wallet,
  navigate,
  directToNetworkPage = true,
}) {
  const currentAccount = getCurrentAccount(wallet);
  const toastOption = {
    position: Toast.position.TOP,
  };
  if (currentAccount?.type !== 'spectrum') {
    Toast.show('photon is only used in spectrum chain', toastOption);
    return;
  }

  yjggfjgjghfg(currentAccount.address, (success, res) => {
    if (success && res) {
      initPhoton({
        privateKey: res,
        address: currentAccount?.address,
        directToNetworkPage: directToNetworkPage,
        navigate: navigate,
      });
    } else {
      dialog.show(
        <PasswordDialog
          onConfirm={pw => {
            if (!currentAccount?.address) {
              Toast.show('Wallet does not exist!', toastOption);
              return;
            }
            dialog.showLoading();
            exportAccountPrivateKey(
              currentAccount.address,
              pw,
              (isExit, res) => {
                dialog.hideLoading();
                if (isExit) {
                  dialog.dismiss();
                  sddsafsadf(currentAccount.address, res);
                  initPhoton({
                    privateKey: res,
                    address: currentAccount?.address,
                    directToNetworkPage: directToNetworkPage,
                    navigate: navigate,
                  });
                } else {
                  dialog.showToast('Wrong password!');
                }
              },
            );
          }}
        />,
      );
    }
  });
}

export function initPhoton({
  privateKey,
  address,
  directToNetworkPage = false,
  navigate,
}) {
  Toast.show('Photon init...', {
    loading: true,
    position: Toast.position.CENTER,
  });
  if (privateKey.startsWith('0x')) {
    privateKey = privateKey.substring(2);
  }
  if (!address.startsWith('0x')) {
    address = '0x' + address;
  }

  console.log('address:', address);

  /**
   * 公链节点host,http协议 默认：http://transport01.smartmesh.cn:44444
   * ethRPCEndPoint: 'https://jsonapi1.smartmesh.cn',
   */
  startPhotonServer({
    privateKey: privateKey,
    address: address,
    ethRPCEndPoint: 'https://jsonapi1.smartmesh.io',
  })
    .then(res => {
      Toast.hide();
      if (res?.logFile) {
        subscribePhoton();
        const {photon, user} = store.getState();
        console.log('res:::', res);
        if (!photon?.photonLogined) {
          //photon is local first login
          pubHostByIp()
            .then(value =>
              value.json().then(({data}) =>
                bindIDAndWallet(
                  data.first_choice_pub_host,
                  {
                    client_id: user.feedId,
                    client_eth_address: address,
                  },
                  resp =>
                    Toast.show('bind pub ' + resp.data, {
                      position: Toast.position.BOTTOM,
                    }),
                ),
              ),
            )
            .catch(console.warn);
        }
        store.dispatch({type: 'setPhotonLogin', payload: res.logFile});
        if (directToNetworkPage && navigate) {
          navigate('PhotonNetwork');
        }
      }
    })
    .catch(e => {
      Toast.hide();
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
  } else if (
    PhotonUrl.PHOTON_MLT_TOKEN_ADDRESS === photonTokenAddress.toLowerCase()
  ) {
    tokenSymbol = 'MLT';
  }
  return tokenSymbol;
}

export function getTokenAddress(symbol) {
  let address = PhotonUrl.PHOTON_SMT_TOKEN_ADDRESS;
  if (symbol === 'MLT') {
    address = PhotonUrl.PHOTON_MLT_TOKEN_ADDRESS;
  } else if (symbol === 'MESH') {
    address = PhotonUrl.PHOTON_MESH_TOKEN_ADDRESS;
  }
  return address;
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

export function stopCurrentPhoton() {
  unsubscribePhoton(); // 取消光子订阅通知
  photonStop();
  store.dispatch({type: 'resetPhoton'});
}
