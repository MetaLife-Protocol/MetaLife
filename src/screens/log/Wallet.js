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
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import bip39 from 'react-native-bip39';
// import bip32 from 'bip32';
// import ethUtil from 'ethereumjs-util';
import {ethers} from 'ethers';
import {randomBytes} from 'react-native-randombytes';
import {restrict} from '../../utils';
import axios from 'axios';
import {SchemaStyles, colorsSchema, RoundBtn} from 'metalife-base';
import FriendList from '../tabs/messages/FriendList';
import network from '../photon/network';

const baseUrl = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

import MLT from '../../abi/MLT.json';
import MESH from '../../abi/MESH.json';
const MLT_TOKEN_ADDRESS = '0xa27f8f580c01db0682ce185209ffb84121a2f711';
const MESH_TOKEN_ADDRESS = '0xa4c9af589c07b7539e5fcc45975b995a45e3f379';

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

const Wallet = ({
  name,
  setName,
  setCurrentAccount,
  currentAccount,
  accountList,
  setTokenType,
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
  const [switchModal, setSwitchModal] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [smtPrice, setSmtPrice] = useState(0);
  const [mltPrice, setMltPrice] = useState(0);
  const [meshPrice, setMeshPrice] = useState(0);
  const [networkSwitch, setNetworkSwitch] = useState(false);
  const [currencySwitch, setCurrencySwitch] = useState(true);
  const [curBalance, setCurBalance] = useState(0);
  const [mltBalance, setmltBalance] = useState(0);
  const [meshBalance, setmeshBalance] = useState(0);
  const [cnyRate, setCnyRate] = useState(0);
  const [eyeSelected, setEyeSelected] = useState(true);
  const [isLoadingCNY, setIsLoadingCNY] = useState(true);
  const [isLoadingETH, setIsLoadingETH] = useState(true);
  const [isLoadingSMT, setIsLoadingSMT] = useState(true);

  const onClickSwitchMenu = () => {
    if (accountList.length === 0) {
      return;
    }
    setmenuModal(false);
    setSwitchModal(true);
  };

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  };

  const onClickManageAccount = async () => {
    replace('ImportAccount');
  };

  const onClickSwitchNetwork = async () => {
    setNetworkSwitch(!networkSwitch);

    let balance = 0;
    if (!networkSwitch) {
      let eth_provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
      balance = await eth_provider.getBalance(currentAccount.Address);
    } else {
      let mesh_provider = new ethers.providers.JsonRpcProvider('https://jsonapi1.smartmesh.io/');
      balance = await mesh_provider.getBalance(currentAccount.Address);

      let wallet = new ethers.Wallet('0x' + currentAccount.PrivateKey);
      let walletSigner = wallet.connect(mesh_provider);
      const mlt = new ethers.Contract(MLT_TOKEN_ADDRESS, MLT, walletSigner);
      const bal_mlt = await mlt.balanceOf(currentAccount.Address);
      console.log(ethers.utils.formatEther(bal_mlt), 'MLT token balance<<<<<<<<<<')
      setmltBalance(ethers.utils.formatEther(bal_mlt));

      const mesh = new ethers.Contract(MESH_TOKEN_ADDRESS, MESH, walletSigner);
      const bal_mesh = await mesh.balanceOf(currentAccount.Address);
      console.log(ethers.utils.formatEther(bal_mesh), 'MESH token balance<<<<<<<<<<')
      setmeshBalance(ethers.utils.formatEther(bal_mesh));
    }
    setCurBalance(ethers.utils.formatEther(balance));
    // console.log(balance, '>>>>>balance');
    getPrice();
  };

  const onClickOneToken = (tokenType) => {
    console.log(tokenType);
    setTokenType(tokenType);
    replace('TokenTransfer');
  }

  const onClickAccount = (each) => {
    setCurrentAccount(each);
    setSwitchModal(false);
    getPrice();
  };

  const onClickCurrencySwitch = () => {
    setCurrencySwitch(!currencySwitch);
  };

  const getPrice = () => {
    setIsLoadingCNY(true);
    setIsLoadingETH(true);
    setIsLoadingSMT(true);
    axios
      .get('https://www.freeforexapi.com/api/live?pairs=USDCNY')
      .then(res => {
        console.log('>>>>>>>>>>', res.data.rates.USDCNY.rate, '<<<<cny');
        setCnyRate(res.data.rates.USDCNY.rate);
        setIsLoadingCNY(false);
      }).catch(error => console.log(error, '>>>>>>>forex'));

    axios
      .get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=0&to=1600000000000`')
      .then(res => {
        setEthPrice(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100) / 100);
        setIsLoadingETH(false);
        console.log(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100) / 100);
      }).catch(error => console.log(error, '>>>>eth'));
    axios
      .get('http://api.coingecko.com/api/v3/coins/smartmesh/market_chart/range?vs_currency=usd&from=0&to=1600000000000`')
      .then(res => {
        setSmtPrice(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100000) / 100000);
        console.log(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100000) / 100000);
      }).catch(error => console.log(error, '>>>>>smt'));
    axios
      .get('http://api.coingecko.com/api/v3/coins/media-licensing-token/market_chart/range?vs_currency=usd&from=0&to=1600000000000`')
      .then(res => {
        setMltPrice(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100000) / 100000);
        console.log(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100000) / 100000, '>>>>>>mlt');
      }).catch(error => console.log(error, '>>>>>mlt'));
    axios
      .get('http://api.coingecko.com/api/v3/coins/meshbox/market_chart/range?vs_currency=usd&from=0&to=1600000000000`')
      .then(res => {
        setMeshPrice(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100000) / 100000);
        console.log(Math.round(res.data.prices[res.data.prices.length - 1][1] * 100000) / 100000, '>>>>>>mesh');
        setIsLoadingSMT(false);
      }).catch(error => console.log(error, '>>>>>mlt'));
  };

  useEffect(() => {
    onClickSwitchNetwork();
    getPrice();
  }, []);

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, styles.header]}>
        <View style={[{paddingLeft: 40}]}>
          <Text style={[text, {fontSize: 22}]}>Wallet</Text>
        </View>

        <TouchableOpacity
          onPress={() => {onClickSwitchNetwork()}}
          style={[
            styles.toogle,
            {backgroundColor: darkMode ? '#292E2E' : '#F8F9FD'},
          ]}>
          {!networkSwitch ? <Text style={{color: '#29DAD7', fontSize: 15, marginLeft: 10}}>
            SPE
          </Text> :
          <Text style={{color: '#29DAD7', fontSize: 15, marginLeft: 10}}>
            ETH
          </Text>}
          <Image
            style={{width: 20, height: 20, marginLeft: 2}}
            source={iconDic.Toogle_icon}
          />
        </TouchableOpacity>
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
                <TouchableOpacity onPress={() => setEyeSelected(!eyeSelected)}>
                  {eyeSelected ? <Image
                    style={[styles.icon, {marginLeft: 10}]}
                    source={require('../../assets/image/walletBtn/icon-eye-default.png')}
                  /> :
                  <Image
                    style={[styles.icon, {marginLeft: 10}]}
                    source={require('../../assets/image/accountBtn/Dark_icon_default.png')}
                  />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onClickCurrencySwitch()}>
                  {currencySwitch ? <Image
                    style={[styles.icon, {marginLeft: 10}]}
                    source={require('../../assets/image/accountBtn/usd.png')}
                  /> :
                  <Image
                    style={[styles.icon, {marginLeft: 10}]}
                    source={require('../../assets/image/accountBtn/cny.png')}
                  />}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                {currentAccount.isBackup ? (
                  <TouchableOpacity onPress={() => replace('BackupWallet')}>
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
                    <TouchableOpacity onPress={() => onClickSwitchMenu()}>
                      <Text style={[text]}>Switch Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => replace('CreateAccount')}>
                      <Text style={[text, {marginTop: 10}]}>
                        Create Account
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => replace('WalletDetails')}>
                      <Text style={[text, {marginTop: 10}]}>
                        Export Account
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onClickManageAccount()}>
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
                      onPress={() => replace('QRCodeScan')}>
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
                      onPress={() => replace('AddressContact')}>
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
                {/* {Math.round(
                  currentAccount.Balance
                  ? currentAccount.Balance
                  : 0 * ethPrice * 100,
                ) / 100} */}
                {currencySwitch ? '$' : '¥'}
                {eyeSelected ? (currencySwitch ? (networkSwitch ? Math.round(ethPrice * curBalance * 10000) / 10000 : parseInt((smtPrice * curBalance + mltPrice * mltBalance + meshPrice * meshBalance) * 10000) / 10000) :
                  (networkSwitch ? Math.round(ethPrice * curBalance * cnyRate * 10000) / 10000 : Math.round((smtPrice * curBalance + mltPrice * mltBalance + meshPrice * meshBalance) * cnyRate * 10000) / 10000))
                  : '**********'}
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
        {switchModal ? (
          <Modal
            animationType="fade"
            transparent={true}
            visible={switchModal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setSwitchModal(false);
            }}>
            <View
              style={[
                FG,
                {
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#222222ee',
                },
              ]}>
              <View
                style={[
                  FG,
                  {
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: 300,
                    padding: 15,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    borderColor: 'black',
                    borderWidth: 1,
                  },
                ]}>
                <View style={[styles.switchModalMenu]}>
                  <Text style={[text, {fontSize: 18, fontWeight: '500'}]}>
                    Switch Account
                  </Text>
                  <TouchableOpacity onPress={() => setSwitchModal(false)}>
                    <Text style={[text, {fontSize: 18, fontWeight: '500'}]}>
                      X
                    </Text>
                  </TouchableOpacity>
                </View>
                {accountList.map((each, index) => {
                  return (
                    <View
                      key={index}
                      style={[styles.oneAccount, {marginVertical: 7}]}>
                      <TouchableOpacity onPress={() => onClickAccount(each)}>
                        <View style={[styles.switchModalMenu]}>
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
                            <Text style={[text, {fontSize: 12, marginTop: 10}]}>
                              {each.Address}
                            </Text>
                          </View>
                          <Text>
                            <Image
                              style={styles.icon}
                              source={require('../../assets/image/icons/icon_checked_default_white.png')}
                            />
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </Modal>
        ) : null}

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
        <View style={[styles.mainTable]}>
          {(isLoadingSMT) ?
          <View style={[{paddingTop: 50, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}]}>
            <Image
            style={[{width: 50, height: 50}]}
            source={require('../../assets/image/accountBtn/loading.png')}
            />
            <Text>Loading...</Text>
          </View> :
          (networkSwitch ?
            <TouchableOpacity style={[styles.oneToken]} onPress={() => onClickOneToken('eth')}>
              <Text style={[styles.tokenTitle]}>ETH</Text>
              <View style={[styles.tableRow]}>
                <View>
                  <Text style={[styles.inputText]}>Quantity</Text>
                  <Text style={[styles.inputText, {color: 'black'}]}>
                    {/* {currentAccount.Balance ? currentAccount.Balance : 0} */}
                    {Math.round(curBalance * 10000) / 10000}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.inputText, {textAlign: 'center'}]}>
                    Price
                  </Text>
                  <Text style={[styles.inputText, {color: 'black'}]}>
                    {currencySwitch ? '$' : '¥'}
                    {currencySwitch ? (networkSwitch ? ethPrice : smtPrice) : (networkSwitch ? Math.round(ethPrice * cnyRate * 10000) / 10000 : Math.round(smtPrice * cnyRate * 10000) / 10000)}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.inputText, {textAlign: 'right'}]}>
                    Amount
                  </Text>
                  <Text style={[styles.inputText, {color: 'black'}]}>
                    {/* {Math.round(
                      ethPrice * currentAccount.Balance
                        ? currentAccount.Balance
                        : 0 * 100,
                    ) / 100} */}
                    {currencySwitch ? '$' : '¥'}
                    {currencySwitch ? (networkSwitch ? Math.round(ethPrice * curBalance * 10000) / 10000 : Math.round(smtPrice * curBalance * 10000) / 10000) :
                      (networkSwitch ? Math.round(ethPrice * curBalance * cnyRate * 10000) / 10000 : Math.round(smtPrice * curBalance * cnyRate * 10000) / 10000)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity> :
            <View>
              <TouchableOpacity style={[styles.oneToken]} onPress={() => onClickOneToken('mlt')}>
                <Text style={[styles.tokenTitle]}>MLT</Text>
                <View style={[styles.tableRow]}>
                  <View>
                    <Text style={[styles.inputText]}>Quantity</Text>
                    <Text style={[styles.inputText, {color: 'black'}]}>
                      {/* {currentAccount.Balance ? currentAccount.Balance : 0} */}
                      {parseInt(mltBalance * 10000) / 10000}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.inputText, {textAlign: 'center'}]}>
                      Price
                    </Text>
                    <Text style={[styles.inputText, {color: 'black'}]}>
                      {currencySwitch ? '$' : '¥'}
                      {currencySwitch ? Math.round(mltPrice * 10000) / 10000 : Math.round(mltPrice * cnyRate * 10000) / 10000}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.inputText, {textAlign: 'right'}]}>
                      Amount
                    </Text>
                    <Text style={[styles.inputText, {color: 'black'}]}>
                      {/* {Math.round(
                        ethPrice * currentAccount.Balance
                          ? currentAccount.Balance
                          : 0 * 100,
                      ) / 100} */}
                      {currencySwitch ? '$' : '¥'}
                      {currencySwitch ? Math.round(mltPrice * mltBalance * 10000) / 10000 : Math.round(mltPrice * mltBalance * cnyRate * 10000) / 10000}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.oneToken]} onPress={() => onClickOneToken('mesh')}>
                <Text style={[styles.tokenTitle]}>MESH</Text>
                <View style={[styles.tableRow]}>
                  <View>
                    <Text style={[styles.inputText]}>Quantity</Text>
                    <Text style={[styles.inputText, {color: 'black'}]}>
                      {parseInt(meshBalance * 10000) / 10000}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.inputText, {textAlign: 'center'}]}>
                      Price
                    </Text>
                    <Text style={[styles.inputText, {color: 'black'}]}>
                      {currencySwitch ? '$' : '¥'}
                      {currencySwitch ? Math.round(meshPrice * 10000) / 10000 : Math.round(meshPrice * cnyRate * 10000) / 10000}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.inputText, {textAlign: 'right'}]}>
                      Amount
                    </Text>
                    <Text style={[styles.inputText, {color: 'black'}]}>
                      {currencySwitch ? '$' : '¥'}
                      {currencySwitch ? Math.round(meshPrice * mltBalance * 10000) / 10000 : Math.round(meshPrice * mltBalance * cnyRate * 10000) / 10000}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>)
          }
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
          <View style={[styles.modalBack]} />
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
                press={() => replace('BackupWallet')}
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
    accountList: s.account.accountList,
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
    setTokenType: tokenName => 
      d({type: 'setTokenType', payload: tokenName}),
    setCurrentAccount: account =>
      d({type: 'setCurrentAccount', payload: account}),
  };
};

const styles = StyleSheet.create({
  oneAccount: {
    borderRadius: 5,
    backgroundColor: '#dddddd',
    padding: 10,
  },
  switchModalMenu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenTitle: {
    color: '#29DAD7',
    fontSize: 22,
    paddingVertical: 3,
  },
  oneToken: {
    borderBottomColor: '#aaaaaa',
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 20,
    paddingVertical: 1,
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
