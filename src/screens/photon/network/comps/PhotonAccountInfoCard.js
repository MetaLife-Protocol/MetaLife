'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ethNumberFixed, useStyle} from '../../../../metalife-base';

const PhotonAccountInfoCard = ({style, balance, currentAccount}) => {
  const styles = useStyle(createSty);

  // useEffect(() => {
  //   const {balance_in_photon, balance_on_chain, token_address} = balance;
  //   if (token_address === '0x6601F810eaF2fa749EEa10533Fd4CC23B8C791dc') {
  //     if (!balance_in_photon) {
  //     }
  //   }
  // }, [balance]);

  const itemView = useCallback(
    (title, values, showUnit = true, style) => {
      return (
        <View style={[styles.itemContainer, style]}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text
            style={[styles.itemValue]}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            {values}
            {!!showUnit && <Text style={styles.unit}>SMT</Text>}
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
        currentAccount?.Name ?? '--',
        currentAccount?.Address ?? '--',
        false,
      )}
      {itemView(
        'On-chain balance',
        ethNumberFixed(balance?.balance_on_chain),
        true,
        styles.marginTop20,
      )}
      {itemView(
        'Channel total balance',
        ethNumberFixed(balance?.balance_in_photon),
        true,
        styles.marginTop20,
      )}
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
