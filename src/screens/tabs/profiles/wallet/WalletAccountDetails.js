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
import {
  abbreviationAccount,
  getCurrentAccount,
  getCurrentBalance,
} from '../../../../utils';
import {financeConfig} from '../../../../remote/wallet/WalletAPI';
import RoundBtn from '../../../../shared/comps/RoundBtn';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletAccountDetails = ({
  cfg: {darkMode},
  route: {
    params: {name, address, key},
  },
  showPullMenu,
  wallet,
  setCurrent,
}) => {
  const {
      marginTop10,
      FG,
      BG,
      row,
      flex1,
      text,
      justifyContent,
      alignItemsCenter,
    } = useSchemaStyles(),
    {container, title, volume, icons, tagDefault, tagActive, indicator} =
      styles;

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

  function getIcon(key) {
    switch (key) {
      case 'spectrum':
        return iconDic.walletActiveSpectrum;
      case 'ethereum':
        return iconDic.walletActiveEther;
    }
  }

  return (
    <SafeAreaView style={[flex1]}>
      <View style={[FG, justifyContent, marginTop10, styles.container]}>
        <Image style={styles.avater} source={getIcon(key)} />
        <View style={[row, justifyContent, alignItemsCenter, styles.titleView]}>
          <Text style={[text, styles.title]}>{name}</Text>
          <Image style={[styles.edit]} source={iconDic.iconDeitDefault} />
        </View>
        <View style={[styles.line, BG]} />
        <Text style={[text, styles.id]}>{address}</Text>
        <RoundBtn
          style={[styles.button]}
          title={'Export keystore'}
          press={() => {
            nativeClipboard.setString('');
            Toast.show('ID copied');
          }}
        />
        <RoundBtn
          style={[styles.button]}
          title={'Export private key'}
          press={() => Toast.show('ID copied')}
        />
        <RoundBtn
          style={[styles.button]}
          title={'Delete'}
          press={() => Toast.show('ID copied')}
        />
      </View>
    </SafeAreaView>
  );
};

const iconDic = {
  iconDeitDefault: require('../../../../assets/image/wallet/icon_deit_default.png'),
  walletActiveSpectrum: require('../../../../assets/image/wallet/Spectrum1.png'),
  walletInactiveWSpectrum: require('../../../../assets/image/wallet/Spectrum-white.png'),
  walletInactiveBSpectrum: require('../../../../assets/image/wallet/Spectrum-black.png'),
  walletActiveEther: require('../../../../assets/image/wallet/Ethereum.png'),
  walletInactiveWEther: require('../../../../assets/image/wallet/Ethereum-white.png'),
  walletInactiveBEther: require('../../../../assets/image/wallet/Ethereum-black.png'),
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    paddingBottom: 20,
    borderRadius: 12,
  },
  avater: {
    marginTop: 25,
    height: 35,
    width: 35,
    alignSelf: 'center',
  },
  titleView: {
    marginTop: 10,
    alignSelf: 'center',
  },
  line: {
    height: 1,
    margin: 5,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 20,
  },
  edit: {
    marginLeft: 6,
  },
  id: {
    marginVertical: 20,
    alignSelf: 'center',
    color: '#8E8E92',
  },
  button: {
    marginTop: 15,
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

export default connect(msp, mdp)(WalletAccountDetails);
