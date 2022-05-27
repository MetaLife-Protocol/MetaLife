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
  Slider
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';
import {ethers} from 'ethers';
import axios from 'axios';
import {SchemaStyles, colorsSchema, RoundBtn} from 'metalife-base';
import ERC20ABI from '../../abi/ERC20.json';
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

const TokenTransfer = ({
  name,
  setName,
  setCurrentAccount,
  currentAccount,
  accountList,
  tokenType,
  darkMode,
}) => {
  const {barStyle, BG, FG, flex1, input, text, marginTop10, modalBackground} =
      SchemaStyles(),
    {textHolder} = colorsSchema;

  const {replace} = useNavigation();

  const [gas, setGas] = useState(0);
  const [amount, setAmount] = useState(1);
  const [receiveAddress, setReceiveAddress] = useState('0xc3FD28772d6734aadCF7B712Fa50DD37E80B2C0A');

  const onChangeAddress = (addr) => {
    setReceiveAddress(addr)
  };

  const onChangeAmount = (amt) => {
    setAmount(amt);
  };

  const onClickConfirm = async () => {
    if (receiveAddress === '' || amount === 0) {
      return;
    }
    // let iface = new ethers.utils.Interface(MLT);
    let abi = MLT;
    let abi_address = MLT_TOKEN_ADDRESS;
    if (tokenType === 'mesh') {
      abi = MESH;
      abi_address = MESH_TOKEN_ADDRESS;
      const provider = new ethers.providers.JsonRpcProvider('https://jsonapi1.smartmesh.io/');
      let wallet = new ethers.Wallet('0x' + currentAccount.PrivateKey);
      let walletSigner = wallet.connect(provider);
      const mlt = new ethers.Contract(abi_address, abi, walletSigner);
      const bal = await mlt.balanceOf(currentAccount.Address);
      if (amount > ethers.utils.formatEther(bal)) {
        alert('please set transfer amount again.');
      }
      mlt.transfer(receiveAddress, amount).then((trans) => {
        console.log(trans, '_________________success');
      }).catch((error) => {
        console.log(error, '______________error');
      });
    } else if (tokenType === 'eth') {
      abi = ERC20ABI;
      // Native token transfer
      const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
      const wallet = new ethers.Wallet('0x' + currentAccount.PrivateKey, provider);
      const balance = await wallet.getBalance();
      if (amount > ethers.utils.formatEther(balance)) {
        alert('please set transfer amount again.');
      }
      wallet.sendTransaction({
        from : currentAccount.Address,
        to: receiveAddress,
        value: amount,
      }).then((trans) => {
        console.log(trans);
      }).catch((error) => {
        console.log(error, '___________error______native token');
      });
      // Native token transfer End
  }
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
          <Text style={[text, {fontSize: 20, fontWeight: 'bold', color: darkMode ? 'white' : 'black'}]}>Transfer</Text>
          <Text style={[text, {fontSize: 14, color: '#aaaaaa', marginLeft: 5, color: darkMode ? 'white' : 'black'}]}>
            ({currentAccount.Address.slice(0, 7) + '....' + currentAccount.Address.slice(currentAccount.Address.length - 6, currentAccount.Address.length - 1)})
          </Text>
        </View>
      </View>
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <View style={[styles.mainTable]}>
          <View style={[]}>
            <View style={[styles.tableRow]}>
              <View style={[styles.tokenInfo]}>
                <View>
                  <Text style={[styles.inputText, {color: 'black', marginBottom: 10}]}>Receiving account</Text>
                  <TextInput
                    style={[text, styles.inputText]}
                    placeholder={'Type or paste address'}
                    placeholderTextColor={textHolder}
                    onChangeText={onChangeAddress}
                    // value={receiveAddress}
                    maxLength={20}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <View style={[styles.mainTable]}>
          <View style={[]}>
            <View style={[styles.tableRow]}>
              <View style={[styles.tokenInfo]}>
                <View style={[{width: '100%'}]}>
                  <View style={[styles.tokenInfo, {justifyContent: 'space-between'}]}>
                    <Text style={[styles.inputText, {color: 'black', marginBottom: 10, color: darkMode ? 'white' : 'black'}]}>Transfers number</Text>
                    <Text style={[styles.inputText, {color: 'black', marginBottom: 10, color: darkMode ? 'white' : 'black'}]}>SMT &gt;</Text>
                  </View>
                  <TextInput
                    style={[text, styles.inputText]}
                    placeholder={'Enter transfer amount'}
                    placeholderTextColor={textHolder}
                    onChangeText={onChangeAmount}
                    maxLength={20}
                    value={amount.toString()}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.tokenInfo, {justifyContent: 'space-between', paddingVertical: 10, borderTopColor: '#aaaaaa55', borderTopWidth: 1}]}>
              <Text style={[{color: darkMode ? 'white' : 'black'}]}>Amount</Text>
              <Text style={[{color: darkMode ? 'white' : 'black', fontWeight: 'bold', fontSize: 18}]}>{amount} SMT</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <View style={[styles.mainTable]}>
          <View style={[]}>
            <View style={[styles.tableRow]}>
              <View style={[styles.tokenInfo]}>
                <View>
                  <Text style={[styles.inputText, {color: darkMode ? 'white' : 'black'}]}>Remark</Text>
                  <Text style={[styles.inputText, {color: darkMode ? 'white' : 'black'}]}>Friendmark</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <View style={[]}>
            <View style={[styles.tableRow]}>
              <View style={[styles.tokenInfo, {width: '100%', justifyContent: 'space-between', paddingVertical: 10}]}>
                <Text style={[{color: darkMode ? 'white' : 'black'}]}>Gas</Text>
                <Text style={[{color: darkMode ? 'white' : 'black'}]}>{Math.round(gas * 0.00001 * 1000000) / 1000000} SMT</Text>
              </View>
            </View>
        </View>
        <Slider maximumValue={10} minimumValue={0} step={0.1}
          value={gas} onValueChange={sliderValue => {setGas(sliderValue)}} />
      </View>
      <View style={[styles.tokenInfo, {justifyContent: 'center', backgroundColor: '#aaaaaa11', padding: 10}]}>
        <View>
          <TouchableOpacity style={[{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}]}>
            <Text style={[styles.inputText, {color: '#29DAD7', marginBottom: 10}]}>Advanced Settings &gt;</Text>
          </TouchableOpacity>
          <View style={[{width: '100%', marginVertical: 20}]}>
            <TouchableOpacity style={[styles.btnCollection,]}
              onPress={() => onClickConfirm()}
            >
              <Text style={[{color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const msp = s => {
  return {
    currentAccount: s.account.currentAccount,
    accountList: s.account.accountList,
    darkMode: s.cfg.darkMode,
    tokenType: s.account.tokenType,
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
  mainTable: {
    display: 'flex',
    flexDirection: 'column',
  },
  btnTransfer: {
    backgroundColor: '#6989ea',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
  btnCollection: {
    backgroundColor: '#29DAD7',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  tokenInfo: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tokenTitle: {
    color: '#29DAD7',
    fontSize: 18,
    paddingVertical: 3,
  },
  tokenTitleSend: {
    color: '#6989ea',
    fontSize: 18,
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
  body: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  inputText: {
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  header: {
    height: 50,
    display: 'flex',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default connect(msp, mdp)(TokenTransfer);
