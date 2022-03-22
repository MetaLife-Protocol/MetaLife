'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */

import React, {useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CoinSelector from '../comps/CoinSelector';
import SelectDialog from '../comps/SelectDialog';
import SchemaStyles from '../../../shared/SchemaStyles';
import Constants from '../../../shared/Constants';
import PureTextInput from '../../../shared/comps/PureTextInput';
import RoundBtn from '../../../shared/comps/RoundBtn';

const Payment = () => {
  const {flex1, BG, FG} = SchemaStyles(),
    {container, button} = styles;

  const [coin, setCoin] = useState('SMT'),
    [quantity, setQuantity] = useState(''),
    [isShowCoinSelect, setIsShowCoinSelect] = useState(false);

  const btnDisabled = useMemo(() => !(quantity && coin), [coin, quantity]);

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

        <PureTextInput
          onChangeText={setQuantity}
          placeholder={'Input quantity'}
          inputProps={{keyboardType: 'numeric'}}
        />

        <RoundBtn
          style={button}
          disabled={btnDisabled}
          title={'Confirm'}
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
export default Payment;
