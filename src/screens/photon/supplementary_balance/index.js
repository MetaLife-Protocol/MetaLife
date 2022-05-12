'use strict';

/**
 * 补充
 * @Author: lq
 * @desc:
 */

import React, {useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  PhotonSeparator,
  PureTextInput,
  RoundBtn,
  useStyle,
  safeDecimal,
  ETHER,
} from 'metalife-base';
import Constants from '../../../shared/Constants';
import {useRoute} from '@react-navigation/native';
import {depositChannelMethod} from 'react-native-photon';

const SupplementaryBalance = () => {
  const styles = useStyle(createSty);
  const route = useRoute();
  const {channelData} = route.params ?? {};
  // console.log('channelData::', channelData);

  const [amount, setAmount] = useState(''),
    [remark, setRemark] = useState('');

  const btnDisabled = useMemo(() => !(amount && remark), [amount, remark]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        <Text style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
          {channelData?.partner_address}
        </Text>
        <PhotonSeparator />
        <PureTextInput
          rightComponent={<Text style={styles.coin}>SMT</Text>}
          hasSeparator={true}
          onChangeText={setAmount}
          placeholder={'Amount'}
        />
        <PureTextInput
          hasSeparator={true}
          onChangeText={setRemark}
          placeholder={'Remark'}
        />

        <RoundBtn
          style={styles.button}
          disabled={btnDisabled}
          title={'Create'}
          press={() => {
            depositChannelMethod({
              photonTokenAddress: channelData?.token_address,
              partnerAddress: channelData?.partner_address,
              depositBalance: safeDecimal(amount).mul(ETHER).toString(),
            })
              .then(res => {
                const jsonRes = JSON.parse(res);
                if (jsonRes.error_code === 0) {
                  //   TODO 成功
                }
                console.log('depositChannelMethod res::', res);
              })
              .catch(error => {
                console.log('depositChannelMethod error::', error);
              });
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
    pageContainer: {
      marginTop: 10,
      flex: 1,
      backgroundColor: theme.c_FFFFFF_111717,
      paddingHorizontal: 15,
    },
    address: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      lineHeight: 18,
      marginTop: 16,
    },
    coin: {
      fontSize: 15,
      color: theme.primary,
      lineHeight: 18,
    },
    button: {
      position: 'absolute',
      bottom: Constants.safeBottom,
      left: 15,
      right: 15,
    },
  });
export default SupplementaryBalance;
