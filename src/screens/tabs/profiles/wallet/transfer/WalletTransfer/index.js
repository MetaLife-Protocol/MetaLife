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
import {RoundBtn} from '../../../../../../metalife-base';
import {
  getWBalance,
  cionTransact,
  coinContractTransfer,
  getTransferGasPrice,
  getTransferGasLimit,
} from '../../../../../../remote/wallet/WalletAPI';
import ComText from '../../../../../../shared/comps/ComText';
import PasswordModel from '../../../../../../shared/comps/PasswordModal';
import useSchemaStyles from '../../../../../../shared/UseSchemaStyles';
import {fixWalletAddress, getCurrentAccount} from '../../../../../../utils';
import {getMainCoinName, isMainCoin} from '../../../../../../utils/chainUtils';
import TransactionInfoModal from './comp/TransactionInfoModal';

/**
 * Created on 17 Jun 2022 by amy
 *
 */

const WalletTransfer = props => {
  const {
    darkMode,
    wallet,
    transfer,
    setTokenOption,
    addTransactionRecord,
    route: {params},
  } = props;
  const {tokenOption} = transfer;
  const {navigate, replace} = useNavigation();
  const {flex1, FG, BG, row, justifySpaceBetween, text, marginTop10} =
    useSchemaStyles();

  const currentAccount = getCurrentAccount(wallet);
  const currentBalance =
    wallet.accounts[wallet.current.type][wallet.current.index].balance;
  const [address, setAddress] = useState(
    params?.address ? params?.address : '',
  );
  const [inputAmount, setInputAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [gasPrice, setGasPrice] = useState(bigNumberParseUnits('18', 9));
  const [gasLimit, setGasLimit] = useState(bigNumberParseUnits('0', 0));
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastDur, setToastDur] = useState(3000);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  useEffect(() => {
    // 先获取当前转账余额
    getWBalance(currentAccount.type, currentAccount.address, res => {
      setTokenOption({
        option: 'coin',
        type: currentAccount.type,
        cType: getMainCoinName(currentAccount.type),
        amount: res,
      });
    });
  }, []);

  const onConfirm = () => {
    // inputAmount + gas fee > tokenOption.amount  not success
    if (!tokenOption.amount) {
      Toast.show('Funds is null, select again!', {
        position: Toast.position.CENTER,
      });
      return;
    }
    const gasFee = gasPrice.mul(gasLimit);
    if (isMainCoin(tokenOption.type, tokenOption.cType)) {
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
    setPwdVisible(true);
  };

  const onPwdModalConfirm = pwd => {
    setToastVisible(true);
    setToastContent('loading...');
    setToastDur(null);
    try {
      getTransferGasPrice({type: currentAccount.type})
        .then(gasPriceRes => {
          setGasPrice(gasPriceRes);
          getTransferGasLimit({
            type: currentAccount.type,
            fromAddress: currentAccount.address,
            toAddress: address,
            amount: inputAmount ? inputAmount : '0',
            remark: remark ? remark : '',
            cType: tokenOption.cType,
            pwd,
          })
            .then(gasLimitRes => {
              setGasLimit(gasLimitRes);

              const price = bigNumberFormatUnits(
                gasPriceRes.toString(),
                9,
              ).toString();
              const data = {
                info: 'Transfer ' + tokenOption.cType,
                from: fixWalletAddress(currentAccount.address),
                to: address,
                gasPrice: gasPriceRes,
                gasPriceNumber:
                  price.indexOf('.') !== -1 ? price.split('.')[0] : price,
                gasLimit: gasLimitRes,
                price: inputAmount + ' ' + tokenOption.cType,
                pwd,
              };
              setPwdVisible(false);
              setToastVisible(false);
              setConfirmData(data);
              setConfirmVisible(true);
            })
            .catch(e => {
              setToastVisible(true);
              setToastContent(e.message);
              setToastDur(3000);
            });
        })
        .catch(console.warn);
    } catch (e) {
      setToastVisible(false);
      setToastVisible(false);
    }
  };

  const onInfoModalConfirm = pwd => {
    try {
      if (isMainCoin(tokenOption.type, tokenOption.cType)) {
        onTransaction(pwd);
      } else {
        onContractTransaction(pwd, tokenOption.cType);
      }
    } catch (e) {
      console.log(e);
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
        gasPrice: gasPrice,
      });
      if (res.code === 'success') {
        const params = {
          detail: res.data,
          address: currentAccount.address,
          amount: bigNumberFormatUnits(res.data.value),
          remark: remark,
          type: currentAccount.type,
          cType: getMainCoinName(tokenOption.type),
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
        setConfirmVisible(false);
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
        gasPrice: gasPrice,
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
        setConfirmVisible(false);
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
      console.log('confirm', e);
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
              allowFontScaling={false}
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
              allowFontScaling={false}
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
            allowFontScaling={false}
            style={[text, styles.inputText, marginTop10]}
            placeholder="Enter comments"
            placeholderTextColor={'#A5ABB7'}
            value={remark}
            onChangeText={setRemark}
          />
        </View>
        <RoundBtn
          style={[styles.btnContainer, marginTop10]}
          disabled={address && Number(inputAmount) > 0 ? false : true}
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
          onConfirm={onPwdModalConfirm}
        />

        <TransactionInfoModal
          darkMode={darkMode}
          visible={confirmVisible}
          setVisible={setConfirmVisible}
          data={confirmData}
          onConfirm={onInfoModalConfirm}
          toastVisible={toastVisible}
          setToastVisible={setToastVisible}
          toastContent={toastContent}
          toastDuriation={toastDur}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const icons = {
  scanBlack: require('../../../../../../assets/image/icons/icon_scan_default_black.png'),
  scanWhite: require('../../../../../../assets/image/icons/icon_scan_default_white.png'),
  contactBlack: require('../../../../../../assets/image/icons/icon_contact_default_black.png'),
  contactWhite: require('../../../../../../assets/image/icons/icon_contact_default_white.png'),
  right: require('../../../../../../assets/image/shared/back.png'),
  complete: require('../../../../../../assets/image/wallet/Transactioncomplete.png'),
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
