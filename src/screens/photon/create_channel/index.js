'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RoundBtn from '../../../shared/comps/RoundBtn';
import Constants from '../../../shared/Constants';
import {useStyle} from '../../../shared/ThemeColors';
import {useNavigation} from '@react-navigation/native';
import PureTextInput from '../../../shared/comps/PureTextInput';
import {PhotonSeparator} from '../../../shared/comps/PhotonSeparator';

const CreateChannel = ({}) => {
  const styles = useStyle(createSty);
  const {navigate} = useNavigation();

  const [address, setAddress] = useState(''),
    [amount, setAmount] = useState(''),
    [remark, setRemark] = useState(''),
    [coin, setCoin] = useState('SMT'),
    [isShowCoinSelect, setIsShowCoinSelect] = useState(false);

  const btnDisabled = useMemo(
    () => !(address && amount && remark),
    [address, amount, remark],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>Receiving account</Text>
          <Pressable
            onPress={() => {
              navigate('Scan');
            }}>
            <Image
              source={require('../../../assets/image/photon/icon_scan.png')}
              style={styles.iconImg}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              //TODO select wallet others address
              alert('TODO');
            }}>
            <Image
              source={require('../../../assets/image/photon/icon_photon_address.png')}
              style={styles.iconImg}
            />
          </Pressable>
        </View>
        <PureTextInput
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
        press={() => {
          //  TODO create channel
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

export default CreateChannel;
