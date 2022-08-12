'use strict';

import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Modal, Image, Pressable} from 'react-native';
import Text from '../../../shared/comps/ComText';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {PureTextInput} from '../../../metalife-base';
import Slider from '@react-native-community/slider';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
  createBigNumber,
} from 'react-native-web3-wallet';
import LoadingView from '../../../shared/comps/LoadingView';
import {getTransferGasPrice} from '../../../remote/wallet/WalletAPI';
import {getCurrentAccount} from '../../../utils';
const darkclose = require('../../../assets/image/icons/icon_close_default_black.png');
const whitecolse = require('../../../assets/image/wallet/icon_close_default_white.png');

const TransactionModal = ({
  showTrans,
  setShowTrans,
  darkMode,
  list,
  confirmPress,
  showLoading,
  wallet,
}) => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const back = darkMode ? '#232929' : '#fff';
  // console.log('gggg', list.gasLimit);
  const gasLim = list?.gasLimit.div(createBigNumber(10000)).toNumber();
  const [gasLimit, setGasLimit] = useState(
    list?.gasLimit.div(createBigNumber(10000)).toNumber(),
  );
  const [gasPrice, setGasPrice] = useState(createBigNumber(0));
  // useMemo(() => {
  //   setGasLimit(list?.gasLimit.div(createBigNumber(10000)).toNumber());
  // }, [list?.gasLimit]);
  // useEffect(() => {
  //   setGasLimit(list?.gasLimit.div(createBigNumber(10000)).toNumber());
  // }, [list?.gasLimit]);
  useEffect(() => {
    const currentAccount = getCurrentAccount(wallet);
    getTransferGasPrice({type: currentAccount.type}).then(res => {
      const price = res.toString();
      setGasPrice(res);
      // setGasPriceNumber(Number(bigNumberFormatUnits(res.toString(), 9)));
    });
  }, []);
  // console.log('rrrrr', (300 - gasLimit) * 0.3 + gasLimit, gasLimit);
  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={showTrans}
      onRequestClose={setShowTrans}>
      <View style={[flex1, styles.contain]}>
        <View style={[styles.con, {backgroundColor: back}]}>
          <View style={styles.topView}>
            <Text style={[text, styles.trans]}>Transaction Details</Text>
            <Pressable onPress={() => setShowTrans(false)}>
              <Image source={darkMode ? darkclose : whitecolse} />
            </Pressable>
          </View>
          <Text style={[text, styles.mlt]}>{list?.price}</Text>
          <Text style={[styles.comText]}>Info</Text>
          <Text style={[text, styles.content]}>{list?.content}</Text>
          <Text style={[styles.comText]}>To</Text>
          <Text style={[text, styles.content]}>{list?.to}</Text>
          <Text style={[styles.comText]}>From</Text>
          <Text style={[text, styles.content]}>{list?.from}</Text>
          <View style={styles.gasView}>
            <Text style={styles.comText}>Gas</Text>
            <Text style={[text, styles.gasText]}>
              {`${
                bigNumberFormatUnits(
                  bigNumberParseUnits(gasLimit + '', 4)
                    .mul(bigNumberParseUnits(gasPrice + '', 0))
                    .toString(),
                ) + ''
              } SMT`}
            </Text>
          </View>
          <Slider
            style={[styles.slider]}
            minimumValue={Math.floor(0.7 * gasLim)}
            maximumValue={Math.ceil(gasLim * 2)}
            value={gasLim * 1.2}
            thumbTintColor="#29DAD7"
            minimumTrackTintColor="#29DAD7"
            maximumTrackTintColor="#DADADA"
            step={10}
            onValueChange={value => {
              setGasLimit(value);
            }}
          />
          <Pressable
            style={styles.confirmView}
            onPress={() => confirmPress(gasLimit, gasPrice)}>
            <Text style={styles.conText}>Confirm</Text>
          </Pressable>
        </View>
        {showLoading && <LoadingView />}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  contain: {alignItems: 'center', justifyContent: 'center'},
  con: {
    height: 472,
    width: 345,
    borderRadius: 12,
    padding: 15,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  trans: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  mlt: {
    fontWeight: 'bold',
    fontSize: 23,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  comText: {
    fontSize: 14,
    color: '#4E586E',
    marginTop: 15,
  },
  content: {
    fontSize: 13,
    marginTop: 8,
  },
  gasText: {fontSize: 13, marginTop: 15},
  gasView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  slider: {
    height: 40,
    width: 345,
    alignSelf: 'center',
  },
  confirmView: {
    width: 315,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#29DAD7',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 35,
  },
  conText: {
    fontSize: 15,
    color: '#000000',
  },
});
export default TransactionModal;
