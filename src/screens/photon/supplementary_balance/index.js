'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React, {useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../shared/ThemeColors';
import {PhotonSeparator} from '../../../shared/comps/PhotonSeparator';
import PureTextInput from '../../../shared/comps/PureTextInput';
import RoundBtn from '../../../shared/comps/RoundBtn';
import Constants from '../../../shared/Constants';

const SupplementaryBalance = () => {
  const styles = useStyle(createSty);

  const [amount, setAmount] = useState(''),
    [remark, setRemark] = useState('');

  const btnDisabled = useMemo(() => !(amount && remark), [amount, remark]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        <Text style={styles.address}>0xcC5D3A537E...bC9c1</Text>
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
            //  TODO create channel
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
