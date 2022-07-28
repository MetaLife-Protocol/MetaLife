'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
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
import {getBalanceFromPhoton, loadChannelList} from 'react-native-photon';
import {connect} from 'react-redux';
import {fixWalletAddress, getCurrentAccount} from '../../../utils';
import PhotonUrl from '../PhotonUrl';
import {uploadPhotonLogDialog} from './hooks';

const PhotonNetwork = ({channelRemark, wallet, showPullMenu}) => {
  const styles = useStyle(createSty);
  const [balances, setBalances] = useState([]),
    [channelList, setChannelList] = useState([]),
    [refreshing, setRefreshing] = useState(false);
  const dialog = useDialog();
  const [walletBalance, setWalletBalance] = useState({});
  const navigation = useNavigation();
  function goScreen(name, params) {
    navigation.navigate(name, params);
  }
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
                token: fixWalletAddress(currentAccount?.address),
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

  //set tabBar right more icon
  useLayoutEffect(() => {
    // navigationOptions;
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={menuHandler}>
          <Image
            source={require('../../../assets/image/photon/photon_more.png')}
            style={styles.moreImg}
          />
        </Pressable>
      ),
    });
  }, [navigation, styles.moreImg, walletBalance]);

  const getBalance = () => {
    const balanceSMT = getBalanceFromPhoton(PhotonUrl.PHOTON_SMT_TOKEN_ADDRESS);
    const balanceMLT = getBalanceFromPhoton(PhotonUrl.PHOTON_MLT_TOKEN_ADDRESS);
    Promise.all([balanceSMT, balanceMLT]).then(values => {
      const jsonSMTRes = JSON.parse(values[0]);
      const jsonMLTRes = JSON.parse(values[1]);
      console.log('jsonSMTRes balance:::', jsonSMTRes);
      console.log('jsonMLTRes balance:::', jsonMLTRes);
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
      console.log('loadChannelList:::', jsonRes);
      if (jsonRes.error_code === 0) {
        const array = jsonRes.data;
        if (array && array.length) {
          setChannelList(array);
        }
      }
    });
  };

  useEffect(() => {
    getBalance();
    getChannelList();
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
              getBalance();
              getChannelList();
            }}
          />
        }
        contentContainerStyle={styles.listContainer}
        data={channelList}
        renderItem={({item, index}) => (
          <PhotonListItemView
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
    channelRemark: s.photon.channelRemark,
    wallet: s.wallet,
  };
};
const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};
export default connect(msp, mdp)(PhotonNetwork);
