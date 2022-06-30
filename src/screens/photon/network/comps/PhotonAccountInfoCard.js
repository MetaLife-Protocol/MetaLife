'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ethNumberFixed, useStyle} from '../../../../metalife-base';
import {getPhotonTokenSymbol} from '../../PhotonUtils';

const PhotonAccountInfoCard = ({style, balances, currentAccount}) => {
  const styles = useStyle(createSty);

  // useEffect(() => {
  //   console.log('balances::', balances);
  //   // const {balance_in_photon, balance_on_chain, token_address} = balance;
  //   // if (token_address === '0x6601F810eaF2fa749EEa10533Fd4CC23B8C791dc') {
  //   //   if (!balance_in_photon) {
  //   //   }
  //   // }
  // }, [balances]);

  const itemView = useCallback(
    (title, values, showUnit = true, token_address, style) => {
      return (
        <View style={[styles.itemContainer, style]}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text
            style={[styles.itemValue]}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            {values}
            {!!showUnit && (
              <Text style={styles.unit}>
                {getPhotonTokenSymbol(token_address)}
              </Text>
            )}
          </Text>
        </View>
      );
    },
    [styles],
  );

  return (
    <View style={[styles.container, style]}>
      {/*storableWallet.getPublicKey()*/}
      {itemView(
        currentAccount?.name ?? '--',
        currentAccount?.address ?? '--',
        false,
      )}
      {balances.map((balance, index) => {
        return (
          <View key={'index_' + index}>
            {itemView(
              'On-chain balance',
              ethNumberFixed(balance?.balance_on_chain),
              true,
              balance?.token_address,
              styles.marginTop20,
            )}
            {itemView(
              'Channel total balance',
              ethNumberFixed(balance?.balance_in_photon),
              true,
              balance?.token_address,
              styles.marginTop20,
            )}
          </View>
        );
      })}
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      marginHorizontal: 16,
      backgroundColor: theme.c_FFFFFF_111717,
      padding: 15,
      borderRadius: 12,
    },
    itemContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    itemTitle: {fontSize: 15, color: theme.primary},
    itemValue: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      marginLeft: 15,
      flex: 1,
      textAlign: 'right',
    },
    unit: {color: '#8E8E92'},
    marginTop20: {marginTop: 20},
  });
export default PhotonAccountInfoCard;
