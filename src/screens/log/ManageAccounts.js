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

const ManageAccounts = ({
  name,
  setName,
  setCurrentAccount,
  currentAccount,
  accountList,
  darkMode,
  deleteAccount,
}) => {
  const {barStyle, BG, FG, flex1, input, text, marginTop10, modalBackground} =
      SchemaStyles(),
    {textHolder} = colorsSchema;

  const {replace} = useNavigation();

  const [focusedClear, setfocusedClear] = useState(true);
  const [editIndex, setEditIndex] = useState(-1);

  const onClickSwitchMenu = () => {
    setmenuModal(false);
    setSwitchModal(true);
  };

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  };
  const deleteOneAccount = (index) => {
    if (accountList.length === 1)
      replace('Wallet');
    deleteAccount(index);
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
        <TouchableOpacity onPress={() => replace('Wallet')}>
          <Image
            style={{width: 20, height: 20}}
            source={iconDic['Back_icon_' + (!darkMode ? 'dark' : 'white')]}
          />
        </TouchableOpacity>
        <Text style={[text, {fontSize: 22}]}>Address Contact</Text>

        <TouchableOpacity
          style={[{backgroundColor: darkMode ? '#292E2E' : '#F8F9FD'}]}>
          <Image
            style={{width: 20, height: 20, marginLeft: 2}}
            source={iconDic['plus_icon_white']}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.body]}>
        {accountList.map((each, index) => {
          return (
            <View key={index} style={[styles.oneAccount, {marginVertical: 7}]}>
              <TouchableOpacity style={[styles.accountContent]} onPress={() => setEditIndex(index)}>
                <View>
                  <Text
                    style={[
                      text,
                      {
                        marginTop: 10,
                        fontWeight: '500',
                        fontSize: 16,
                      },
                    ]}>
                    {each.Name}
                  </Text>
                  <Text style={[{fontSize: 12, marginTop: 10}]}>
                    {each.Address.slice(0, 10) + '...' + each.Address.slice(each.Address.length - 10, each.Address.length)}
                  </Text>
                  <Text style={[{marginTop: 10}]}>Friend</Text>
                </View>
              </TouchableOpacity>
              { editIndex === index && <View style={[styles.btngroup]}>
                <TouchableOpacity>
                  <Text style={[styles.editbtn]} onPress={() => {}}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={[styles.deletebtn]} onPress={() => deleteOneAccount(index)}>Delete</Text>
                </TouchableOpacity>
              </View>}
            </View>
          );
        })}
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
    setCurrentAccount: account => d({type: 'setCurrentAccount', payload: account}),
    deleteAccount: account => d({type: 'deleteAccount', payload: account}),
  };
};

const styles = StyleSheet.create({
  btngroup: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  editbtn: {
    padding: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#29DAD7',
    minHeight: 90,
    minWidth: 70,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '500',
  },
  deletebtn: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
    minWidth: 70,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '500',
    minHeight: 90,
    backgroundColor: '#E73553',
  },
  oneAccount: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    backgroundColor: '#dddddd',
    padding: 10,
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

export default connect(msp, mdp)(ManageAccounts);
