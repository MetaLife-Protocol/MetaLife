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
  Linking,
  AppRegistry,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';
import {ethers} from 'ethers';
import axios from 'axios';
import {SchemaStyles, colorsSchema, RoundBtn} from 'metalife-base';
import ERC20ABI from '../../abi/ERC20.json';
import MLT from '../../abi/MLT.json';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const iconDic = {
  Clear_icon_default: require('../../assets/image/accountBtn/Clear_icon_default.png'),
  Clear_icon_selected: require('../../assets/image/accountBtn/Clear_icon_selected.png'),
  Dark_icon_default: require('../../assets/image/accountBtn/Dark_icon_default.png'),
  Dark_icon_selected: require('../../assets/image/accountBtn/Dark_icon_selected.png'),
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
  Back_icon_dark: require('../../assets/image/walletBtn/back-black.png'),
  Back_icon_white: require('../../assets/image/walletBtn/back-white.png'),
  Toogle_icon: require('../../assets/image/walletBtn/icon_toggle_default.png'),
  Check_icon_white: require('../../assets/image/icons/icon_checked_default_white.png'),
  Check_icon_black: require('../../assets/image/icons/icon_checked_presses_black.png'),
};

const QRCodeScan = ({
  name,
  setName,
  addAddressInfo, 
  deleteAddressInfo,
  setCurrentAccount,
  currentAccount,
  accountList,
  addressBook,
  darkMode,
}) => {
  const {barStyle, BG, FG, flex1, input, text, marginTop10, modalBackground} =
      SchemaStyles(),
    {textHolder} = colorsSchema;

  const {replace} = useNavigation();

  onSuccess = e => {
    addAddressInfo(e.data);
    console.log(addressBook)
    replace('Wallet');
  };

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
        <View style={[{paddingLeft: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}]}>
          <Text style={[text, {fontSize: 20, fontWeight: 'bold', color: darkMode ? 'white' : 'black'}]}>QR Code Scan</Text>
        </View>
      </View>
      <QRCodeScanner
        onRead={this.onSuccess}
        flashMode={RNCamera.Constants.FlashMode.torch}
      />
    </View>
  );
};

const msp = s => {
  return {
    currentAccount: s.account.currentAccount,
    accountList: s.account.accountList,
    darkMode: s.cfg.darkMode,
    addressBook: s.account.addressBook,
  };
};

const mdp = d => {
  return {
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
    addAddressInfo: address => 
      d({type: 'addAddressInfo', payload: address}),
    deleteAddressInfo: address => 
      d({type: 'deleteAddressInfo', payload: address}),
    setCurrentAccount: account =>
      d({type: 'setCurrentAccount', payload: account}),
  };
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    display: 'flex',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});

export default connect(msp, mdp)(QRCodeScan);
