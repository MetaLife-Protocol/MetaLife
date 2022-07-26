import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
import {connect} from 'react-redux/lib/exports';
import {RoundBtn} from '../../../../metalife-base';
import {
  getWBalance,
  cionTransact,
  coinContractTransfer,
  getTransferGasPrice,
  getTransferGasLimit,
} from '../../../../remote/wallet/WalletAPI';
import ComText from '../../../../shared/comps/ComText';
import PasswordModel from '../../../../shared/comps/PasswordModal';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {getCurrentAccount} from '../../../../utils';

/**
 * Created on 17 Jun 2022 by amy
 *
 */

const WalletTransfer = props => {
  const {darkMode, wallet, transfer, setTokenOption, addTransactionRecord} =
    props;
  const {tokenOption} = transfer;
  const {navigate, replace} = useNavigation();
  const {flex1, FG, BG, row, justifySpaceBetween, text, marginTop10} =
    useSchemaStyles();

  const currentAccount = getCurrentAccount(wallet);
  const currentBalance =
    wallet.accounts[wallet.current.type][wallet.current.index].balance;
  const [address, setAddress] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [gasPrice, setGasPrice] = useState(18);
  const [gasLimit, setGasLimit] = useState(bigNumberParseUnits('0', 0));
  const [gasPriceNumber, setGasPriceNumber] = useState(18);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastDur, setToastDur] = useState(3000);

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
  }, []);

  useEffect(() => {
    getTransferGasPrice({type: currentAccount.type}).then(res => {
      const price = bigNumberFormatUnits(res.toString(), 9).toString();
      setGasPrice(price.indexOf('.') !== -1 ? price.split('.')[0] : price);
      setGasPriceNumber(Number(bigNumberFormatUnits(res.toString(), 9)));
    });
    getTransferGasLimit({
      type: currentAccount.type,
      fromAddress: currentAccount.address,
      toAddress: address,
      amount: inputAmount ? inputAmount : '0',
      remark: remark ? remark : '',
    }).then(res => {
      if (tokenOption.cType === 'MLT' || tokenOption.cType === 'Mesh') {
        setGasLimit(res.add(40000));
      } else {
        setGasLimit(res);
      }
    });
  }, [address, inputAmount, remark, tokenOption.cType]);

  const onConfirm = () => {
    // inputAmount + gas fee > tokenOption.amount  not success
    const gasFee = bigNumberParseUnits(gasPriceNumber + '', 9).mul(gasLimit);
    if (tokenOption.type === 'spectrum') {
      if (tokenOption.cType === 'SMT') {
        if (
          bigNumberParseUnits(inputAmount.toString())
            .add(gasFee)
            .gt(bigNumberParseUnits(tokenOption.amount))
        ) {
          Toast.show('Insufficient funds', {
            position: Toast.position.CENTER,
          });
          return;
        }
      } else {
        if (
          bigNumberParseUnits(inputAmount.toString()).gt(
            bigNumberParseUnits(tokenOption.amount),
          ) ||
          gasFee.gt(bigNumberParseUnits(currentBalance.SMT))
        ) {
          Toast.show('Insufficient funds', {
            position: Toast.position.CENTER,
          });
          return;
        }
      }
    } else if (tokenOption.type === 'ethereum') {
      if (tokenOption.cType === 'ETH') {
        if (
          bigNumberParseUnits(inputAmount.toString())
            .add(gasFee)
            .gt(bigNumberParseUnits(tokenOption.amount))
        ) {
          Toast.show('Insufficient funds', {
            position: Toast.position.CENTER,
          });
          return;
        }
      }
    }
    setPwdVisible(true);
  };

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
    setToastDur(null);
    try {
      const res = await cionTransact({
        type: currentAccount.type,
        fromAddress: currentAccount.address,
        toAddress: address,
        amount: inputAmount,
        remark: remark,
        password: pwd,
        gasLimit: gasLimit,
        gasPrice: bigNumberParseUnits(gasPriceNumber + '', 9),
      });
      if (res.code === 'success') {
        const params = {
          detail: res.data,
          address: currentAccount.address,
          amount: bigNumberFormatUnits(res.data.value),
          remark: remark,
          type: currentAccount.type,
          cType:
            tokenOption.type === 'spectrum'
              ? 'SMT'
              : tokenOption.type === 'ethereum'
              ? 'ETH'
              : '',
          contract: false,
          date: Date.now(),
          gasUsed: '',
          blockNumber: '',
          status: 'waiting package ...',
          statusImg: icons.complete,
          textColor: '#46C288',
        };
        addTransactionRecord(params);
        setToastVisible(false);
        setPwdVisible(false);
        replace('WalletTransactionDetail', {
          address: currentAccount.address,
          hash: res.data.hash,
        });
      }
      if (res.code === 'fail') {
        setToastVisible(true);
        setToastContent(res.message);
        setToastDur(3000);
      }
    } catch (e) {
      console.warn('confrirm', e);
      setToastVisible(false);
    }
  };
  const onContractTransaction = async (pwd, cType) => {
    setToastVisible(true);
    setToastContent('loading...');
    setToastDur(null);
    try {
      const res = await coinContractTransfer({
        type: currentAccount.type,
        cType,
        fromAddress: currentAccount.address,
        toAddress: address,
        amount: inputAmount,
        remark: remark,
        password: pwd,
        gasLimit: gasLimit,
        gasPrice: bigNumberParseUnits(gasPriceNumber + '', 9),
      });
      if (res.code === 'success') {
        const params = {
          detail: res.data,
          address: currentAccount.address,
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
        addTransactionRecord(params);
        setToastVisible(false);
        setPwdVisible(false);
        replace('WalletTransactionDetail', {
          address: currentAccount.address,
          hash: res.data.hash,
        });
      }
      if (res.code === 'fail') {
        setToastVisible(true);
        setToastContent(res.message);
        setToastDur(3000);
      }
    } catch (e) {
      console.log('confrirm', e);
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
          />
        </View>

        <View style={[marginTop10, styles.marginH15, FG]}>
          <View style={[marginTop10, justifySpaceBetween, row]}>
            <View>
              <ComText style={[text, styles.title]}>Gas</ComText>
            </View>

            <ComText style={[text, styles.gas]}>
              {bigNumberFormatUnits(
                bigNumberParseUnits(gasPriceNumber + '', 9)
                  .mul(gasLimit)
                  .toString(),
              )}{' '}
              {tokenOption.type === 'spectrum'
                ? 'SMT'
                : tokenOption.type === 'ethereum'
                ? 'ETH'
                : ''}
            </ComText>
          </View>
          <Slider
            style={[styles.slider, marginTop10]}
            minimumValue={Number(gasPrice) - 2}
            maximumValue={Number(gasPrice) + 10}
            value={gasPriceNumber}
            thumbTintColor="#29DAD7"
            minimumTrackTintColor="#29DAD7"
            maximumTrackTintColor="#DADADA"
            step={1}
            onValueChange={value => {
              console.log(value);
              setGasPriceNumber(value);
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
          disabled={
            address && Number(inputAmount) > 0 && gasLimit > 0 ? false : true
          }
          title={'Confirm'}
          press={onConfirm}
        />

        <PasswordModel
          darkMode={darkMode}
          pwdVisible={pwdVisible}
          setPwdVisible={setPwdVisible}
          toastVisible={toastVisible}
          setToastVisible={setToastVisible}
          toastContent={toastContent}
          toastDuriation={toastDur}
          onConfirm={onConfirmTransaction}
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
    addTransactionRecord: payload => d({type: 'addTransactionRecord', payload}),
  };
};

export default connect(msp, mdp)(WalletTransfer);
