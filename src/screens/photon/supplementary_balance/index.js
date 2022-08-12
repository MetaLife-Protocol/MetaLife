'use strict';

/**
 * 补充
 * @Author: lq
 * @desc:
 */

import React, {useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Text from '../../../shared/comps/ComText';
import {
  PhotonSeparator,
  PureTextInput,
  RoundBtn,
  useStyle,
  safeDecimal,
  ETHER,
  numberToString,
} from '../../../metalife-base';
import Constants from '../../../shared/Constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {depositChannelMethod} from 'react-native-photon';
import {getPhotonTokenSymbol} from '../PhotonUtils';
import Toast from 'react-native-tiny-toast';

const SupplementaryBalance = () => {
  const styles = useStyle(createSty);
  const route = useRoute();
  const {channelData, walletBalance} = route.params;
  const navigation = useNavigation();

  const [amount, setAmount] = useState('');
  const btnDisabled = useMemo(() => !amount, [amount]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        <Text style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
          {channelData?.partner_address}
        </Text>
        <PhotonSeparator />
        <PureTextInput
          rightComponent={
            <Text style={styles.coin}>
              {getPhotonTokenSymbol(channelData?.token_address)}
            </Text>
          }
          hasSeparator={true}
          onChangeText={setAmount}
          placeholder={'Amount'}
        />

        <RoundBtn
          style={styles.button}
          disabled={btnDisabled}
          title={'Create'}
          press={() => {
            try {
              const type = getPhotonTokenSymbol(channelData?.token_address);
              let chainBalance = safeDecimal(
                walletBalance[type].balance_on_chain,
              );
              const depositAmount = safeDecimal(amount).mul(ETHER);
              if (depositAmount.comparedTo(chainBalance) === 1) {
                Toast.show('Insufficient Balance', {
                  position: Toast.position.CENTER,
                });
                return;
              }
              depositChannelMethod({
                photonTokenAddress: channelData?.token_address,
                partnerAddress: channelData?.partner_address,
                depositBalance: numberToString(depositAmount),
              })
                .then(res => {
                  const jsonRes = JSON.parse(res);
                  if (jsonRes.error_code === 0) {
                    //   TODO 成功
                    navigation.goBack();
                  } else {
                    Toast.show(jsonRes.error_message, {
                      position: Toast.position.CENTER,
                    });
                  }
                  // console.log('depositChannelMethod res::', res);
                })
                .catch(error => {
                  // console.log('depositChannelMethod error::', error);
                });
            } catch (e) {
              // console.log(e);
            }
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
