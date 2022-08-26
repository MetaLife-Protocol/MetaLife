'use strict';

/**
 * 补充
 * @Author: lq
 * @desc:
 */

import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../shared/comps/ComText';
import {
  numberToString,
  PhotonSeparator,
  PureTextInput,
  RoundBtn,
  useStyle,
} from '../../../metalife-base';
import {useNavigation, useRoute} from '@react-navigation/native';
import {depositChannelMethod} from 'react-native-photon';
import {getPhotonTokenSymbol} from '../PhotonUtils';
import Toast from 'react-native-tiny-toast';
import {bigNumberParseUnits} from 'react-native-web3-wallet';
import NativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';

const SupplementaryBalance = () => {
  const {isIPhoneX_deprecated} = NativeDeviceInfo.getConstants();
  const styles = useStyle(createSty);
  const route = useRoute();
  const {channelData, walletBalance} = route.params;
  const navigation = useNavigation();

  const [amount, setAmount] = useState('');
  const btnDisabled = useMemo(() => !amount, [amount]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text
            style={styles.address}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
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
            title={'Deposit'}
            press={() => {
              if (isNaN(amount)) {
                Toast.show('incorrect number', {
                  position: Toast.position.CENTER,
                });
                return;
              }
              const type = getPhotonTokenSymbol(channelData?.token_address);
              if (
                !walletBalance[type] ||
                !walletBalance[type]?.balance_on_chain
              ) {
                Toast.show('Insufficient Funds', {
                  position: Toast.position.CENTER,
                });
                return;
              }
              try {
                let chainBalance = bigNumberParseUnits(
                  numberToString(walletBalance[type].balance_on_chain),
                  0,
                );
                const depositAmount = bigNumberParseUnits(amount.toString());
                if (depositAmount.gt(chainBalance)) {
                  Toast.show('Insufficient Balance', {
                    position: Toast.position.CENTER,
                  });
                  return;
                }
                depositChannelMethod({
                  photonTokenAddress: channelData?.token_address,
                  partnerAddress: channelData?.partner_address,
                  depositBalance: depositAmount.toString(),
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
                console.log(e);
              }
            }}
          />
        </KeyboardAvoidingView>
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
      marginTop: 10,
      // position: 'absolute',
      // bottom: Constants.safeBottom,
      // left: 15,
      // right: 15,
    },
  });
export default SupplementaryBalance;
