import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {getWalletSigner} from 'react-native-web3-wallet';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {useSelector} from 'react-redux';
import {financeConfig} from '../../remote/wallet/financeConfig';
import {getAccount} from '../../remote/wallet/WalletAPI';
import {getCurrentAccount} from '../../utils';
import useSchemaStyles from '../UseSchemaStyles';
import {ComModal} from './ComModal';

/**
 *
 * @param {{provider:{getGasPrice:()=>Promise<BigNumber>,getTransactionCount:()=>Promise<number>,sendTransaction:()=>Promise<TransactionResponse>,estimateGas:()=>Promise<BigNumber>,getTransaction:()=>Promise<TransactionResponse>,getTransactionReceipt:()=>Promise<TransactionReceipt>},signTransaction:(transaction: {nonce:number,gasLimit:BigNumber,gasPrice:BigNumber,to:string,chainId:number,value:BigNumber,data:BytesLike})=>Promise<string>}} params
 */
const onConfirmDefault = params => {};

const PasswordModel = ({
  darkMode,
  onConfirm = onConfirmDefault,
  toastVisible = false,
  setToastVisible,
  toastContent,
  pwdVisible,
  setPwdVisible,
  toastDuriation,
}) => {
  const {row, text, alignItemsCenter, placeholderTextColor} = useSchemaStyles();
  const [pwd, setPwd] = useState('');
  const [toastContentState, setToastContentState] = useState(toastContent);
  const [toastDurationState, setToastDurationState] = useState(toastDuriation);
  const wallet = useSelector(state => state.wallet);
  const {address, type} = useMemo(() => {
    return getCurrentAccount(wallet);
  }, [wallet]);

  useEffect(() => {
    setToastContentState(toastContent);
  }, [toastContent]);

  useEffect(() => {
    setToastDurationState(toastDuriation);
  }, [toastDuriation]);

  const onFinish = () => {
    setToastVisible(true);
    setToastContentState('loading');
    setToastDurationState(null);
    getAccount(address, (isSuccess, keystore) => {
      if (isSuccess) {
        getWalletSigner(
          financeConfig.chains[type].rpcURL,
          JSON.stringify(keystore),
          pwd,
        )
          .then(res => {
            setToastVisible(false);
            // console.log('getWalletSigner', JSON.stringify(res));
            onConfirm(res);
          })
          .catch(err => {
            setToastVisible(true);
            setToastContentState(err.message);
            setToastDurationState(3000);
            console.log('getWalletSigner-error', err);
          });
      } else {
        setToastVisible(false);
      }
    });
  };

  return (
    <ComModal
      visible={pwdVisible}
      setVisible={setPwdVisible}
      title={'Enter Password'}
      darkMode={darkMode}
      toastDuriation={toastDurationState}
      content={
        <View style={[alignItemsCenter, styles.inputContiner, row]}>
          <TextInput
            allowFontScaling={false}
            keyboardType={'ascii-capable'}
            autoCapitalize={'none'}
            textAlign={'left'}
            value={pwd}
            textContentType={'password'}
            secureTextEntry={true}
            placeholder={'Wallet password'}
            placeholderTextColor={placeholderTextColor.color}
            onChangeText={setPwd}
            style={[text, styles.input]}
          />
          <Pressable onPress={() => setPwd('')}>
            <Image
              style={styles.delete}
              source={darkMode ? iconDic.deleteIconB : iconDic.deleteIconW}
            />
          </Pressable>
        </View>
      }
      toastVisible={toastVisible}
      setToastVisible={setToastVisible}
      toastContent={toastContentState}
      submit={{
        text: 'Confirm',
        press: onFinish,
      }}
      cancel={{
        text: 'Cancel',
        press: () => {
          setPwd('');
        },
      }}
    />
  );
};

const iconDic = {
  deleteIconB: require('../../assets/image/wallet/Login_icon_delete_white.png'),
  deleteIconW: require('../../assets/image/wallet/Login_icon_delete.png'),
};

const styles = StyleSheet.create({
  inputContiner: {
    display: 'flex',
    borderColor: '#4E586E',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 15,
    marginVertical: 15,
    borderWidth: 0.5,
  },
  input: {
    flexGrow: 1,
    fontSize: 15,
    lineHeight: 20,
  },
});

export default PasswordModel;
