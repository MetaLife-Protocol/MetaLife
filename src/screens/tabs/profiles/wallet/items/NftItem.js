/**
 * @Author: amy
 * @Date: 2022-07-06
 */

import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';
import {getNFTTotal} from '../../../../../remote/contractOP';
import {getWBalanceByContract} from '../../../../../remote/wallet/WalletAPI';
import useSchemaStyles from '../../../../../shared/UseSchemaStyles';

const NftItem = ({cType, address}) => {
  const {text, BG} = useSchemaStyles();

  const [total, setTotal] = useState();
  const [amount, setAmount] = useState();

  useEffect(() => {
    getNFTTotal().then(res => setTotal(res));
    getWBalanceByContract('spectrum', cType, address, res => {
      setAmount(res);
    });
  }, [cType, address]);

  return (
    <View style={[styles.container, BG]}>
      <ImageBackground
        source={require('../../../../../assets/image/contacts/nft_icon.png')}
        style={[styles.img]}>
        <Text style={[text, styles.num]}>
          {amount}/{total}
        </Text>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 9,
    borderRadius: 12,
    marginVertical: 5,
  },
  img: {
    borderRadius: 12,
    height: 105,
    width: 105,
  },
  num: {
    alignSelf: 'flex-end',
  },
});
export default NftItem;
