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
import {useStyle} from '../../../shared/ThemeColors';
import PhotonAccountInfoCard from './comps/PhotonAccountInfoCard';
import {useNavigation} from '@react-navigation/native';
import PhotonMoreActionsView from './comps/PhotonMoreActionsView';
import PhotonListItemView from './comps/PhotonListItemView';
import {getBalanceFromPhoton} from 'react-native-photon';

const PhotonNetwork = () => {
  const styles = useStyle(createSty);
  const [moreActionsVisible, setMoreActionsVisible] = useState(false),
    [balance, setBalance] = useState({});

  const navigation = useNavigation();
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

  useEffect(() => {
    getBalanceFromPhoton().then(res => {
      const jsonRes = JSON.parse(res);
      console.log('balance:::', jsonRes);
      if (jsonRes.error_code === 0) {
        const array = jsonRes.data;
        if (array && array.length) {
          setBalance(array[0]);
          // const {balance_in_photon, balance_on_chain, token_address} = array[0];
          // if (token_address === '0x6601F810eaF2fa749EEa10533Fd4CC23B8C791dc') {
          //   if (!balance_in_photon) {
          //   }
          // }
        }
        // for ()
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <PhotonAccountInfoCard style={styles.topCard} balance={balance} />
      <View style={styles.channelListContainer}>
        <View style={styles.channelListTextContainer}>
          <Text style={styles.channelText}>Channel list</Text>
        </View>
      </View>
      <FlatList data={[0, 1]} renderItem={() => <PhotonListItemView />} />
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
  });
export default PhotonNetwork;
