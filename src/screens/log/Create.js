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

const Create = ({ name, setName, setCurrentAccount, addAccount }) => {
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
  // const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
  
  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  }

  const genMnemonic = (newMnemonic) => {
    while (true) {
      let words = newMnemonic.split(' ');
      const duplicates = words.filter((word, index) => index !== words.indexOf(word));
      if (duplicates.length === 0)
        return newMnemonic;
    }
  }

  const createAccount = async () => {
    // balance = await provider.getBalance("0xa52B964cDE8BD92aAcE42Bec4A19BcDD0f88E1ac");
    // const formatether = ethers.utils.formatEther(balance);
    // console.log(formatether, '<<<<<<<<<<<<<<format ether');

    let randomWallet = ethers.Wallet.createRandom();
    console.log(randomWallet, '<<<<<<<<<<prov');

    const mnemonic = genMnemonic(randomWallet.signingKey.mnemonic);

    let currentAccount = {
      Name: nick,
      Password: pwd,
      PassPrompt: prompt,
      isBackup: true,
      Mnemonic: mnemonic,
      Address: randomWallet.signingKey.address,
      PrivateKey: randomWallet.signingKey.privateKey,
      Keystore: randomWallet.signingKey.publicKey
    };
    console.log(currentAccount, '<<<<<<<<<<<<<<set currentAccount>>>>>>>>>>>>>>>>');
    setCurrentAccount(currentAccount);
    addAccount(currentAccount);
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
    replace('BackupWallet');
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
    addAccount: account => d({ type: 'addAccount', payload: account }),
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
