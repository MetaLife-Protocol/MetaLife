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
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';
import {ethers} from 'ethers';
import axios from 'axios';
import {SchemaStyles, colorsSchema, RoundBtn} from 'metalife-base';

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

const TokenDetails = ({
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

  const {replace} = useNavigation();

  const [transHistories, setTransHistories] = useState([]);

  // const myAddress = currentAccount.Address;
  const myAddress = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae';

  const transUrlPrefix = 'https://api.etherscan.io/api?module=account&action=txlist&address=';
  const transUrlSuffix = '&startblock=0&endblock=999999&sort=asc&apikey=47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX';
  let transUrl = transUrlPrefix + '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae' + transUrlSuffix;

  const getTransHistory = () => {
    axios
    .get(transUrl)
    .then(res => {
      let trans = [];
      res.data.result.map((one) => {
        if (one.value > 0 && one.from && one.to) {
          let temp = one;
          let d = Date(one.timeStamp);
          temp.time = new Date(d).toISOString().split('T')[0];
          trans.push(temp);
          console.log(temp.time);
        }
      });
      setTransHistories(trans);
      console.log(transHistories.length);
    }).catch(error => console.log(error, '>>>>>>>trans history'));

  }

  useEffect(() => {
    getTransHistory();
  }, []);

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
        <View style={[{paddingLeft: 20}]}>
          <Text style={[text, {fontSize: 20, fontWeight: 'bold'}]}>Token Transaction Record</Text>
        </View>
      </View>
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <ScrollView>
          <View style={[styles.mainTable]}>
            {transHistories.map((one) => {
              if (one.from === myAddress) {
                return (
                  <TouchableOpacity style={[styles.oneToken]} onPress={() => {}}>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tokenInfo]}>
                        <Image
                          style={[styles.icon]}
                          source={require('../../assets/image/icons/send.png')}
                        />
                        <View style={[{marginLeft: 10}]}>
                          <Text style={[styles.inputText, {color: 'black', marginBottom: 10}]}>
                            {one.to.slice(0, 6) + '....' + one.to.slice(one.to.length - 5, one.to.length - 1)}
                          </Text>
                          <Text style={[styles.inputText]}>
                            {(one.time)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.tokenInfo}>
                        <Text style={[styles.tokenTitleSend, {textAlign: 'center'}]}>
                          -
                        </Text>
                        <Text style={[styles.tokenTitleSend, {marginLeft: 5}]}>
                          {one.value.length > 7 ? one.value.slice(0, 3) + '....' + one.value.slice(one.value.length - 4, one.value.length - 1) : one.value}
                        </Text>
                        <Text style={[styles.tokenTitleSend, {marginLeft: 10}]}>
                          SMT
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              } else if (one.to === myAddress) {
                return (
                  <TouchableOpacity style={[styles.oneToken]} onPress={() => {}}>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tokenInfo]}>
                        <Image
                          style={[styles.icon]}
                          source={require('../../assets/image/icons/receive.png')}
                        />
                        <View style={[{marginLeft: 10}]}>
                          <Text style={[styles.inputText, {color: 'black', marginBottom: 10}]}>
                            {one.from.slice(0, 6) + '....' + one.from.slice(one.from.length - 5, one.from.length - 1)}
                          </Text>
                          <Text style={[styles.inputText]}>
                            {(one.time)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.tokenInfo}>
                        <Text style={[styles.tokenTitle, {textAlign: 'center'}]}>
                          +
                        </Text>
                        <Text style={[styles.tokenTitle, {marginLeft: 5}]}>
                          {one.value.length > 7 ? one.value.slice(0, 3) + '....' + one.value.slice(one.value.length - 4, one.value.length - 1) : one.value}
                        </Text>
                        <Text style={[styles.tokenTitle, {marginLeft: 10}]}>
                          SMT
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }
            })}
          </View>
        </ScrollView>
      </View>
      <View style={[styles.tokenInfo, {justifyContent: 'space-between', backgroundColor: '#aaaaaa11', padding: 10}]}>
        <TouchableOpacity style={[styles.btnTransfer]} onPress={() => replace('TokenTransfer')}>
          <Text style={[{color: 'black', fontSize: 16, fontWeight: 'bold'}]}>Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnCollection]}>
          <Text style={[{color: 'black', fontSize: 16, fontWeight: 'bold'}]}>Collection</Text>
        </TouchableOpacity>
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
  mainTable: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
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
  },
});

export default connect(msp, mdp)(TokenDetails);
