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
import RNFS from 'react-native-fs';
import {
  zip,
  unzip,
  zipWithPassword,
  unzipWithPassword,
} from 'react-native-zip-archive';
import {Platform} from 'react-native';
import axios from 'axios';
import FormData from 'form-data';

export function startPhoton({
  dialog,
  wallet,
  navigate,
  directToNetworkPage = true,
}) {
  const currentAccount = getCurrentAccount(wallet);
  if (currentAccount?.observer) return;
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
        console.log('startPhotonServer', res);
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
        photonSettleChannel({channelIdentifierHashStr: channelIdentifier})
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
  const {photon} = store.getState();
  if (!photon.isPhotonLogin) return;
  // 取消光子订阅通知
  unsubscribePhoton()
    .then(() => {
      photonStop().catch(e => console.log('stop', e));
      store.dispatch({type: 'resetPhoton'});
    })
    .catch(e => {
      console.log('unsubscribePhoton-error', e);
      photonStop().catch(err => console.log('stop', err));
      store.dispatch({type: 'resetPhoton'});
    });
}

export const uploadPhotonDB = (address, feedId) => {
  const iosPath = RNFS.DocumentDirectoryPath + '/raiden/data/';
  const androidPath = RNFS.DocumentDirectoryPath + '/ethereum/photonData/';
  const dbPath = Platform.OS === 'ios' ? iosPath : androidPath;
  const zipPath =
    RNFS.DocumentDirectoryPath +
    (Platform.OS === 'ios' ? '/raiden/' : '/ethereum/') +
    address +
    '.zip';
  zip(dbPath, zipPath)
    // zipWithPassword(dbPath, zipPath, feedId)
    .then(path => {
      console.log('zipWithPassword completed at', path);
      RNFS.stat(path)
        .then(stat => {
          console.log('info', stat);
          const filePath =
            Platform.OS === 'ios' ? stat.path : 'file://' + stat.path;
          const uploadUrl =
            'http://39.107.236.158:10087/cloud-server/api/upload';
          const form = new FormData();

          form.append(
            'uploadfile',
            {uri: filePath, name: address + '.zip', type: 'application/zip'},
            {
              filepath: encodeURIComponent(filePath),
            },
          );
          axios
            .post(uploadUrl, form, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(res => {
              console.log('sssss', res.data);
              if (res.data.indexOf('success') !== -1) {
                // 上传成功
                RNFS.unlink(zipPath)
                  .then(() => {
                    console.log('delete success');
                  })
                  .catch(e => {
                    console.log('unlink-error', e);
                  });
              }
            })
            .catch(e => {
              console.log('axios-error', e);
            });
        })
        .catch(e => {
          console.log('RNFS.stat-error', e);
        });
    })
    .catch(e => {
      console.log('zip-error', e);
    });
};

export const downloadPhotonDB = (address, feedId) => {
  const iosPath = RNFS.DocumentDirectoryPath + '/raiden/data/';
  const androidPath = RNFS.DocumentDirectoryPath + '/ethereum/photonData/';
  const path = Platform.OS === 'ios' ? iosPath : androidPath;
  const dbPath =
    RNFS.DocumentDirectoryPath +
    (Platform.OS === 'ios' ? '/raiden/' : '/ethereum/') +
    address +
    '.zip';
  const upzipPath = path + address + '/';
  axios
    .post('http://39.107.236.158:10087/cloud-server/api/download/' + address)
    .then(res => {
      console.log('res', JSON.stringify(res));
      const data = res.data;
      if (!data) return;
      // 重新导入账号时没有文件夹目录的，要先创建
      console.log('path', path);
      RNFS.mkdir(path)
        .then(() => {
          RNFS.writeFile(dbPath, data, 'base64')
            .then(() => {
              unzip(dbPath, upzipPath)
                // unzipWithPassword(dbPath, upzipPath, feedId)
                .then(unzipedPath => {
                  console.log('unzip completed at ', unzipedPath);
                  // 解压成功，删除压缩包
                  RNFS.unlink(dbPath)
                    .then(() => {
                      console.log('delete success');
                    })
                    .catch(e => {
                      console.log('unlink-error', e);
                    });
                })
                .catch(e => {
                  console.log('unzip-error', e);
                });
            })
            .catch(e => {
              console.log('RNFS.writeFile-error', e);
            });
        })
        .catch(e => {
          console.log('RNFS.mkdir-err', e);
        });
    })
    .catch(e => {
      console.log('get db error', e);
    });
};
