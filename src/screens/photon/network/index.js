'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../shared/comps/ComText';
import {useDialog, useStyle} from '../../../metalife-base';
import PhotonAccountInfoCard from './comps/PhotonAccountInfoCard';
import {useNavigation} from '@react-navigation/native';
import PhotonListItemView from './comps/PhotonListItemView';
import {
  getBalanceFromPhoton,
  loadChannelList,
  switchNetwork,
  updateMeshNetworkNodes,
} from 'react-native-photon';
import {connect} from 'react-redux';
import {fixWalletAddress, getCurrentAccount} from '../../../utils';
import PhotonUrl from '../PhotonUrl';
import {uploadPhotonLogDialog} from './hooks';
import {PhotonEvent, TxStatus, TxType} from '../PhotonNotifyContants';
import Toast from 'react-native-tiny-toast';
import {ips, zeroconf} from '../../../listener/ip/ZeroConf';
import {uploadPhotonDB} from '../PhotonUtils';

const PhotonNetwork = ({
  user: {feedId},
  channelRemark,
  wallet,
  showPullMenu,
  noInternet,
  switchNoInternet,
  photon,
  initPhotonBalance,
  updatePhotonBalance,
}) => {
  const styles = useStyle(createSty);
  const [balances, setBalances] = useState([]),
    [channelList, setChannelList] = useState([]),
    [refreshing, setRefreshing] = useState(true);
  const dialog = useDialog();
  const [walletBalance, setWalletBalance] = useState({});
  const navigation = useNavigation();
  const {address} = getCurrentAccount(wallet);
  const addressAlias = address.slice(0, 8);
  function goScreen(name, params) {
    navigation.navigate(name, params);
  }
  const showToast = message => {
    Toast.show(message, {position: Toast.position.CENTER});
  };
  function menuHandler(e) {
    e.target.measure((x, y, width, height, pageX, pageY) =>
      showPullMenu({
        position: {
          x: pageX - width - 110,
          y: pageY + height,
        },
        buttons: [
          {
            title: 'QR code',
            handler: () => {
              const currentAccount = getCurrentAccount(wallet);
              goScreen('ReceivingCode', {
                token: fixWalletAddress(currentAccount.address),
              });
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Create channel',
            handler: () => {
              goScreen('CreateChannel', {walletBalance});
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Transaction record',
            handler: () => {
              goScreen('PhotonTransactionRecord');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Pay',
            handler: () => {
              goScreen('Payment');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Upload log',
            handler: () => {
              uploadPhotonLogDialog({dialog});
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      }),
    );
  }
  useEffect(() => {
    const name = '0x' + address;
    if (noInternet) {
      switchNetwork(true).then(() => {
        zeroconf.publishService('metalife', 'tcp', '', name, 50001, {});
        zeroconf.scan('metalife', 'tcp', '');
        zeroconf.on('resolved', res => {
          if (!ips.has(res.name)) {
            if (name !== res.name) {
              let ip;
              for (let i = 0; i < res.addresses.length; i++) {
                const item = res.addresses[i];
                if (item.indexOf('.')) {
                  ip = item;
                  break;
                }
              }
              ips.set(res.name, ip);
              updateMeshNetworkNodes(
                JSON.stringify([
                  {
                    address: res.name,
                    ip_port: res.addresses[0] + ':' + 40001,
                  },
                ]),
              );
            }
          }
        });
      });
    } else {
      switchNetwork(false).then(() => {
        zeroconf.removeAllListeners();
        zeroconf.stop();
        zeroconf.unpublishService(name);
        ips.clear();
      });
    }
  }, [noInternet]);

  //set tabBar right more icon
  useLayoutEffect(() => {
    // navigationOptions;
    navigation.setOptions({
      headerRight: () => (
        <>
          <Pressable
            style={styles.dotContainer}
            onPress={() => {
              switchNoInternet(!noInternet);
            }}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: noInternet ? '#4E586E' : '#64D39F',
                },
              ]}
            />
            <Text style={styles.lineText}>
              {noInternet ? 'Offline' : 'Online'}
            </Text>
          </Pressable>
          <Pressable onPress={menuHandler}>
            <Image
              source={require('../../../assets/image/photon/photon_more.png')}
              style={styles.moreImg}
            />
          </Pressable>
        </>
      ),
    });
  }, [navigation, styles.moreImg, walletBalance, noInternet, styles.lineText]);

  const getBalance = () => {
    const balanceSMT = getBalanceFromPhoton(PhotonUrl.PHOTON_SMT_TOKEN_ADDRESS);
    const balanceMLT = getBalanceFromPhoton(PhotonUrl.PHOTON_MLT_TOKEN_ADDRESS);
    Promise.all([balanceSMT, balanceMLT]).then(values => {
      const jsonSMTRes = JSON.parse(values[0]);
      const jsonMLTRes = JSON.parse(values[1]);
      // console.log('jsonSMTRes balance:::', jsonSMTRes);
      // console.log('jsonMLTRes balance:::', jsonMLTRes);
      let getBalances = [];
      let balanceData = {};
      if (jsonSMTRes.error_code === 0) {
        const array = jsonSMTRes.data;
        if (array && array.length) {
          getBalances.push(array[0]);
          balanceData.SMT = array[0];
        }
      }
      if (jsonMLTRes.error_code === 0) {
        const array = jsonMLTRes.data;
        if (array && array.length) {
          getBalances.push(array[0]);
          balanceData.MLT = array[0];
        }
      }
      setRefreshing(false);
      setBalances(getBalances);
      setWalletBalance(balanceData);
    });
  };

  const getChannelList = () => {
    loadChannelList().then(res => {
      const jsonRes = JSON.parse(res);
      // console.log('loadChannelList:::', jsonRes);
      if (jsonRes.error_code === 0) {
        const array = jsonRes.data;
        if (array && array.length) {
          setChannelList(array);
        }
        setRefreshing(false);
      }
    });
  };

  useEffect(() => {
    if (refreshing) {
      getBalance();
      getChannelList();
    }
  }, [refreshing]);

  useEffect(() => {
    if (
      !walletBalance?.SMT?.balance_in_photon ||
      !walletBalance?.MLT?.balance_in_photon
    ) {
      return;
    }
    // 不存在
    if (!photon[addressAlias]) {
      initPhotonBalance({
        address: addressAlias,
        SMTInPhoton: walletBalance?.SMT?.balance_in_photon,
        MLTInPhoton: walletBalance?.MLT?.balance_in_photon,
      });
      uploadPhotonDB(photon.defaultAddress, feedId);
    } else {
      const timeNow = Date.now();
      const {SMTInPhoton, MLTInPhoton, uploadTime} = photon[addressAlias];
      const aWeek = 60 * 60 * 24 * 7 * 1000;
      if (
        SMTInPhoton !== walletBalance?.SMT?.balance_in_photon ||
        MLTInPhoton !== walletBalance?.MLT?.balance_in_photon
      ) {
        // 大于一星期
        if (timeNow - uploadTime > aWeek) {
          uploadPhotonDB(photon.defaultAddress, feedId);
          updatePhotonBalance({
            address: addressAlias,
            SMTInPhoton: walletBalance?.SMT?.balance_in_photon,
            MLTInPhoton: walletBalance?.MLT?.balance_in_photon,
            uploadTime: Date.now(),
          });
        }
      }
    }
  }, [
    photon[addressAlias],
    walletBalance?.SMT?.balance_in_photon,
    walletBalance?.MLT?.balance_in_photon,
  ]);

  useEffect(() => {
    //photonChange
    const channelListener = DeviceEventEmitter.addListener(
      PhotonEvent.channelChange,
      params => {
        if (params) {
          const {txType, txStatus, settleTimeOut} = params;
          if (txType === TxType.ChannelDeposit) {
            if (settleTimeOut > 0) {
              if (txStatus === TxStatus.failed) {
                showToast('Create Failed');
              } else {
                showToast('Create Success');
              }
            } else {
              if (txStatus === TxStatus.failed) {
                showToast('Deposit Failed');
              } else {
                showToast('Deposit Success');
              }
            }
          }
          if (txType === TxType.Withdraw) {
            if (txStatus === TxStatus.failed) {
              showToast('Withdraw Failed');
            } else {
              showToast('Withdraw Success');
            }
          }
          if (
            txType === TxType.ChannelSettle ||
            txType === TxType.CooperateSettle
          ) {
            showToast('Close Success');
          }
        }
        getChannelList();
      },
    );
    const balanceListener = DeviceEventEmitter.addListener(
      PhotonEvent.balanceChange,
      () => {
        getBalance();
      },
    );
    return () => {
      channelListener.remove();
      balanceListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <PhotonAccountInfoCard
        style={styles.topCard}
        balances={balances}
        currentAccount={getCurrentAccount(wallet)}
      />
      <View style={styles.channelListContainer}>
        <View style={styles.channelListTextContainer}>
          <Text style={styles.channelText}>Channel list</Text>
        </View>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            enabled={true}
            colors={['#29DAD7']}
            tintColor={'#29DAD7'}
            onRefresh={() => {
              setRefreshing(true);
            }}
          />
        }
        contentContainerStyle={styles.listContainer}
        data={channelList}
        renderItem={({item, index}) => (
          <PhotonListItemView
            setRefreshing={setRefreshing}
            data={item}
            channelRemarks={channelRemark}
            walletBalance={walletBalance}
          />
        )}
        keyExtractor={(item, index) => `list_${index}`}
      />
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 3,
    },
    lineText: {
      fontSize: 18,
      color: theme.c_000000_FFFFFF,
      marginRight: 20,
    },
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
    topCard: {marginTop: 20},
    moreImg: {width: 20, height: 20, tintColor: theme.c_000000_FFFFFF},
    channelListContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    channelListTextContainer: {
      height: 24,
      backgroundColor: theme.primary,
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
    },
    channelText: {fontSize: 14, lineHeight: 20, color: theme.black},
    listContainer: {
      paddingBottom: 25,
    },
  });

const msp = s => {
  return {
    user: s.user,
    channelRemark: s.photon.channelRemark,
    wallet: s.wallet,
    noInternet: s.photon.noInternet,
    photon: s.photon,
  };
};
const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
    switchNoInternet: () => d({type: 'switchNoInternet'}),
    initPhotonBalance: payload => d({type: 'initPhotonBalance', payload}),
    updatePhotonBalance: payload => d({type: 'updatePhotonBalance', payload}),
  };
};
export default connect(msp, mdp)(PhotonNetwork);
