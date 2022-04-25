import React, { useState, useEffect } from 'react';
import { StatusBar, TextInput, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import SchemaStyles, { colorsSchema } from '../../shared/SchemaStyles';
import { connect } from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import bip39 from 'react-native-bip39';
// import bip32 from 'bip32';
// import ethUtil from 'ethereumjs-util';
import { ethers } from 'ethers';
import { randomBytes } from 'react-native-randombytes'
import { restrict } from '../../utils';

const iconDic = {
  Clear_icon_default: require('../../assets/image/accountBtn/Clear_icon_default.png'),
  Clear_icon_selected: require('../../assets/image/accountBtn/Clear_icon_selected.png'),
  Dark_icon_default: require('../../assets/image/accountBtn/Dark_icon_default.png'),
  Dark_icon_selected: require('../../assets/image/accountBtn/Dark_icon_selected.png'),
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
};

const Create = ({ name, setName, setCurrentAccount }) => {
  const { barStyle, BG, FG, flex1, input, text, marginTop10 } = SchemaStyles(),
    { textHolder } = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    [prompt, setPrompt] = useState(''),
    { replace } = useNavigation();

  const [mnemonic, setMnemonic] = useState('')
  const [focusedClear, setfocusedClear] = useState(true);
  const [focusedDark, setfocusedDark] = useState(true);
  const [focusedConfirm, setfocusedConfirm] = useState(true);

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  }

  const genMnemonic = () => {
    while (true) {
      const randomBytes = ethers.utils.randomBytes(16);
      const result = ethers.utils.HDNode.entropyToMnemonic(randomBytes);
      let words = result.split(' ');
      const duplicates = words.filter((word, index) => index !== words.indexOf(word));
      console.log(words);
      if (duplicates.length === 0)
        return result;
    }
  }

  const createAccount = () => {
    const mnemonic = genMnemonic();
    console.log(mnemonic);


    // const seed = bip39.mnemonicToSeed(mnemonic);
    // const root = bip32.fromSeed(seed);

    // // 이더리움 차일드 개인키 생성
    // const derivePath = "m/44'/60'/0'/0/0";
    // const xPrivKey = root.derivePath(derivePath);
    // const privateKey = xPrivKey.privateKey.toString('hex');

    // // 이더리움 주소 생성
    // let address = ethUtil.pubToAddress(xPrivKey.publicKey, true).toString('hex');
    // address = ethUtil.toChecksumAddress(address).toString('hex');

    const idx = 0;
    let path = `m/44'/60'/${idx}'/0/0`;
    let account = ethers.Wallet.fromMnemonic(mnemonic, path);
    let provider = ethers.getDefaultProvider();
    // const account = provider.eth.accounts.create();
    // const keystore = encryptKeyStore(provider,  account.privateKey, pwd);
    console.log(account.address, account.privateKey);
    // replace('Backup Wallet');
    let currentAccount = {
      Name: nick,
      Password: pwd,
      PassPrompt: prompt,
      isBackup: false,
      Mnemonic: mnemonic,
      Address: account.address,
      PrivateKey: account.privateKey,
      Keystore: ''
    };
    setCurrentAccount(currentAccount);
  }

  const createWallet = () => {
    createAccount();
    /*
    randomBytes(16, (error, bytes) => {
      const mnemonic = ethers.utils.HDNode.entropyToMnemonic(bytes, ethers.wordlists.en);
      setMnemonic(mnemonic);

      console.log(mnemonic);

      let Account_object = {
        name: nick,
        password: pwd,
        mnemonic: mnemonic,
      };
  
      _storeData = async () => {
        try {
          await AsyncStorage.setItem(
            'Account',
            JSON.stringify(Account_object),
          );
        } catch (error) {
          console.log("error", error);
        }
      };
  
      _storeData();
  
      console.log("account data stored");
    });

    console.log(mnemonic);*/
    replace('Backup Wallet');
  }

  useEffect(() => {
    // randomBytes(16, (error, bytes) => {
    //   const mnemonic = ethers.utils.HDNode.entropyToMnemonic(bytes, ethers.wordlists.en);
    //   console.log(mnemonic);
    // });

  }, []);

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <View>
          <View style={[styles.inputBox]}>
            <TextInput
              style={[text, styles.inputText]}
              placeholder={'Account Name'}
              placeholderTextColor={textHolder}
              onChangeText={setNick}
              value={nick}
              maxLength={30}
            />
            <TouchableOpacity onPress={() => cleaerPress()}>
              <Image
                style={styles.icon}
                source={iconDic['Clear_icon_' + (focusedClear ? 'selected' : 'default')]}
              />
            </TouchableOpacity>
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
              onChangeText={setPrompt}
              maxLength={20}
            />
          </View>
          <Text style={[{
            fontSize: 16, color: "#4E586E", marginTop: 10,
          }]}>
            Note:MetaLife waller does not save user password
            nor provide backups.All password are required to
            backup using encrypted private key.We highly
            recommended to backup and save your private key
            at the same time,otherwise your wallet can never
            be retrieved.
          </Text>
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{ marginBottom: 50 }}
          title={'Create Account'}
          disabled={!(nick && pwd && confirm && pwd == confirm)}
          press={() => createWallet()}
        />
      </View>
    </View>
  );
};

const msp = s => {
  return {};
};

const mdp = d => {
  return {
    setName: name => d({ type: 'set', payload: name }),
    deleteName: name => d({ type: 'delete' }),
    setCurrentAccount: account => d({ type: 'setCurrentAccount', payload: account }),
  };
};


const styles = StyleSheet.create({
  inputBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  body: {
    padding: 15,
  },
  inputText: {
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  }
});

export default connect(msp, mdp)(Create);
