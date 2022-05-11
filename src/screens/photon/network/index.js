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
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useStyle} from 'metalife-base';
import PhotonAccountInfoCard from './comps/PhotonAccountInfoCard';
import {useNavigation} from '@react-navigation/native';
import PhotonMoreActionsView from './comps/PhotonMoreActionsView';
import PhotonListItemView from './comps/PhotonListItemView';
import {getBalanceFromPhoton, loadChannelList} from 'react-native-photon';
import {connect} from 'react-redux';

const PhotonNetwork = ({currentAccount}) => {
  const styles = useStyle(createSty);
  const [moreActionsVisible, setMoreActionsVisible] = useState(false),
    [balance, setBalance] = useState({}),
    [channelList, setChannelList] = useState([]);

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

  //get Balance
  useEffect(() => {
    getBalanceFromPhoton().then(res => {
      const jsonRes = JSON.parse(res);
      console.log('balance:::', jsonRes);
      if (jsonRes.error_code === 0) {
        const array = jsonRes.data;
        if (array && array.length) {
          setBalance(array[0]);
        }
      }
    });
  }, []);

  //get Channel List
  useEffect(() => {
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <PhotonAccountInfoCard
        style={styles.topCard}
        balance={balance}
        currentAccount={currentAccount}
      />
      <View style={styles.channelListContainer}>
        <View style={styles.channelListTextContainer}>
          <Text style={styles.channelText}>Channel list</Text>
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={channelList}
        renderItem={({item, index}) => <PhotonListItemView data={item} />}
        keyExtractor={(item, index) => `list_${index}`}
      />
      <PhotonMoreActionsView
        visible={moreActionsVisible}
        onSelect={() => {
          setMoreActionsVisible(false);
        }}
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
    currentAccount: s.account.currentAccount,
  };
};
export default connect(msp)(PhotonNetwork);
