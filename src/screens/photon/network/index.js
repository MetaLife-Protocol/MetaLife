'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useStyle} from '../../../metalife-base';
import PhotonAccountInfoCard from './comps/PhotonAccountInfoCard';
import {useNavigation} from '@react-navigation/native';
import PhotonMoreActionsView from './comps/PhotonMoreActionsView';
import PhotonListItemView from './comps/PhotonListItemView';
import {getBalanceFromPhoton, loadChannelList} from 'react-native-photon';
import {connect} from 'react-redux';
import {getCurrentAccount} from '../../../utils';
import PhotonUrl from '../PhotonUrl';
import {getWBalance} from '../../../remote/wallet/WalletAPI';

const PhotonNetwork = ({channelRemark, wallet}) => {
  const styles = useStyle(createSty);
  const [moreActionsVisible, setMoreActionsVisible] = useState(false),
    [balances, setBalances] = useState([]),
    [channelList, setChannelList] = useState([]),
    [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  //set tabBar right more icon
  useLayoutEffect(() => {
    // navigationOptions;
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setMoreActionsVisible(true)}>
          <Image
            source={require('../../../assets/image/photon/photon_more.png')}
            style={styles.moreImg}
          />
        </Pressable>
      ),
    });
  }, [navigation, styles.moreImg]);

  const getBalance = () => {
    const balanceSMT = getBalanceFromPhoton(PhotonUrl.PHOTON_SMT_TOKEN_ADDRESS);
    const balanceMLT = getBalanceFromPhoton(PhotonUrl.PHOTON_MLT_TOKEN_ADDRESS);
    Promise.all([balanceSMT, balanceMLT]).then(values => {
      // console.log('values::', values);
      const jsonSMTRes = JSON.parse(values[0]);
      const jsonMLTRes = JSON.parse(values[1]);
      console.log('jsonSMTRes balance:::', jsonSMTRes);
      console.log('jsonMLTRes balance:::', jsonMLTRes);
      let getBalances = [];
      if (jsonSMTRes.error_code === 0) {
        const array = jsonSMTRes.data;
        if (array && array.length) {
          // setBalances([array[0]]);
          getBalances.push(array[0]);
        }
      }
      if (jsonMLTRes.error_code === 0) {
        const array = jsonMLTRes.data;
        if (array && array.length) {
          // setBalances([array[0]]);
          getBalances.push(array[0]);
        }
      }
      // if (balances.length === 0) {
      //   balances.push({});
      // }
      setRefreshing(false);
      setBalances(getBalances);
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
              // getWBalance(type, address, res => {
              //   setRefreshing(false);
              //   setBalance(res);
              // });
            }}
          />
        }
        contentContainerStyle={styles.listContainer}
        data={channelList}
        renderItem={({item, index}) => (
          <PhotonListItemView data={item} channelRemarks={channelRemark} />
        )}
        keyExtractor={(item, index) => `list_${index}`}
      />
      <PhotonMoreActionsView
        visible={moreActionsVisible}
        onSelect={() => {
          setMoreActionsVisible(false);
        }}
        onClose={() => {
          setMoreActionsVisible(false);
        }}
        wallet={wallet}
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
export default connect(msp)(PhotonNetwork);
