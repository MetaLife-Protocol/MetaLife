import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
import {connect} from 'react-redux/lib/exports';
import {RoundBtn, useDialog} from '../../../../metalife-base';
import {
  getGas,
  getWBalance,
  cionTransact,
  coinContractTransfer,
} from '../../../../remote/wallet/WalletAPI';
import ComText from '../../../../shared/comps/ComText';
import PasswordModel from '../../../../shared/comps/PasswordModal';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {getCurrentAccount} from '../../../../utils';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const Loading = () => {
  return <ActivityIndicator />;
};

const WalletTransfer = props => {
  const dialog = useDialog();
  const {darkMode, wallet, transfer, setTokenOption, setTransactionDetail} =
    props;
  const {tokenOption} = transfer;
  const {navigate} = useNavigation();
  const {flex1, FG, BG, row, justifySpaceBetween, text, marginTop10} =
    useSchemaStyles();

  const currentAccount = getCurrentAccount(wallet);
  const [address, setAddress] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [remark, setRemark] = useState('');
  // TODO: fixed gas fee
  const initGas = bigNumberFormatUnits(
    bigNumberParseUnits('18', 9).mul(21100).toString(),
  );
  const [gas, setGas] = useState({
    gasPriceNumber: 18,
    gas: initGas,
    gasLimit: 21100,
  });
  const [gasPrice, setGasPrice] = useState(18);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');

  const getGasCallback = (inputAmount, remark) => {
    let amount = inputAmount;
    if (tokenOption.type === 'spectrum') {
      if (tokenOption.cType !== 'SMT') {
        amount = '';
      }
    } else if (tokenOption.type === 'ethereum') {
    }
    dialog.show(<Loading />);
    getGas({
      type: currentAccount.type,
      fromAddress: currentAccount.address,
      toAddress: address,
      amount: amount ? amount : '0',
      remark: remark ? remark : '',
    })
      .then(gasRes => {
        setGas({...gasRes});
        setGasPrice(gasRes.gasPriceNumber);
        dialog.dismiss();
      })
      .catch(e => {
        dialog.dismiss();
      });
  };

  useEffect(() => {
    // 先获取当前转账余额
    getWBalance(currentAccount.type, currentAccount.address, res => {
      setTokenOption({
        option: 'coin',
        type: currentAccount.type,
        cType:
          currentAccount.type === 'spectrum'
            ? 'SMT'
            : currentAccount.type === 'ethereum'
            ? 'ETH'
            : '',
        amount: res,
      });
    });
    getGasCallback();
    // }
  }, []);

  // useEffect(() => {
  //   console.log('input', inputAmount, remark);
  //   Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  //   return () => {
  //     Keyboard.removeAllListeners('keyboardDidHide', _keyboardDidHide);
  //   };
  // }, [inputAmount, remark]);

  // const _keyboardDidHide = e => {
  //   console.log('ssss', e);
  //   console.log(inputAmount, remark);
  // };

  const onConfirmTransaction = pwd => {
    if (tokenOption.type === 'spectrum') {
      if (tokenOption.cType === 'SMT') {
        onTransaction(pwd);
      } else {
        onContractTransaction(pwd, tokenOption.cType);
      }
    } else if (tokenOption.type === 'ethereum') {
      if (tokenOption.cType === 'ETH') {
        onTransaction(pwd);
      }
    }
  };

  const onTransaction = async pwd => {
    setToastVisible(true);
    setToastContent('loading...');
    try {
      const res = await cionTransact({
        type: currentAccount.type,
        fromAddress: currentAccount.address,
        toAddress: address,
        amount: inputAmount,
        remark: remark,
        password: pwd,
        gasLimit: gas?.gasLimit,
        gasPrice: gas?.gasPrice,
      });
      if (res.code === 'success') {
        const params = {
          detail: res.data,
          amount: bigNumberFormatUnits(res.data.value),
          remark: remark,
          type: currentAccount.type,
          contract: false,
          date: Date.now(),
          gasUsed: '',
          blockNumber: '',
          status: 'waiting package ...',
          statusImg: icons.complete,
          textColor: '#46C288',
        };
        setTransactionDetail(params);
        setToastVisible(false);
        setPwdVisible(false);
        navigate('WalletTransactionDetail');
      }
      if (res.code === 'fail') {
        setToastVisible(true);
        setToastContent(res.message);
      }
    } catch (e) {
      console.warn('confrirm', e);
      setToastVisible(false);
    }
  };
  const onContractTransaction = async (pwd, cType) => {
    setToastVisible(true);
    setToastContent('loading...');
    try {
      const res = await coinContractTransfer({
        type: currentAccount.type,
        cType,
        fromAddress: currentAccount.address,
        toAddress: address,
        amount: inputAmount,
        remark: remark,
        password: pwd,
        gasLimit: gas?.gasLimit,
        gasPrice: gas?.gasPrice,
      });
      if (res.code === 'success') {
        console.log('contract coin', res.data);
        const params = {
          detail: res.data,
          amount: inputAmount,
          remark: remark,
          type: currentAccount.type,
          contract: true,
          cType,
          date: Date.now(),
          gasUsed: '',
          blockNumber: '',
          status: 'waiting package ...',
          statusImg: icons.complete,
          textColor: '#46C288',
        };
        setTransactionDetail(params);
        setToastVisible(false);
        setPwdVisible(false);
        navigate('WalletTransactionDetail');
      }
      if (res.code === 'fail') {
        setToastVisible(true);
        setToastContent(res.message);
      }
    } catch (e) {
      console.warn('confrirm', e);
      setToastVisible(false);
    }
  };
  return (
    <SafeAreaView style={[flex1]}>
      <Pressable
        style={[flex1, BG]}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={[styles.marginH15, FG]}>
          <View style={[row, justifySpaceBetween]}>
            <ComText style={[text, styles.title]}>Receiving account</ComText>
            <View style={[row]}>
              <Pressable
                style={[styles.marginR15]}
                onPress={() => {
                  navigate('Scan', {onCallbackData: setAddress});
                }}>
                <Image source={darkMode ? icons.scanBlack : icons.scanWhite} />
              </Pressable>
              <Pressable
                onPress={() => {
                  navigate('AddressContact', {onCallbackData: setAddress});
                }}>
                <Image
                  source={darkMode ? icons.contactBlack : icons.contactWhite}
                />
              </Pressable>
            </View>
          </View>
          <View style={[text, marginTop10]}>
            <TextInput
              style={[text, styles.inputText, styles.title]}
              placeholder="Type or paste address"
              placeholderTextColor={'#A5ABB7'}
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>
        <View style={[styles.marginH15, FG]}>
          <View style={[row, justifySpaceBetween]}>
            <ComText style={[text, styles.title]}>Transfers number</ComText>
            <Pressable
              style={[row]}
              onPress={() => navigate('TokenOption', {select: true})}>
              <ComText style={[styles.marginR15, text]}>
                {tokenOption.cType}
              </ComText>
              <Image source={icons.right} />
            </Pressable>
          </View>
          <View style={[marginTop10]}>
            <TextInput
              style={[text, styles.inputText]}
              placeholder="Enter transfer amount"
              placeholderTextColor={'#A5ABB7'}
              keyboardType={'numeric'}
              value={inputAmount}
              onChangeText={setInputAmount}
              onEndEditing={() => {
                Number(inputAmount) > 0 && getGasCallback(inputAmount, remark);
              }}
            />
          </View>
          <View style={[marginTop10, justifySpaceBetween, row]}>
            <ComText style={[text, styles.title]}>Amount</ComText>
            <ComText style={[text, styles.number]}>
              {tokenOption.amount + ' ' + tokenOption.cType}
            </ComText>
          </View>
        </View>
        <View style={[styles.marginH15, FG]}>
          <ComText style={[text, styles.title]}>Remark</ComText>
          <TextInput
            style={[text, styles.inputText, marginTop10]}
            placeholder="Enter comments"
            placeholderTextColor={'#A5ABB7'}
            value={remark}
            onChangeText={setRemark}
            onEndEditing={() =>
              Number(inputAmount) > 0 && getGasCallback(inputAmount, remark)
            }
          />
        </View>

        <View style={[marginTop10, styles.marginH15, FG]}>
          <View style={[marginTop10, justifySpaceBetween, row]}>
            <ComText style={[text, styles.title]}>Gas</ComText>
            <ComText style={[text, styles.gas]}>
              {gas.gas}{' '}
              {tokenOption.type === 'spectrum'
                ? 'SMT'
                : tokenOption.type === 'ethereum'
                ? 'ETH'
                : ''}
            </ComText>
          </View>
          <Slider
            style={[styles.slider, marginTop10]}
            minimumValue={gasPrice - 2}
            maximumValue={gasPrice + 10}
            value={gas.gasPriceNumber}
            thumbTintColor="#29DAD7"
            minimumTrackTintColor="#29DAD7"
            maximumTrackTintColor="#DADADA"
            step={1}
            onValueChange={value => {
              const newGas = {
                ...gas,
                gasPriceNumber: value,
                gasPrice: bigNumberParseUnits(value + '', 9),
                gas: bigNumberFormatUnits(
                  bigNumberParseUnits(value.toString(), 9)
                    .mul(gas?.gasLimit)
                    .toString(),
                ),
              };
              setGas(newGas);
            }}
          />
        </View>
        {/* <View style={[row, styles.marginH15, styles.setting]}>
          <ComText style={[text, styles.settingText]}>
            Advanced settings
          </ComText>
          <Image source={icons.right} />
        </View> */}
        <RoundBtn
          style={[styles.btnContainer, marginTop10]}
          disabled={address && Number(inputAmount) > 0 ? false : true}
          title={'Confirm'}
          press={() => {
            setPwdVisible(true);
          }}
        />

        <PasswordModel
          darkMode={darkMode}
          pwdVisible={pwdVisible}
          setPwdVisible={setPwdVisible}
          toastVisible={toastVisible}
          setToastVisible={setToastVisible}
          toastContent={toastContent}
          onConfirm={pwd => {
            onConfirmTransaction(pwd);
          }}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const icons = {
  scanBlack: require('../../../../assets/image/icons/icon_scan_default_black.png'),
  scanWhite: require('../../../../assets/image/icons/icon_scan_default_white.png'),
  contactBlack: require('../../../../assets/image/icons/icon_contact_default_black.png'),
  contactWhite: require('../../../../assets/image/icons/icon_contact_default_white.png'),
  right: require('../../../../assets/image/shared/back.png'),
  complete: require('../../../../assets/image/wallet/Transactioncomplete.png'),
};

const styles = StyleSheet.create({
  title: {
    fontSize: Platform.OS === 'ios' ? 14 : 13,
    lineHeight: 17,
  },
  marginH15: {
    padding: 15,
    marginTop: 10,
  },
  marginR15: {
    marginRight: 15,
  },
  line2: {
    height: 0.5,
    marginTop: 10,
  },
  inputText: {
    fontSize: 16,
    height: 30,
    padding: 0,
  },
  number: {
    fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 20,
  },
  gas: {
    fontSize: 14,
    lineHeight: 17,
  },
  slider: {
    height: 40,
    paddingLeft: 10,
  },
  setting: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  settingText: {
    fontSize: 14,
    marginRight: 10,
    color: '#0ff',
  },
});

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
    wallet: s.wallet,
    transfer: s.transfer,
  };
};

const mdp = d => {
  return {
    setTokenOption: payload => d({type: 'setTokenOption', payload}),
    setTransactionDetail: payload => d({type: 'setTransactionDetail', payload}),
  };
};

export default connect(msp, mdp)(WalletTransfer);
