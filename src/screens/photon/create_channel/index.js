'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

import React, {useCallback, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Constants from '../../../shared/Constants';
import {
  PhotonSeparator,
  PureTextInput,
  RoundBtn,
  useStyle,
  ETHER,
  safeDecimal,
} from '../../../metalife-base';
import {useNavigation} from '@react-navigation/native';
import {createChannel} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
import PhotonUrl from '../PhotonUrl';

const CreateChannel = ({setChannelRemark}) => {
  const styles = useStyle(createSty);
  const {navigate} = useNavigation();
  const navigation = useNavigation();

  const [address, setAddress] = useState(''),
    [amount, setAmount] = useState(''),
    [remark, setRemark] = useState('');

  const btnDisabled = useMemo(
    () => !(address && amount && remark),
    [address, amount, remark],
  );

  const onCreateChannel = useCallback(() => {
    setChannelRemark({address, remark});
    createChannel(
      PhotonUrl.PHOTON_SMT_TOKEN_ADDRESS,
      address,
      safeDecimal(amount).mul(ETHER).toString(),
    )
      .then(res => {
        const resJson = JSON.parse(res);
        console.log('createChannel res::', resJson);
        if (resJson.error_code == 0) {
          if (remark) {
            setChannelRemark({address, remark});
          }
          Toast.show('create channel success');
        } else {
          Toast.show(resJson.error_message);
        }
      })
      .catch(e => {
        Toast.show(e.error_message);
      });
  }, [address, amount, remark, setChannelRemark]);

  return (
    <SafeAreaView style={styles.container}>
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
          <Pressable
            onPress={() => {
              //TODO select wallet others address
              navigate('PhotonAddressContact');
            }}>
            <Image
              source={require('../../../assets/image/photon/icon_photon_address.png')}
              style={styles.iconImg}
            />
          </Pressable>
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
          <Text style={styles.coinText}>SMT</Text>
        </View>
        <PureTextInput
          onChangeText={setAmount}
          placeholder={'Enter transfer amoun'}
          style={styles.marginTop10}
        />
        <PhotonSeparator />
        <View style={styles.row}>
          <Text style={styles.title}>Amount</Text>
          {/*TODO wallet number*/}
          <Text style={styles.coinAmount}>32748 SMT</Text>
        </View>
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
    setChannelRemark: channelRemark =>
      d({type: 'setChannelRemark', payload: channelRemark}),
  };
};
export default connect(msp, mdp)(CreateChannel);
