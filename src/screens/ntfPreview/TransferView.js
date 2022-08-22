import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import TitleAndTips from './comp/TitleAndTips';
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';
import HeaderRightBtn from '../tabs/HeaderRightBtn';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {PureTextInput} from '../../metalife-base';
import Slider from '@react-native-community/slider';
import {fixWalletAddress, getCurrentAccount, screenHeight} from '../../utils';
import PasswordModel from '../../shared/comps/PasswordModal';
import {
  getAccount,
  getTransferGasPrice,
  getWBalance,
} from '../../remote/wallet/WalletAPI';
import {transformNftItem} from '../../remote/contractOP';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
import Toast from 'react-native-tiny-toast';

const scan = require('../../assets/image/wallet/icon_scan_default_white.png');
const scanB = require('../../assets/image/wallet/icon_scan_default_black.png');
const contactBlack = require('../../assets/image/icons/icon_contact_default_black.png');
const contactWhite = require('../../assets/image/icons/icon_contact_default_white.png');

const TransferView = ({
  navigation,
  cfg: {darkMode},
  wallet,
  route: {params},
  deleteNftItemList,
}) => {
  const {tokenId, collectAddress, image, name} = params;
  const {goBack, navigate} = useNavigation();
  const {text, marginTop10, justifyCenter, flex1, BG, FG} = useSchemaStyles();
  const [address, setAddress] = useState('');
  const [gasPriceNumber, setGasPriceNumber] = useState(18);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [gasPrice, setGasPrice] = useState(18);
  const [gasLimit, setGasLimit] = useState(20);
  const currentAccount = getCurrentAccount(wallet);
  const [accountPrice, setAccountPrice] = useState(0);
  useEffect(() => {
    if (params?.address) {
      setAddress(params.address);
    }
  }, [params?.address]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: props => (
        <HeaderRightBtn
          btnIcon={!darkMode ? scan : scanB}
          btnHandler={() => {
            // !searching && setTipVisible(true);
            navigate('Scan', {onCallbackData: setAddress});
          }}
        />
      ),
    });
  }, [navigation, address]);
  useEffect(() => {
    getTransferGasPrice({type: currentAccount.type}).then(res => {
      const price = res.toString();
      setGasPrice(res);
      // setGasPriceNumber(Number(bigNumberFormatUnits(res.toString(), 9)));
    });
    getWBalance(currentAccount.type, currentAccount.address, res => {
      // console.log('smtrrrsss', res);
      setAccountPrice(res);
    });
  }, []);
  const nextClick = () => {
    if (address === '') {
      Toast.show('Please input address');
      return;
    }
    if (currentAccount.observer) {
      Toast.show('Observe account cannot transfer');
      return;
    }
    if (
      accountPrice.lt(
        bigNumberParseUnits(gasLimit + '', 4).mul(
          bigNumberParseUnits(gasPrice + '', 0),
        ),
      )
    ) {
      Toast.show('Insufficient funds');
      return;
    }
    setPwdVisible(true);
  };
  const onConfirmTransaction = pwd => {
    setToastVisible(true);
    setToastContent('loading...');
    const currentAccount = getCurrentAccount(wallet);
    // getAccount(currentAccount?.address, (isExit, keystore) => {
    //   if (isExit) {
    transformNftItem(
      currentAccount.type,
      '',
      pwd,
      address,
      fixWalletAddress(currentAccount.address),
      collectAddress,
      tokenId,
      gasLimit * 10000,
      hash => {
        setToastVisible(false);
        setPwdVisible(false);
        Toast.show('success');
        navigation.navigate('TransactionDetail', {
          gasPrice: bigNumberFormatUnits(gasPrice, 9),
          hash,
        });
        deleteNftItemList({
          type: currentAccount?.address,
          collectionAddress: collectAddress,
          id: tokenId,
        });
      },
      er => {
        setPwdVisible(false);
        setToastVisible(false);
        Toast.show(er?.error?.message || er);
      },
      (cbAdd, id) => {
        console.log('delecttttttt', cbAdd, id);
      },
    );
    //   }
    // });
  };
  const contactClick = () => {
    navigate('AddressContact', {back: 'TransferView'});
  };
  return (
    <View style={[flex1, BG, styles.con]}>
      <TitleAndTips title={'To'} />
      <View>
        <PureTextInput
          placeholder={'e.g. oxled3...'}
          style={[FG, styles.nameContainer]}
          onChangeText={setAddress}
          defaultValue={address}
        />
        <Pressable style={styles.contactView} onPress={contactClick}>
          <Image source={darkMode ? contactBlack : contactWhite} />
        </Pressable>
      </View>
      <TitleAndTips title={'Collectibles'} />
      <View style={[FG, styles.collectView]}>
        <Image source={{uri: image}} style={styles.collectImg} />
        <Text style={[text, styles.name]}>{name}</Text>
      </View>
      <TitleAndTips title={'Gas'} />
      <View style={[marginTop10, styles.marginH15, FG]}>
        <Slider
          style={[styles.slider, marginTop10]}
          minimumValue={20}
          maximumValue={300}
          value={gasLimit}
          thumbTintColor="#29DAD7"
          minimumTrackTintColor="#29DAD7"
          maximumTrackTintColor="#DADADA"
          step={10}
          onValueChange={value => {
            console.log(value);
            setGasLimit(value);
          }}
        />
        <Text style={text}>
          {`${
            bigNumberFormatUnits(
              bigNumberParseUnits(gasLimit + '', 4)
                .mul(bigNumberParseUnits(gasPrice + '', 0))
                .toString(),
            ) + ''
          } SMT`}
        </Text>
      </View>
      <Pressable style={styles.nextView} onPress={nextClick}>
        <Text style={styles.nextText}>Next</Text>
      </Pressable>

      <PasswordModel
        darkMode={darkMode}
        pwdVisible={pwdVisible}
        setPwdVisible={setPwdVisible}
        toastVisible={toastVisible}
        setToastVisible={setToastVisible}
        toastContent={toastContent}
        toastDuriation={6000000}
        onConfirm={pwd => {
          onConfirmTransaction(pwd);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    marginHorizontal: 15,
  },
  nameContainer: {
    borderRadius: 12,
    // width: 345,
    height: 44,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingRight: 40,
  },
  contactView: {
    position: 'absolute',
    right: 0,
    top: 22,
    width: 50,
    height: 50,
    alignItems: 'center',
  },
  collectView: {
    height: 100,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  collectImg: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  marginH15: {
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
  },
  slider: {
    height: 40,
    width: 240,
    // paddingLeft: 10,
  },
  nextView: {
    width: 345,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#29DAD7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  nextText: {
    fontSize: 15,
    color: '#000000',
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
    nft: s.nft,
  };
};

const mdp = d => {
  return {
    deleteNftItemList: payload => d({type: 'deleteNftItemList', payload}),
  };
};

export default connect(msp, mdp)(TransferView);
