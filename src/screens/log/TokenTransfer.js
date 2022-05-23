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
  darkMode,
}) => {
  const {barStyle, BG, FG, flex1, input, text, marginTop10, modalBackground} =
      SchemaStyles(),
    {textHolder} = colorsSchema;

  const {replace} = useNavigation();

  const [gas, setGas] = useState(0);
  const [amount, setAmount] = useState(0);
  const [receiveAddress, setReceiveAddress] = useState('');

  const onChangeAddress = (addr) => {
    setReceiveAddress(addr)
  };

  const onChangeAmount = (chg) => {
    setAmount(chg);
  };

  const onClickConfirm = async () => {
    // let eth_provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
    // window.ethersProvider = new ethers.providers.InfuraProvider("rinkeby");
    // let wallet = new ethers.Wallet('4f7ccb8af25baad441b99587abe221ef934f806a312fe740373cc1f00656935e');
    // let walletSigner = wallet.connect(window.ethersProvider);
    // console.log(walletSigner.provider._network.chainId);
    // let gasprice = await window.ethersProvider.getGasPrice();
    // console.log(ethers.utils.formatEther(gasprice), '>>>>>>>>gas price');

    // const tx = {
    //   from: '0xa52B964cDE8BD92aAcE42Bec4A19BcDD0f88E1ac',
    //   to: '0xa52B964cDE8BD92aAcE42Bec4A19BcDD0f88E1ac',
    //   value: ethers.utils.parseEther("0.01"),
    //   nonce: window.ethersProvider.getTransactionCount("0xa52B964cDE8BD92aAcE42Bec4A19BcDD0f88E1ac", "latest"),
    //   gasLimit: ethers.utils.hexlify(0x100000), // 100000
    //   gasPrice: ethers.utils.hexlify(0x100000),
    // }
    // walletSigner.sendTransaction(tx).then((transaction) => {
    //   console.log('>>>>>>>>>>>finish send transaction');
    //   console.log(transaction);
    // })
    let private_key =
      "4f7ccb8af25baad441b99587abe221ef934f806a312fe740373cc1f00656935e"
    let send_token_amount = "0.01"
    let to_address = "0xa52B964cDE8BD92aAcE42Bec4A19BcDD0f88E1ac"
    let send_address = "0xa52B964cDE8BD92aAcE42Bec4A19BcDD0f88E1ac"
    let gas_limit = "0x100000"
    let wallet = new ethers.Wallet(private_key)
    let walletSigner = wallet.connect(window.ethersProvider)
    let contract_address = ""
    window.ethersProvider = new ethers.providers.InfuraProvider("rinkeby")

    send_token(
      contract_address,
      send_token_amount,
      to_address,
      send_address,
      private_key
    )

  };

  function send_token(
    contract_address,
    send_token_amount,
    to_address,
    send_account,
    private_key
  ) {
    let wallet = new ethers.Wallet(private_key)
    let walletSigner = wallet.connect(window.ethersProvider)
  
    window.ethersProvider.getGasPrice().then((currentGasPrice) => {
      let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
      console.log(`gas_price: ${gas_price}`)
  
      if (contract_address) {
        // general token send
        let contract = new ethers.Contract(
          contract_address,
          send_abi,
          walletSigner
        )
  
        // How many tokens?
        let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        // Send tokens
        contract.transfer(to_address, numberOfTokens).then((transferResult) => {
          console.dir(transferResult)
          alert("sent token")
        })
      } // ether send
      else {
        const tx = {
          from: send_account,
          to: to_address,
          value: ethers.utils.parseEther(send_token_amount),
          nonce: window.ethersProvider.getTransactionCount(
            send_account,
            "latest"
          ),
          gasLimit: ethers.utils.hexlify(0x100000), // 100000
          gasPrice: gas_price,
        }
        console.log(tx)
        try {
          walletSigner.sendTransaction(tx).then((transaction) => {
            console.log(transaction)
            alert("Send finished!")
          })
        } catch (error) {
          alert("failed to send!!")
          console.log(error)
        }
      }
    })
  }

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, styles.header]}>
        <TouchableOpacity onPress={() => replace('TokenDetails')}>
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
                <Text style={[{color: darkMode ? 'white' : 'black'}]}>{gas * 0.00001} SMT</Text>
              </View>
            </View>
        </View>
        <Slider maximumValue={1} minimumValue={0} step={0.1}
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
