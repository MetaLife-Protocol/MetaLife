'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */

import React, {useCallback, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  // Text,
  View,
} from 'react-native';
import Text from '../../../shared/comps/ComText';
import {
  amountMulEth,
  numberToString,
  PureTextInput,
  RoundBtn,
  useStyle,
} from '../../../metalife-base';
import Constants from '../../../shared/Constants';
import {useNavigation} from '@react-navigation/native';
import {photonTransfer} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
import {getTokenAddress} from '../PhotonUtils';

const Payment = ({showPullMenu}) => {
  const styles = useStyle(createSty);
  const {navigate} = useNavigation();

  const [address, setAddress] = useState(''),
    [amount, setAmount] = useState(''),
    [remark, setRemark] = useState(''),
    [type, setType] = useState('SMT');

  const btnDisabled = useMemo(() => !(address && amount), [address, amount]);

  const transferFun = useCallback(() => {
    photonTransfer({
      tokenAddress: getTokenAddress(type),
      amount: numberToString(amountMulEth(amount)),
      walletAddress: address,
      isDirect: true,
      payData: '',
      filePath: '',
    })
      .then(res => {
        // Toast.show(e.toString())
        console.log('res::', res);
        const resJson = JSON.parse(res);
        if (resJson.error_code === 0) {
          Toast.show('payment success');
          navigate('PhotonTransactionRecord');
        } else {
          Toast.show(resJson.error_message, {
            position: Toast.position.CENTER,
          });
        }
      })
      .catch(e => {
        console.log('res::', e);
      });
  }, [address, amount, navigate, type]);

  function menuHandler(e) {
    e.target.measure((x, y, width, height, pageX, pageY) =>
      showPullMenu({
        position: {
          x: pageX - width - 30,
          y: pageY + height,
        },
        buttons: [
          {
            title: 'SMT',
            handler: () => {
              setType('SMT');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'MTL',
            handler: () => {
              setType('MLT');
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      }),
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>To</Text>
          <Pressable
            onPress={() => {
              navigate('Scan', {onCallbackData: setAddress});
            }}>
            <Image
              source={require('../../../assets/image/photon/icon_scan.png')}
              style={styles.iconImg}
            />
          </Pressable>
          {/*TODO*/}
          {/*<Pressable
            onPress={() => {
              //TODO select wallet others address
              navigate('PhotonAddressContact');
            }}>
            <Image
              source={require('../../../assets/image/photon/icon_photon_address.png')}
              style={styles.iconImg}
            />
          </Pressable>*/}
        </View>
        <PureTextInput
          defaultValue={address}
          onChangeText={setAddress}
          placeholder={'Type or paste address'}
          style={styles.marginTop10}
        />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>payment number</Text>
          <Text style={styles.coinText} onPress={menuHandler}>
            {type}
          </Text>
        </View>
        <PureTextInput
          onChangeText={setAmount}
          placeholder={'Enter transfer amoun'}
          style={styles.marginTop10}
        />
        {/* <PhotonSeparator />
        <View style={styles.row}>
          <Text style={styles.title}>Amount</Text>
          TODO wallet number
          <Text style={styles.coinAmount}>32748 SMT</Text>
        </View>*/}
      </View>

      {/*<View style={styles.cardContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>Remark</Text>
        </View>
        <PureTextInput
          onChangeText={setRemark}
          placeholder={'Enter comments'}
          style={styles.marginTop10}
        />
      </View>*/}

      <RoundBtn
        style={styles.button}
        disabled={btnDisabled}
        title={'Pay'}
        press={transferFun}
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
    cardContainer: {
      backgroundColor: theme.c_FFFFFF_111717,
      marginTop: 10,
      padding: 15,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      position: 'absolute',
      bottom: Constants.safeBottom,
      left: 15,
      right: 15,
    },
    title: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_000000_FFFFFF,
      flex: 1,
    },
    coinText: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_000000_FFFFFF,
    },
    coinAmount: {
      fontSize: 17,
      lineHeight: 21,
      color: theme.c_000000_FFFFFF,
      fontWeight: Constants.bold,
    },
    iconImg: {
      width: 20,
      height: 20,
      marginLeft: 20,
      tintColor: theme.c_000000_FFFFFF,
    },
    marginTop10: {
      marginTop: 10,
    },
  });

const msp = s => {
  return {};
};

const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};
export default connect(msp, mdp)(Payment);
