'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

import React, {useMemo, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../shared/comps/ComText';
import Constants from '../../../shared/Constants';
import {PureTextInput, RoundBtn, useStyle} from '../../../metalife-base';
import {useNavigation} from '@react-navigation/native';
import {createChannel} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
import {getTokenAddress} from '../PhotonUtils';
import {bigNumberParseUnits, getProvider} from 'react-native-web3-wallet';
import NativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import PhotonUrl from '../PhotonUrl';

const CreateChannel = ({setChannelRemark, showPullMenu, route: {params}}) => {
  const {isIPhoneX_deprecated} = NativeDeviceInfo.getConstants();
  const {walletBalance} = params;
  const styles = useStyle(createSty);
  const {navigate, goBack} = useNavigation();

  const [address, setAddress] = useState(''),
    [amount, setAmount] = useState(''),
    [remark, setRemark] = useState(''),
    [type, setType] = useState('SMT');

  const btnDisabled = useMemo(() => !(address && amount), [address, amount]);

  const onCreateChannel = async () => {
    // check address
    try {
      const correctAddress = await getProvider(PhotonUrl.RPC_URL).resolveName(
        address,
      );
      if (!correctAddress) {
        Toast.show('invalid address!', {
          position: Toast.position.CENTER,
        });
        return;
      }
    } catch (e) {
      Toast.show('invalid address!', {
        position: Toast.position.CENTER,
      });
      return;
    }
    if (isNaN(amount)) {
      Toast.show('incorrect number', {
        position: Toast.position.CENTER,
      });
      return;
    }
    if (!walletBalance[type] || !walletBalance[type]?.balance_on_chain) {
      Toast.show('Insufficient Funds', {
        position: Toast.position.CENTER,
      });
      return;
    }
    const chainBalance = bigNumberParseUnits(
      walletBalance[type].balance_on_chain + '',
      0,
    );
    const inputAmount = bigNumberParseUnits(amount.toString(), 18);
    if (inputAmount.gt(chainBalance)) {
      Toast.show('Insufficient Funds', {
        position: Toast.position.CENTER,
      });
      return;
    }
    setChannelRemark({address, remark});
    createChannel(getTokenAddress(type), address, inputAmount.toString())
      .then(res => {
        const resJson = JSON.parse(res);
        // console.log('createChannel res::', resJson);
        if (resJson.error_code === 0) {
          if (remark) {
            setChannelRemark({address, remark});
          }
          Toast.show('create channel success', {
            position: Toast.position.CENTER,
          });
          goBack();
        } else {
          Toast.show(resJson.error_message, {
            position: Toast.position.CENTER,
          });
        }
      })
      .catch(e => {
        console.log('createChannel error', e);
      });
  };

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
            title: 'MLT',
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
      <KeyboardAvoidingView
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <Text style={styles.title}>Receiving account</Text>
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
            <Text style={styles.title}>Transfers number</Text>
            <Text style={styles.coinText} onPress={menuHandler}>
              {type}
            </Text>
          </View>
          <PureTextInput
            onChangeText={setAmount}
            placeholder={'Enter transfer amount'}
            style={styles.marginTop10}
          />
          {/*   <PhotonSeparator />
        <View style={styles.row}>
          <Text style={styles.title}>Amount</Text>
          TODO wallet number
          <Text style={styles.coinAmount}>32748 SMT</Text>
        </View>*/}
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <Text style={styles.title}>Remark</Text>
          </View>
          <PureTextInput
            onChangeText={setRemark}
            placeholder={'Enter comments'}
            style={styles.marginTop10}
          />
        </View>

        <RoundBtn
          style={styles.button}
          disabled={btnDisabled}
          title={'Create'}
          press={onCreateChannel}
        />
      </KeyboardAvoidingView>
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
      marginTop: 10,
      // position: 'absolute',
      // bottom: Constants.safeBottom,
      // left: 15,
      // right: 15,
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
    setChannelRemark: channelRemark =>
      d({type: 'setChannelRemark', payload: channelRemark}),
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};
export default connect(msp, mdp)(CreateChannel);
