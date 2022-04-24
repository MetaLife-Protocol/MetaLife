import React, { useState, useEffect } from 'react';
import { StatusBar, TextInput, View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
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

const Wallet = ({ name, setName }) => {
  const { barStyle, BG, FG, flex1, input, text, marginTop10 } = SchemaStyles(),
    { textHolder } = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    [tab, setTab] = useState(0),
    { replace } = useNavigation();

  const [mnemonic, setMnemonic] = useState('')
  const [focusedClear, setfocusedClear] = useState(true);
  const [focusedDark, setfocusedDark] = useState(true);
  const [focusedConfirm, setfocusedConfirm] = useState(true);

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
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
        <ImageBackground style={{
          height: 156.5,
        }}
          imageStyle={{ borderRadius: 12 }}
          source={require('../../assets/image/discover/Discover_backgroud_DAO.png')}>
          <View style={[styles.interface]}>
            <View style={[styles.interfaceHead]}>
              <Text>asdf</Text>
            </View>
            <View style={[styles.interfaceFooter]}>
              <Text style={{ color: "#fff", fontSize: 13 }}>0x5D30E10741D1954BB5A4e88Ab7b15789b6df3420</Text>
              <TouchableOpacity onPress={() => setfocusedDark(!focusedDark)}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/image/walletBtn/icon_copy_presses.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <View style={[styles.tab]}>
          <View style={[tab == 0 ? styles.active : null]}>
            <TouchableOpacity onPress={() => setTab(0)}>
              <Text style={[styles.inputText, {color: "#8E8E92"}, tab == 0 ? text : null]}>
                Coin
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[tab == 1 ? styles.active : null, { marginLeft: 24 }]}>
            <TouchableOpacity onPress={() => setTab(1)}>
              <Text style={[styles.inputText, {color: "#8E8E92"},  tab == 1 ? text : null]}>
                DAO
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[tab == 2 ? styles.active : null, { marginLeft: 24 }]}>
            <TouchableOpacity onPress={() => setTab(2)}>
              <Text style={[styles.inputText, {color: "#8E8E92"},  tab == 2 ? text : null]}>
                NFT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.main]}>
          <Text style={[styles.inputText]}>Comming soon...</Text>
        </View>
      </View>
    </View >
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputText: {
    fontSize: 16,
  },
  icon: {
    width: 15,
    height: 15,
  },
  interface: {
    borderRadius: 15,
    width: "100%",
    height: 156.5,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  interfaceFooter: {
  },
  tab: {
    display: 'flex',
    marginTop: 10,
    flexDirection: 'row',
  },
  active: {
    borderBottomWidth: 2,
    borderBottomColor: '#29DAD7',
    paddingBottom: 5,
  },
});

export default connect(msp, mdp)(Wallet);
