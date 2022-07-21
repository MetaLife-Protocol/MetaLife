import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import {
  getWBalance,
  getWBalanceByContract,
} from '../../../../../remote/wallet/WalletAPI';
import useSchemaStyles, {
  colorsBasics,
} from '../../../../../shared/UseSchemaStyles';

const CoinItem = ({type, address, cType, pressItem, setBalance}) => {
  const {BG, row, justifySpaceBetween, alignItemsCenter, text} =
    useSchemaStyles();
  const [total, setTotal] = useState('');

  useEffect(() => {
    if (type === 'spectrum') {
      if (cType === 'SMT') {
        getWBalance(type, address, res => {
          setTotal(res);
          setBalance({
            type,
            cType: 'SMT',
            balance: res,
          });
        });
      } else {
        getWBalanceByContract(type, cType, address, res => {
          setTotal(res);
          setBalance({
            type,
            cType,
            balance: res,
          });
        });
      }
    } else if (type === 'ethereum') {
      getWBalance(type, address, res => {
        setTotal(res);
        setBalance({
          type,
          cType: 'ETH',
          balance: res,
        });
      });
    }
  }, [type, address, cType]);

  return (
    <>
      <Pressable
        onPress={() => pressItem && pressItem(cType, total)}
        style={[row, justifySpaceBetween, alignItemsCenter, styles.container]}>
        <Text style={[text, styles.type]}>{cType}</Text>
        <Text style={[text, styles.total]}>{total}</Text>
      </Pressable>
      <View style={[styles.line, BG]} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 15,
  },
  type: {
    color: colorsBasics.primary,
    fontSize: 15,
  },
  total: {
    fontSize: 15,
  },
  line: {
    height: 1,
    marginHorizontal: 15,
  },
});

export default CoinItem;
