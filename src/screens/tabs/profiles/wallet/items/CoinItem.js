import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import {
  getWBalance,
  getWBalanceByContract,
} from '../../../../../remote/wallet/WalletAPI';
import useSchemaStyles, {
  colorsBasics,
} from '../../../../../shared/UseSchemaStyles';

const CoinItem = ({type, address, cType}) => {
  const {BG, row, justifySpaceBetween, alignItemsCenter, text} =
    useSchemaStyles();
  const [total, setTotal] = useState('');

  useEffect(() => {
    if (type === 'spectrum') {
      if (cType === 'SMT') {
        getWBalance(type, address, res => {
          setTotal(res);
        });
      } else {
        getWBalanceByContract(type, cType, address, res => {
          setTotal(res);
        });
      }
    } else if (type === 'ethereum') {
      getWBalance(type, address, res => {
        setTotal(res);
      });
    }
  }, [type, address, cType]);

  return (
    <>
      <View
        style={[row, justifySpaceBetween, alignItemsCenter, styles.container]}>
        <Text style={[text, styles.type]}>{cType}</Text>
        <Text style={[text, styles.total]}>{total}</Text>
      </View>
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
