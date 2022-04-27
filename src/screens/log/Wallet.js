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
  Toogle_icon: require('../../assets/image/walletBtn/icon_toggle_default.png'),
};

const Wallet = ({name, setName, currentAccount, darkMode}) => {
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
      {/* {menuModal ? (
          // <TouchableOpacity onPress={() => setconfirmModal(false)}>
            <View
              style={[
                FG,
                {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: '100%',
                  opacity: 0.8,
                  zIndex: 3,
                },
              ]}></View>
          // </TouchableOpacity>
        ) : null} */}
      <StatusBar barStyle={barStyle} />
      <View style={[FG, styles.header]}>
        <TouchableOpacity onPress={() => replace('Wallet Detail')}>
          <Image
            style={{width: 20, height: 20}}
            source={iconDic['Back_icon_' + (!darkMode ? 'dark' : 'white')]}
          />
        </TouchableOpacity>
        <Text style={[text, {fontSize: 22}]}>Wallet</Text>

        <View
          style={[
            styles.toogle,
            {backgroundColor: darkMode ? '#292E2E' : '#F8F9FD'},
          ]}>
          <Text style={{color: '#29DAD7', fontSize: 15, marginLeft: 10}}>
            SPE
          </Text>
          <Image
            style={{width: 20, height: 20, marginLeft: 2}}
            source={iconDic['Toogle_icon']}
          />
        </View>
      </View>
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <ImageBackground
          style={{
            height: 156.5,
          }}
          imageStyle={{borderRadius: 12}}
          source={require('../../assets/image/discover/Discover_backgroud_DAO.png')}>
          <View style={[styles.interface]}>
            <View style={[styles.interfaceHead]}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#fff'}}>{currentAccount.Name}</Text>
                <TouchableOpacity onPress={() => console.log('back')}>
                  <Image
                    style={[styles.icon, {marginLeft: 10}]}
                    source={require('../../assets/image/walletBtn/icon-eye-default.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('back')}>
                  <Image
                    style={[styles.icon, {marginLeft: 10}]}
                    source={require('../../assets/image/walletBtn/icon-eye-default.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                {!currentAccount.isBackup ? (
                  <TouchableOpacity onPress={() => replace('Backup Wallet')}>
                    <Text style={[styles.backup]}>Backup</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity onPress={() => setmenuModal(!menuModal)}>
                  <Image
                    style={[styles.icon, {marginLeft: 10, zIndex: 10}]}
                    source={require('../../assets/image/walletBtn/icon_more_default_white.png')}
                  />
                </TouchableOpacity>
                {menuModal ? (
                  <View
                    style={[
                      FG,
                      {
                        position: 'absolute',
                        right: 0,
                        top: 25,
                        width: 148,
                        height: 210,
                        padding: 15,
                        borderRadius: 6,
                        zIndex: 10,
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => console.log('Switch account')}>
                      <Text style={[text]}>Switch Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => replace("Create")}>
                      <Text style={[text, {marginTop: 10}]}>
                        Create Account
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => console.log('Manage account')}>
                      <Text
                        style={[
                          text,
                          {
                            marginTop: 10,
                            paddingBottom: 15,
                            borderBottomColor: '#0000001a',
                            borderBottomWidth: 1,
                          },
                        ]}>
                        Manage Account
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => console.log('Scan QR Code')}>
                      <Text
                        style={[
                          text,
                          {
                            marginTop: 15,
                            paddingBottom: 15,
                            borderBottomColor: '#0000001a',
                            borderBottomWidth: 1,
                          },
                        ]}>
                        Scan QR Code
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => console.log('Address Contract')}>
                      <Text style={[text, {marginTop: 10}]}>
                        Address Contract
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={{marginTop: 16}}>
              <Text style={{fontSize: 27, fontWeight: 'bold', color: '#fff'}}>
                $287103.124
              </Text>
            </View>
            <View style={[styles.interfaceFooter]}>
              <Text style={{color: '#fff', fontSize: 13}}>
                {currentAccount.Address}
              </Text>
              <TouchableOpacity onPress={() => setconfirmModal(true)}>
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
              <Text
                style={[
                  styles.inputText,
                  {color: '#8E8E92'},
                  tab == 0 ? text : null,
                ]}>
                Coin
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[tab == 1 ? styles.active : null, {marginLeft: 24}]}>
            <TouchableOpacity onPress={() => setTab(1)}>
              <Text
                style={[
                  styles.inputText,
                  {color: '#8E8E92'},
                  tab == 1 ? text : null,
                ]}>
                DAO
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[tab == 2 ? styles.active : null, {marginLeft: 24}]}>
            <TouchableOpacity onPress={() => setTab(2)}>
              <Text
                style={[
                  styles.inputText,
                  {color: '#8E8E92'},
                  tab == 2 ? text : null,
                ]}>
                NFT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.main]}>
          <Text style={[styles.inputText]}>Comming soon...</Text>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setconfirmModal(false);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalBack]}></View>
          <View style={[styles.modalView, modalBackground]}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>
                Please backup your wallet now
              </Text>
              <Text
                style={[text, styles.modalText]}
                onPress={() => setconfirmModal(false)}>
                X
              </Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.area}>
                <Text style={{color: '#29DAD7', fontSize: 15}}>
                  Unlike traditional website accounts, blockchain wallet is a
                  decentralized account system based on cryptography.
                </Text>
                <Text style={{color: '#29DAD7', fontSize: 15, marginTop: 15}}>
                  You must keep the private key and transaction password of your
                  wallet. Any accident will lead to the loss of assets.
                </Text>
                <Text style={{color: '#29DAD7', fontSize: 15, marginTop: 15}}>
                  We suggest to do a double backup first, then enter a small
                  test, and finally start to use happily.
                </Text>
              </View>
              <Text
                style={[
                  text,
                  styles.modalText,
                  {textAlign: 'left', marginTop: 15},
                ]}>
                Backup private key
              </Text>
              <Text
                style={{textAlign: 'left', marginTop: 10, color: '#8E8E92'}}>
                When you lose your wallet or forget your password, you can
                restore your wallet
              </Text>
              <Text
                style={[
                  text,
                  styles.modalText,
                  {textAlign: 'left', marginTop: 15},
                ]}>
                Backing up keystore files
              </Text>
              <Text
                style={{textAlign: 'left', marginTop: 10, color: '#8E8E92'}}>
                Official wallet format, private key file protected by
                transaction password
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <RoundBtn
                style={{width: '100%', marginHorizontal: 0}}
                title={'Backup now'}
                press={() => replace('Backup Wallet')}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const msp = s => {
  return {
    currentAccount: s.account.currentAccount,
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

const styles = StyleSheet.create({
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
    width: '100%',
    height: 156.5,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  interfaceFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    zIndex: 2,
  },
  modalBody: {
    width: '100%',
    marginTop: 30,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 17,
  },
  modalHeader: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  modalTextDesc: {
    color: '#4E586E',
    fontSize: 15,
    marginTop: 10,
  },
  modalFooter: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
  },
  area: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
  },
  header: {
    height: 50,
    display: 'flex',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  toogle: {
    width: 67.5,
    height: 22,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  interfaceHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backup: {
    backgroundColor: '#6A8AEB',
    fontSize: 13,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
});

export default connect(msp, mdp)(Wallet);
