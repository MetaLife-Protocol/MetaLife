'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

import React, {useMemo, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../../shared/SchemaStyles';
import PureTextInput from '../../../shared/comps/PureTextInput';
import RoundBtn from '../../../shared/comps/RoundBtn';
import SelectDialog from '../comps/SelectDialog';
import Constants from '../../../shared/Constants';

const iconDic = {
  arrowIcon: require('../../../assets/image/icons/icons_down_arrow.png'),
};

const CreatChannel = ({}) => {
  const {
      flex1,
      BG,
      row,
      alignItemsCenter,
      justifySpaceBetween,
      FG,
      btnInactiveFG,
      text,
    } = SchemaStyles(),
    {container, coinContainer, textCoin, arrowIcon, button} = styles,
    {textHolder} = colorsSchema;

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
        <View
          style={[
            row,
            alignItemsCenter,
            justifySpaceBetween,
            coinContainer,
            {borderColor: textHolder},
          ]}>
          <Text style={[textCoin, text]}>Coin</Text>

          <TouchableOpacity
            onPress={() => {
              setIsShowCoinSelect(preData => {
                return !preData;
              });
            }}
            style={[row, alignItemsCenter]}>
            <Text style={btnInactiveFG}>{coin}</Text>
            <Image source={iconDic.arrowIcon} style={arrowIcon} />
          </TouchableOpacity>
        </View>
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
  coinContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
  },
  textCoin: {
    fontSize: 16,
    lineHeight: 23,
  },
  arrowIcon: {width: 9, height: 5, marginLeft: 9},
  textInput: {
    marginHorizontal: 15,
    height: 40,
  },
  button: {
    position: 'absolute',
    bottom: Constants.safeBottom,
    left: 15,
    right: 15,
  },
});

export default CreatChannel;
