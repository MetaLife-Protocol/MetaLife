import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  TextInput,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import SchemaStyles, { colorsSchema } from '../../shared/SchemaStyles';
import { connect } from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
// import Web3 from 'web3';
// const web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/5209c849762f40ce866e3b1332596997'));

const iconDic = {
  Clear_icon_default: require('../../assets/image/accountBtn/Clear_icon_default.png'),
  Clear_icon_selected: require('../../assets/image/accountBtn/Clear_icon_selected.png'),
  Dark_icon_default: require('../../assets/image/accountBtn/Dark_icon_default.png'),
  Dark_icon_selected: require('../../assets/image/accountBtn/Dark_icon_selected.png'),
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
  Scan_icon_dark: require('../../assets/image/accountBtn/Scan_icon_black.png'),
  Scan_icon_white: require('../../assets/image/accountBtn/Scan_icon_white.png'),
  Back_icon_dark: require('../../assets/image/walletBtn/back-black.png'),
  Back_icon_white: require('../../assets/image/walletBtn/back-white.png'),
};

const Import = ({ name, setName, darkMode, setCurrentAccount, addAccount }) => {
  const { barStyle, BG, FG, flex1, input, text, marginTop10 } = SchemaStyles(),
    { textHolder } = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    [keystorePwd, setKeystorePwd] = useState(''),
    [tab, setTab] = useState(0),
    { replace } = useNavigation();

  const [mnemonic, setMnemonic] = useState('');
  const [pwdPrompt, setPwdPrompt] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [observe, setObserve] = useState('');
  const [keystore, setKeystore] = useState('');
  const [focusedClear, setfocusedClear] = useState(true);
  const [focusedDark, setfocusedDark] = useState(true);
  const [focusedConfirm, setfocusedConfirm] = useState(true);

  const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  };

  const importWallet = async () => {
    let balance = 0;
    let currentAccount = {
      Name: "sample",
      Password: pwd,
      PassPrompt: pwdPrompt,
      isBackup: false,
      Mnemonic: '',
      Address: '',
      PrivateKey: '',
      Balance: balance,
      Keystore: '',
    };
  if(tab == 0) {
      // const idx = 0;
      // let path = `m/44'/60'/${idx}'/0/0`;
      let account = await ethers.Wallet.fromMnemonic(mnemonic);
      const json = await account.encrypt(pwd, {scrypt: {N: 64}});
      // ethers.Wallet.fromEncryptedJson(json, pwd).then(async function(wallet) {
      //   const hex_balance = await provider.getBalance(wallet.address);
      //   balance = ethers.utils.formatEther(hex_balance);
      // });
      currentAccount.Keystore = json;
      currentAccount.Mnemonic = mnemonic;
      currentAccount.Address = account.address;
      currentAccount.PrivateKey = account.privateKey;
      const hex_balance = await provider.getBalance(account.address);
      balance = ethers.utils.formatEther(hex_balance);
      currentAccount.Balance = balance;
      setCurrentAccount(currentAccount);
      addAccount(currentAccount);
    } else if(tab == 1) {
      ethers.Wallet.fromEncryptedJson(keystore, keystorePwd).then( async function(wallet) {
        const hex_balance = await provider.getBalance(wallet.address);
        balance = ethers.utils.formatEther(hex_balance);
        currentAccount.Address = wallet.address;
        // currentAccount.Mnemonic = wallet.mnemonic;
        currentAccount.Balance = balance;
        currentAccount.Keystore = keystore;
        currentAccount.PrivateKey = wallet.privateKey;
        setCurrentAccount(currentAccount);
        addAccount(currentAccount);
      });
    } else if(tab == 2) {
      let account = new ethers.Wallet(privateKey);
      const hex_balance = await provider.getBalance(account.address);
      balance = ethers.utils.formatEther(hex_balance);
      currentAccount.Address = account.address;
      currentAccount.PrivateKey = privateKey;
      currentAccount.Balance = balance;
      const json = await account.encrypt(pwd, {scrypt: {N: 64}});
      currentAccount.Keystore = json;
      setCurrentAccount(currentAccount);
      addAccount(currentAccount);
    } else if(tab == 3) {
        const hex_balance = await provider.getBalance(observe);
        balance = ethers.utils.formatEther(hex_balance);
        currentAccount.Address = observe;
        currentAccount.Balance = balance;
        setCurrentAccount(currentAccount);
    }
    console.log(currentAccount, '>>>>>>>>>current account');
    replace('Wallet');
  }

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, styles.header]}>
        <TouchableOpacity onPress={() => replace('Wallet')}>
          <Image
            style={{width: 15, height: 15}}
            source={iconDic['Back_icon_' + (!darkMode ? 'dark' : 'white')]}
          />
        </TouchableOpacity>
        <View style={[{paddingLeft: 35}]}>
          <Text style={[text, {fontSize: 20, fontWeight: '500'}]}>ImportAccount</Text>
        </View>
      </View>
      <View style={[FG, flex1, marginTop10]}>
        <View>
          <View style={[styles.tab]}>
            <View style={[tab == 0 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(0)}>
                <Text style={[styles.inputText, tab == 0 ? text : null]}>
                  Mnemonic
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[tab == 1 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(1)}>
                <Text style={[styles.inputText, tab == 1 ? text : null]}>
                  Keystore
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[tab == 2 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(2)}>
                <Text style={[styles.inputText, tab == 2 ? text : null]}>
                  Private Key
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[tab == 3 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(3)}>
                <Text style={[styles.inputText, tab == 3 ? text : null]}>
                  Observe
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Mnemonic */}
          {tab == 0 ? <View style={[styles.body]}>
            <View style={[styles.area]}>
              <TextInput
                style={[text, styles.inputText, styles.areaText]}
                placeholder={'Please use space to separate the mnemonic words'}
                numberOfLines={4}
                multiline={true}
                placeholderTextColor={textHolder}
                onChangeText={setMnemonic}
              />
            </View>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Set Password'}
                secureTextEntry={focusedConfirm ? true : false}
                placeholderTextColor={textHolder}
                onChangeText={setPwd}
              />
              <TouchableOpacity onPress={() => setfocusedDark(!focusedDark)}>
                <Image
                  style={styles.icon}
                  source={iconDic['Dark_icon_' + (focusedDark ? 'selected' : 'default')]}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Confirm Password'}
                secureTextEntry={focusedConfirm ? true : false}
                placeholderTextColor={textHolder}
                onChangeText={setConfirm}
                maxLength={20}
              />
              <TouchableOpacity onPress={() => setfocusedConfirm(!focusedConfirm)}>
                <Image
                  style={styles.icon}
                  source={iconDic['Confirm_icon_' + (focusedConfirm ? 'selected' : 'default')]}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Password prompt (optional)'}
                placeholderTextColor={textHolder}
                onChangeText={setPwdPrompt}
                maxLength={20}
              />
            </View>
          </View> : null}
          {/* Keystore */}
          {tab == 1 ? <View style={[styles.body]}>
            <Text style={[{
              fontSize: 16, color: "#4E586E", marginBottom: 10,
            }]}>
              Copy and paste Ether keystore.
            </Text>
            <View style={[styles.area]}>
              <TextInput
                style={[text, styles.inputText, styles.areaText]}
                placeholder={'Keystore text content'}
                numberOfLines={4}
                multiline={true}
                placeholderTextColor={textHolder}
                onChangeText={setKeystore}
              />
            </View>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Keystore Password'}
                secureTextEntry={focusedConfirm ? true : false}
                placeholderTextColor={textHolder}
                onChangeText={setKeystorePwd}
              />
              <TouchableOpacity onPress={() => setfocusedDark(!focusedDark)}>
                <Image
                  style={styles.icon}
                  source={iconDic['Dark_icon_' + (focusedDark ? 'selected' : 'default')]}
                />
              </TouchableOpacity>
            </View>
          </View> : null}
          {/* Private Key */}
          {tab == 2 ? <View style={[styles.body]}>
            <View style={[styles.area]}>
              <TextInput
                style={[text, styles.inputText, styles.areaText]}
                placeholder={'Please enter the private key in text.'}
                numberOfLines={4}
                multiline={true}
                placeholderTextColor={textHolder}
                onChangeText={setPrivateKey}
              />
            </View>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Set Password'}
                secureTextEntry={focusedConfirm ? true : false}
                placeholderTextColor={textHolder}
                onChangeText={setPwd}
              />
              <TouchableOpacity onPress={() => setfocusedDark(!focusedDark)}>
                <Image
                  style={styles.icon}
                  source={iconDic['Dark_icon_' + (focusedDark ? 'selected' : 'default')]}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Confirm Password'}
                secureTextEntry={focusedConfirm ? true : false}
                placeholderTextColor={textHolder}
                onChangeText={setConfirm}
                maxLength={20}
              />
              <TouchableOpacity onPress={() => setfocusedConfirm(!focusedConfirm)}>
                <Image
                  style={styles.icon}
                  source={iconDic['Confirm_icon_' + (focusedConfirm ? 'selected' : 'default')]}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Password prompt (optional)'}
                placeholderTextColor={textHolder}
                onChangeText={setPwdPrompt}
                maxLength={20}
              />
            </View>
          </View> : null}
          {/* Observe */}
          {tab == 3 ? <View style={[styles.body]}>
            <Text style={[{
              fontSize: 16, color: "#4E586E", marginBottom: 10,
            }]}>
              Observe mode only needs the wallet address
            </Text>
            <View style={[styles.inputBox]}>
              <TextInput
                style={[text, styles.inputText]}
                placeholder={'Enter the address'}
                secureTextEntry={focusedConfirm ? true : false}
                placeholderTextColor={textHolder}
                onChangeText={setObserve}
              />
              <TouchableOpacity onPress={() => setfocusedDark(!focusedDark)}>
                <Image
                  style={styles.icon}
                  source={iconDic['Scan_icon_' + (darkMode ? 'dark' : 'white')]}
                />
              </TouchableOpacity>
            </View>
          </View> : null}
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{ marginBottom: 50 }}
          title={'Start Importing'}
          disabled={!(((mnemonic || privateKey) && pwd && confirm && pwd == confirm) || observe || (keystore && keystorePwd))}
          press={() => importWallet()}
        />
      </View>
    </View>
  );
};

const msp = s => {
  return {
    darkMode: s.cfg.darkMode
  };
};

const mdp = d => {
  return {
    setName: name => d({ type: 'set', payload: name }),
    deleteName: name => d({ type: 'delete' }),
    setCurrentAccount: account => d({ type: 'setCurrentAccount', payload: account }),
    addAccount: account => d({ type: 'addAccount', payload: account }),
  };
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    display: 'flex',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputText: {
    fontSize: 16,
    color: '#8E8E92',
  },
  icon: {
    width: 20,
    height: 20,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingTop: 17.5,
    paddingHorizontal: 15,
    paddingBottom: 0,
  },
  active: {
    borderBottomWidth: 2,
    borderBottomColor: '#29DAD7',
    paddingBottom: 10,
  },
  area: {
    height: 135,
    width: "100%",
    borderWidth: 1,
    borderColor: "#4E586E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  areaText: {
    textAlignVertical: 'top',
  }
});

export default connect(msp, mdp)(Import);
