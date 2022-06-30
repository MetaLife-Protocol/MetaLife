import React, {useCallback, useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useSchemaStyles, {
  colorsSchema,
} from '../../../../shared/UseSchemaStyles';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-tiny-toast';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import {TokenItem} from './items/TokenItem';
import {WalletAccountSwitchModal} from './modal/WalletAccountSwitchModal';
import {getCurrentAccount, getCurrentBalance} from '../../../../utils';

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
              goScreen('WalletCreator');
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
                  <Image source={iconDic.eyeOpen} />
                </Pressable>
                <Pressable
                  onPress={() =>
                    setCoinType(coinType === 'rmb' ? 'dollar' : 'rmb')
                  }>
                  <Image source={iconDic.dollar} />
                </Pressable>
              </View>
              <Pressable onPress={menuHandler}>
                <Image source={iconDic.dots} />
              </Pressable>
            </View>
            <Text style={[volume]}>
              {/*{coinType === 'rmb' ? '¥' : '$'}{' '}*/}
              {coinType === 'rmb' ? 'MLT' : 'MLT'}{' '}
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
        <View style={[marginTop10, row]}>
          {tags.map((value, index) => (
            <Pressable key={index} onPress={() => setSelected(index)}>
              <Text
                style={selected === index ? [text, tagActive] : [tagDefault]}>
                {value}
              </Text>
              {selected === index && (
                <View style={[indicator, alignSelfCenter]} />
              )}
            </Pressable>
          ))}
        </View>
        <ScrollView>
          <TokenItem title={'SMT'} quantity={100} price={1.0} amount={888} />
          <TokenItem title={'MESH'} quantity={100} price={1.0} amount={888} />
          <TokenItem title={'MLT'} quantity={100} price={1.0} amount={888} />
        </ScrollView>
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
    </SafeAreaView>
  );
};

const tags = ['Coin', 'DAO', 'NFT'];

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
