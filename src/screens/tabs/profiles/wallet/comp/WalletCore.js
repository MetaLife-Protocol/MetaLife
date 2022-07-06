import {connect} from 'react-redux/lib/exports';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useSchemaStyles, {
  colorsSchema,
} from '../../../../../shared/UseSchemaStyles';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AccountItem} from '../items/AccountItem';
import {stopAboutWalletAccount} from '../../../../../utils';
import {financeConfig} from '../../../../../remote/wallet/financeConfig';

/**
 * Created on 22 Jun 2022 by lonmee
 *
 */

const WalletCore = ({
  cfg: {darkMode},
  wallet: {current, accounts},
  setCurrent,
  showPullMenu,
  closeHandler,
  manageHandle,
}) => {
  const {flex1, FG, text, row, justifySpaceBetween} = useSchemaStyles(),
    {} = colorsSchema,
    {btn, titleS} = styles;

  const {navigate} = useNavigation();

  const [tIndex, setTIndex] = useState('spectrum');
  const [plusActive, setPlusActive] = useState(false);

  function getIcon(key, active) {
    switch (key) {
      case 'spectrum':
        return active
          ? icons.walletActiveSpectrum
          : darkMode
          ? icons.walletInactiveBSpectrum
          : icons.walletInactiveWSpectrum;
      case 'ethereum':
        return active
          ? icons.walletActiveEther
          : darkMode
          ? icons.walletInactiveBEther
          : icons.walletInactiveWEther;
    }
  }

  function getBtnIcon() {
    return darkMode
      ? plusActive
        ? icons.plusBtnActiveB
        : icons.plusBtnDefaultB
      : plusActive
      ? icons.plusBtnActiveW
      : icons.plusBtnDefaultW;
  }

  function goScreen(name, params) {
    navigate(name, params);
  }

  function menuHandler(e, type) {
    e.target.measure((x, y, width, height, pageX, pageY) =>
      showPullMenu({
        position: {
          x: pageX - width - 30,
          y: pageY + height,
        },
        buttons: [
          {
            title: 'Create',
            handler: () => {
              goScreen('WalletCreator', {type});
              closeHandler && closeHandler();
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Import',
            handler: () => {
              goScreen('WalletImporter', {type});
              closeHandler && closeHandler();
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      }),
    );
  }

  return (
    <View style={[flex1, FG, row]}>
      <View style={[{backgroundColor: darkMode ? '#2b2f2f' : '#edeef1'}]}>
        {Object.keys(financeConfig.chains).map(k => (
          <Pressable key={k} onPress={() => setTIndex(k)}>
            <View style={k === tIndex && FG}>
              <Image style={[btn]} source={getIcon(k, k === tIndex)} />
            </View>
          </Pressable>
        ))}
      </View>
      <View style={[flex1, FG]}>
        <View
          style={[
            row,
            justifySpaceBetween,
            {marginHorizontal: 10, marginVertical: 15},
          ]}>
          <Text style={[text, titleS]}>
            {tIndex === 'spectrum' ? 'Spectrum' : 'Ethereum'}
          </Text>
          <Pressable onPress={event => menuHandler(event, tIndex)}>
            <Image source={getBtnIcon()} />
          </Pressable>
        </View>
        <ScrollView>
          {accounts[tIndex] &&
            accounts[tIndex].map((v, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  if (manageHandle) {
                    goScreen('WalletAccountDetails', accounts[tIndex][i]);
                  } else {
                    setCurrent({type: tIndex, index: i});
                    stopAboutWalletAccount();
                  }
                }}>
                <AccountItem
                  item={v}
                  selected={tIndex === current.type && i === current.index}
                  darkMode={darkMode}
                />
              </Pressable>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

const icons = {
  walletActiveSpectrum: require('../../../../../assets/image/wallet/Spectrum1.png'),
  walletInactiveWSpectrum: require('../../../../../assets/image/wallet/Spectrum-white.png'),
  walletInactiveBSpectrum: require('../../../../../assets/image/wallet/Spectrum-black.png'),
  walletActiveEther: require('../../../../../assets/image/wallet/Ethereum.png'),
  walletInactiveWEther: require('../../../../../assets/image/wallet/Ethereum-white.png'),
  walletInactiveBEther: require('../../../../../assets/image/wallet/Ethereum-black.png'),
  //  plus btn
  plusBtnDefaultW: require('../../../../../assets/image/wallet/icon_add_default_white.png'),
  plusBtnDefaultB: require('../../../../../assets/image/wallet/icon_add_default_black.png'),
  plusBtnActiveW: require('../../../../../assets/image/wallet/icon_add_presses_white.png'),
  plusBtnActiveB: require('../../../../../assets/image/wallet/icon_add_presses_black.png'),
};

const styles = StyleSheet.create({
  btn: {
    margin: 15,
  },
  titleS: {
    fontSize: 16,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    setCurrent: payload => d({type: 'setCurrent', payload}),
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};

export default connect(msp, mdp)(WalletCore);
