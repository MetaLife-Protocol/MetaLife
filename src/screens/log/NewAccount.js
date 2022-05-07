import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  TextInput,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Alert,
} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import bip39 from 'react-native-bip39';
// import bip32 from 'bip32';
// import ethUtil from 'ethereumjs-util';
import {ethers} from 'ethers';
import {randomBytes} from 'react-native-randombytes';
import {restrict} from '../../utils';

const iconDic = {
  Clear_icon_default: require('../../assets/image/accountBtn/Clear_icon_default.png'),
  Clear_icon_selected: require('../../assets/image/accountBtn/Clear_icon_selected.png'),
  Dark_icon_default: require('../../assets/image/accountBtn/Dark_icon_default.png'),
  Dark_icon_selected: require('../../assets/image/accountBtn/Dark_icon_selected.png'),
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
  Back_icon_dark: require('../../assets/image/walletBtn/back-black.png'),
  Back_icon_white: require('../../assets/image/walletBtn/back-white.png'),
  plus_icon_white: require('../../assets/image/icons/icon_add_default_white.png'),
  plus_icon_black: require('../../assets/image/icons/icon_add_presses_black.png'),
};

const NewAccount = ({
  name,
  setName,
  setCurrentAccount,
  currentAccount,
  accountList,
  darkMode,
}) => {
  const {barStyle, BG, FG, flex1, input, text, marginTop10, modalBackground} =
      SchemaStyles(),
    {textHolder} = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    [tab, setTab] = useState(0),
    {replace} = useNavigation();

  const [mnemonic, setMnemonic] = useState('');
  const [focusedClear, setfocusedClear] = useState(true);
  const [focusedDark, setfocusedDark] = useState(true);
  const [focusedConfirm, setfocusedConfirm] = useState(true);
  const [confirmModal, setconfirmModal] = useState(false);
  const [menuModal, setmenuModal] = useState(false);
  const [accountname, setAccountName] = useState('');

  const onClickSwitchMenu = () => {
    setmenuModal(false);
    setSwitchModal(true);
  };

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  };

  useEffect(() => {
    // randomBytes(16, (error, bytes) => {
    //   const mnemonic = ethers.utils.HDNode.entropyToMnemonic(bytes, ethers.wordlists.en);
    //   console.log(mnemonic);
    // });
  }, []);

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, styles.header]}>
        <TouchableOpacity onPress={() => replace('AddressContact')}>
          <Image
            style={{width: 20, height: 20}}
            source={iconDic['Back_icon_' + (!darkMode ? 'dark' : 'white')]}
          />
        </TouchableOpacity>
        <Text style={[text, {fontSize: 22}]}>New address contact</Text>

        <TouchableOpacity
          style={[{backgroundColor: darkMode ? '#292E2E' : '#F8F9FD'}]}>
            <Text style={[{color: '#29DAD7'}]}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.body]}>
        <TextInput
          style={[text, styles.inputText]}
          placeholder={'Name'}
          // secureTextEntry={focusedConfirm ? true : false}
          placeholderTextColor={textHolder}
          onChangeText={setAccountName}
        />
        <TextInput
          style={[text, styles.inputText]}
          placeholder={'Payee wallet address'}
          // secureTextEntry={focusedConfirm ? true : false}
          placeholderTextColor={textHolder}
          onChangeText={setAccountName}
        />
        <TextInput
          style={[text, styles.inputText]}
          placeholder={'Remark'}
          // secureTextEntry={focusedConfirm ? true : false}
          placeholderTextColor={textHolder}
          onChangeText={setAccountName}
        />
      </View>
    </View>
  );
};

const msp = s => {
  return {
    currentAccount: s.account.currentAccount,
    accountList: s.account.accountList,
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
    setCurrentAccount: account =>
      d({type: 'setCurrentAccount', payload: account}),
  };
};

const styles = StyleSheet.create({
  inputText: {
    fontSize: 16,
    backgroundColor: '#eeeeee',
    marginVertical: 5,
  },
  icon: {
    width: 15,
    height: 15,
  },
  oneRow: {
    borderRadius: 5,
    backgroundColor: '#aaaaaa',
  },
  body: {
    width: '100%',
    height: '100%',
    marginTop: 10,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  header: {
    height: 50,
    display: 'flex',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default connect(msp, mdp)(NewAccount);
