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
import {getMainCoinName, isMainCoin} from '../../../../../utils/chainUtils';
import {fixAmountDot6} from '../../../../../utils';

const CoinItem = ({type, address, cType, pressItem, setBalance}) => {
  const {BG, row, justifySpaceBetween, alignItemsCenter, text} =
    useSchemaStyles();
  const [total, setTotal] = useState('');
  let request = true;
  useEffect(() => {
    if (isMainCoin(type, cType)) {
      getWBalance(type, address, res => {
        if (!request) {
          return;
        }
        setTotal(res);
        setBalance({
          type,
          cType: getMainCoinName(type),
          balance: res,
        });
      });
    } else {
      getWBalanceByContract(type, cType, address, res => {
        if (!request) {
          return;
        }
        setTotal(res);
        setBalance({
          type,
          cType,
          balance: res,
        });
      });
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      request = false;
    };
  }, [type, address, cType]);

  return (
    <>
      <Pressable
        onPress={() => pressItem && pressItem(cType, total)}
        style={[row, justifySpaceBetween, alignItemsCenter, styles.container]}>
        <Text style={[text, styles.type]}>{cType}</Text>
        <Text style={[text, styles.total]}>{fixAmountDot6(total)}</Text>
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
