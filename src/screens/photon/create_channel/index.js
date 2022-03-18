'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

import React, {useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import PureTextInput from '../../../shared/comps/PureTextInput';
import RoundBtn from '../../../shared/comps/RoundBtn';
import SelectDialog from '../comps/SelectDialog';
import Constants from '../../../shared/Constants';
import CoinSelector from '../comps/CoinSelector';

const CreatChannel = ({}) => {
  const {flex1, BG, FG} = SchemaStyles(),
    {container, button} = styles;

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
    <SafeAreaView style={[flex1, BG]}>
      <View style={[flex1, container, FG]}>
        <CoinSelector
          coin={coin}
          onPress={() => {
            setIsShowCoinSelect(preData => {
              return !preData;
            });
          }}
        />
        <PureTextInput onChangeText={setAddress} placeholder={'Address'} />
        <PureTextInput onChangeText={setAmount} placeholder={'Amount'} />
        <PureTextInput onChangeText={setRemark} placeholder={'Remark'} />
        <RoundBtn
          style={button}
          disabled={btnDisabled}
          title={'Create'}
          press={() => {
            //  TODO create channel
          }}
        />
        <SelectDialog
          visible={isShowCoinSelect}
          listData={['SMT', 'MESH']}
          onPress={coin => {
            setCoin(coin);
            setIsShowCoinSelect(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 15,
  },
  button: {
    position: 'absolute',
    bottom: Constants.safeBottom,
    left: 15,
    right: 15,
  },
});

export default CreatChannel;
