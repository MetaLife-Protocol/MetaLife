import React, {useCallback, useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  // Text,
  TextInput,
  View,
} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles, {
  colorsBasics,
  colorsSchema,
} from '../../../../shared/UseSchemaStyles';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-tiny-toast';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import {WalletAccountSwitchModal} from './modal/WalletAccountSwitchModal';
import {getCurrentAccount, getCurrentBalance} from '../../../../utils';
import {ComModal} from '../../../../shared/comps/ComModal';
import {exportAccountMnemonic} from '../../../../remote/wallet/WalletAPI';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import WalletCoinTabScreen from './WalletCoinTabScreen';
import WalletDaoTabScreen from './WalletDaoTabScreen';
import WalletNFTTabScreen from './WalletNFTTabScreen';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletDetails = ({cfg: {darkMode}, showPullMenu, wallet, setCurrent}) => {
  const {
      marginTop10,
      FG,
      row,
      flex1,
      text,
      justifySpaceAround,
      justifySpaceBetween,
      alignSelfCenter,
      alignItemsCenter,
      placeholderTextColor,
      modalFG,
    } = useSchemaStyles(),
    {
      container,
      title,
      volume,
      address,
      icons,
      tagDefault,
      tagActive,
      indicator,
    } = styles;

  const Tab = createMaterialTopTabNavigator();

  const {navigate} = useNavigation();

  const [pressed, setPressed] = useState(false),
    [selected, setSelected] = useState(0),
    [switchVisible, setSwitchVisible] = useState(false);

  const goScreen = useCallback(
    function (name, params) {
      navigate(name, params);
    },
    [navigate],
  );

  const [volumeVisible, setVolumeVisible] = useState(true);
  const [coinType, setCoinType] = useState('dollar');
  const [pwdVisible, setPwdVisible] = useState(false);
  const [pwd, setPwd] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');

  const [tipVisible, setTipVisible] = useState(false);

  const account = getCurrentAccount(wallet);

  function menuHandler(e) {
    e.target.measure((x, y, width, height, pageX, pageY) =>
      showPullMenu({
        position: {
          x: pageX - width - 76,
          y: pageY + height,
        },
        buttons: [
          {
            title: 'Switch account',
            handler: () => {
              setSwitchVisible(true);
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Create account',
            handler: () => {
              goScreen('WalletCreator', {type: wallet.current.type});
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Manage account',
            handler: () => {
              goScreen('WalletManager');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'QR code',
            handler: () => {
              goScreen('');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Address contact',
            handler: () => {
              goScreen('');
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      }),
    );
  }

  return (
    <SafeAreaView style={[flex1]}>
      <View style={[marginTop10, FG, flex1]}>
        <ImageBackground
          style={[marginTop10, container, justifySpaceAround, alignSelfCenter]}
          source={iconDic.BG}>
          <View>
            <View style={[row, justifySpaceBetween, {marginHorizontal: 15}]}>
              <View style={[row, justifySpaceBetween, {width: 115}]}>
                <Text style={[title]} numberOfLines={1}>
                  {getCurrentAccount(wallet).name}
                </Text>
                <Pressable onPress={() => setVolumeVisible(!volumeVisible)}>
                  <Image
                    source={volumeVisible ? iconDic.eyeOpen : iconDic.eyeClose}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    setCoinType(coinType === 'rmb' ? 'dollar' : 'rmb')
                  }>
                  <Image source={iconDic.dollar} />
                </Pressable>
              </View>
              <View style={[row]}>
                {account.backup ? null : (
                  <Pressable
                    style={styles.backup}
                    onPress={() => {
                      setTipVisible(true);
                    }}>
                    <Text style={styles.backupText}>Backup</Text>
                  </Pressable>
                )}
                <Pressable onPress={menuHandler}>
                  <Image source={iconDic.dots} />
                </Pressable>
              </View>
            </View>
            <Text style={[volume]}>
              {/*{coinType === 'rmb' ? '¥' : '$'}{' '}*/}
              {wallet.current.type === 'spectrum'
                ? 'MLT'
                : wallet.current.type === 'ethereum'
                ? 'ETH'
                : ''}{' '}
              {volumeVisible ? getCurrentBalance(wallet) : '******'}
            </Text>
          </View>
          <View style={[row]}>
            <Text style={[address]}>0x{getCurrentAccount(wallet).address}</Text>
            <Pressable
              onPress={() => {
                nativeClipboard.setString(
                  '0x' + getCurrentAccount(wallet).address.toString(),
                );
                Toast.show('Address copied');
              }}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}>
              <Image
                style={[icons]}
                source={pressed ? iconDic.copyA : iconDic.copyD}
              />
            </Pressable>
          </View>
        </ImageBackground>
        <Tab.Navigator
          style={[FG, marginTop10]}
          initialRouteName={'Coin'}
          backBehavior={'none'}
          screenOptions={{
            lazy: true,
            tabBarItemStyle: {
              width: 70,
            },
            tabBarLabelStyle: {
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'none',
            },
            tabBarIndicatorStyle: {
              width: 40,
              marginLeft: 15,
              marginRight: 15,
            },
          }}>
          <Tab.Screen
            name={'Coin'}
            initialParams={''}
            component={WalletCoinTabScreen}
          />
          <Tab.Screen
            name={'DAO'}
            initialParams={''}
            component={WalletDaoTabScreen}
          />
          <Tab.Screen
            name={'NFT'}
            initialParams={''}
            component={WalletNFTTabScreen}
          />
        </Tab.Navigator>
      </View>
      <WalletAccountSwitchModal
        visible={switchVisible}
        setVisible={setSwitchVisible}
        value={'1-2'}
        holderText={'nickname'}
        wallet={wallet}
        darkMode={darkMode}
        submitHandler={setCurrent}
      />
      <ComModal
        visible={tipVisible}
        setVisible={setTipVisible}
        title={'Please backup your wallet now'}
        darkMode={darkMode}
        content={
          <>
            <View style={[modalFG, styles.tipContainer, {marginTop: 0}]}>
              <Text style={[styles.greenColor]}>
                Unlike traditional website accounts, blockchain wallet is a
                decentralized account system based on cryptography.
              </Text>
              <Text style={[styles.greenColor, marginTop10]}>
                You must keep the private key and transaction password of your
                wallet. Any accident will lead to the loss of assets.
              </Text>
              <Text style={[styles.greenColor, marginTop10]}>
                We suggest to do a double backup first, then enter a small test,
                and finally start to use happily.
              </Text>
            </View>
            <Text style={[marginTop10, styles.tipTitle, text]}>
              Backup private key
            </Text>
            <Text style={[marginTop10, styles.tipDesc]}>
              When you lose your wallet or forget your password, you can restore
              your wallet
            </Text>
            <Text style={[marginTop10, styles.tipTitle, text]}>
              Backing up keystore files
            </Text>
            <Text style={[marginTop10, styles.tipDesc]}>
              Official wallet format, private key file protected by transaction
              password
            </Text>
          </>
        }
        submit={{
          text: 'Backup now',
          press: () => {
            setTipVisible(false);
            setPwdVisible(true);
          },
        }}
      />
      <ComModal
        visible={pwdVisible}
        setVisible={setPwdVisible}
        title={'Enter Password'}
        darkMode={darkMode}
        content={
          <View style={[alignItemsCenter, styles.inputContiner, row]}>
            <TextInput
              keyboardType={'ascii-capable'}
              autoCapitalize={'none'}
              textAlign={'left'}
              value={pwd}
              textContentType={'password'}
              secureTextEntry={true}
              placeholder={'Wallet password'}
              placeholderTextColor={placeholderTextColor.color}
              onChangeText={setPwd}
              style={[text, styles.input]}
            />
            <Pressable onPress={() => setPwd('')}>
              <Image
                style={styles.delete}
                source={darkMode ? iconDic.deleteIconB : iconDic.deleteIconB}
              />
            </Pressable>
          </View>
        }
        toastVisible={toastVisible}
        setToastVisible={setToastVisible}
        toastContent={toastContent}
        submit={{
          text: 'Confirm',
          press: () => {
            exportAccountMnemonic(account.address, pwd, (isSuccess, res) => {
              if (isSuccess) {
                setPwdVisible(false);
                goScreen('WalletBackup', {
                  account,
                  mnemonic: res.mnemonic,
                  shuffleMnemonic: res.shuffleMnemonic,
                });
              } else {
                setToastContent('Wrong password');
              }
            });
          },
        }}
        cancel={{
          text: 'Cancel',
          press: () => {
            setPwd('');
          },
        }}
      />
    </SafeAreaView>
  );
};

const iconDic = {
  BG: require('../../../../assets/image/wallet/wallet_backgroud.png'),
  dots: require('../../../../assets/image/wallet/more.png'),
  copyD: require('../../../../assets/image/wallet/address_copy.png'),
  copyA: require('../../../../assets/image/wallet/address_copy.png'),
  eyeOpen: require('../../../../assets/image/wallet/Login_icon_zhengyan_default_white.png'),
  eyeClose: require('../../../../assets/image/wallet/Login_icon_biyan_default_white.png'),
  dollar: require('../../../../assets/image/wallet/icon_dollar_default.png'),
  RMB: require('../../../../assets/image/wallet/icon_RMB_default.png'),
};

const styles = StyleSheet.create({
  container: {
    width: 345,
    height: 156.5,
  },
  title: {
    color: 'white',
    fontSize: 15,
    width: 60,
  },
  volume: {
    marginTop: 17,
    marginLeft: 15,
    color: 'white',
    fontSize: 27,
    fontWeight: '500',
  },
  address: {
    marginLeft: 15.5,
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
  backup: {
    height: 17,
    width: 55,
    backgroundColor: '#6A8AEB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backupText: {
    lineHeight: 15,
    fontSize: 13,
    color: '#fff',
  },
  icons: {
    marginLeft: 10,
  },
  tagDefault: {
    width: 55,
    textAlign: 'center',
    fontSize: 16,
    color: '#8E8E92',
  },
  tagActive: {
    width: 55,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 16,
  },
  indicator: {
    height: 2,
    width: 33,
    marginTop: 5,
    backgroundColor: colorsSchema.primary,
  },
  inputContiner: {
    display: 'flex',
    borderColor: '#4E586E',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 15,
    marginVertical: 15,
    borderWidth: 0.5,
  },
  input: {
    flexGrow: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  tipContainer: {
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
  },
  greenColor: {
    color: colorsBasics.primary,
    fontSize: 14,
    lineHeight: 17,
  },
  tipTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 19,
    marginHorizontal: 15,
  },
  tipDesc: {
    color: '#8E8E92',
    fontSize: 16,
    marginHorizontal: 15,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    relations: s.user.relations,
    infoDic: s.info,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
    setCurrent: payload => d({type: 'setCurrent', payload}),
  };
};

export default connect(msp, mdp)(WalletDetails);
