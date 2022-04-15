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

const iconDic = {
  Clear_icon_default: require('../../assets/image/accountBtn/Clear_icon_default.png'),
  Clear_icon_selected: require('../../assets/image/accountBtn/Clear_icon_selected.png'),
  Dark_icon_default: require('../../assets/image/accountBtn/Dark_icon_default.png'),
  Dark_icon_selected: require('../../assets/image/accountBtn/Dark_icon_selected.png'),
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
};

const Create = ({ name, setName }) => {
  const { barStyle, BG, FG, flex1, input, text, marginTop10 } = SchemaStyles(),
    { textHolder } = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    { replace } = useNavigation();

  const [mnemonic, setMnemonic] = useState('')
  const [focusedClear, setfocusedClear] = useState(true);
  const [focusedDark, setfocusedDark] = useState(true);
  const [focusedConfirm, setfocusedConfirm] = useState(true);

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  }

  const createWallet = () => {
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

    /*
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

    await _storeData();

    console.log("account data stored");

    */
    // asynchronous API
    // uses iOS-side SecRandomCopyBytes
/*     randomBytes(4, (err, bytes) => {
      // bytes is a Buffer object
      console.log(bytes.toString('hex'))
    })
    randomBytes(16, (error, bytes) => {
      const mnemonic = ethers.utils.HDNode.entropyToMnemonic(bytes, ethers.wordlists.en);
      console.log(mnemonic);
      console.log(bip39.mnemonicToSeedHex('basket actual'))
     const seed = bip39.mnemonicToSeed(mnemonic);
      const root = bip32.fromSeed(seed);

      // 이더리움 차일드 개인키 생성
      const derivePath = "m/44'/60'/0'/0/0";
      const xPrivKey = root.derivePath(derivePath);
      const privateKey = xPrivKey.privateKey.toString('hex');

      // 이더리움 주소 생성
      let address = ethUtil.pubToAddress(xPrivKey.publicKey, true).toString('hex');
      address = ethUtil.toChecksumAddress(address).toString('hex');
      console.log(address, privateKey);
    });*/

    // const wallet = ethers.Wallet.createRandom();
    // console.log('address:', wallet.address);
    // console.log('mnemonic:', wallet.mnemonic.phrase);
    // console.log('privateKey:', wallet.privateKey);
    /*    const seed = bip39.mnemonicToSeed(this.state.mnemonic);
          const root = bip32.fromSeed(seed);
    
          // 이더리움 차일드 개인키 생성
          const derivePath = "m/44'/60'/0'/0/0";
          const xPrivKey = root.derivePath(derivePath);
          const privateKey = xPrivKey.privateKey.toString('hex');
    
          // 이더리움 주소 생성
          let address = ethUtil.pubToAddress(xPrivKey.publicKey, true).toString('hex');
          address = ethUtil.toChecksumAddress(address).toString('hex');
    
          const wallet = new Wallet({
            name: this.state.walletName,
            network: this.state.network,
            coin: 'ETH',
            symbol: 'ETH',
            address,
            derivePath,
            privateKey,
          });*/
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
              onChangeText={setConfirm}
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
