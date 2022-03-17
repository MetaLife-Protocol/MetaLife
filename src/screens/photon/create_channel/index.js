'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

import React, {useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../../shared/SchemaStyles';
import PureTextInput from '../../../shared/comps/PureTextInput';
import Section from '../../../shared/comps/Section';
import RoundBtn from '../../../shared/comps/RoundBtn';

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
    {container, coinContainer, textCoin, arrowIcon} = styles,
    {textHolder} = colorsSchema;

  const [address, setAddress] = useState(''),
    [amount, setAmount] = useState(''),
    [remark, setRemark] = useState('');

  const btnDisabled = useMemo(
    () => !(address && amount && remark),
    [address, amount, remark],
  );

  return (
    <View style={[flex1, BG]}>
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
          <View style={[row, alignItemsCenter]}>
            <Text style={btnInactiveFG}>SMT</Text>
            <Image source={iconDic.arrowIcon} style={arrowIcon} />
          </View>
        </View>
        <Section>
          <PureTextInput onChangeText={setAddress} placeholder={'Address'} />
          <PureTextInput onChangeText={setAmount} placeholder={'Amount'} />
          <PureTextInput onChangeText={setRemark} placeholder={'Remark'} />
        </Section>
        <RoundBtn disabled={btnDisabled} title={'Create'} press={() => {}} />
      </View>
    </View>
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
});

export default CreatChannel;
