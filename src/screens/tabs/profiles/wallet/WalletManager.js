import {connect} from 'react-redux/lib/exports';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useSchemaStyles, {
  colorsSchema,
} from '../../../../shared/UseSchemaStyles';
import React, {useState} from 'react';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletManager = ({cfg: {darkMode}}) => {
  const {flex1, BG, FG, text, row, width100Percent, justifySpaceBetween} =
      useSchemaStyles(),
    {} = colorsSchema,
    {btn} = styles;

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
      case 'ether':
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

  return (
    <SafeAreaView style={[flex1, FG, row]}>
      <View style={[{backgroundColor: darkMode ? '#2b2f2f' : '#edeef1'}]}>
        {Object.keys(walletData).map(k => (
          <Pressable key={k} onPress={() => setTIndex(k)}>
            <View style={k === tIndex && FG}>
              <Image style={[btn]} source={getIcon(k, k === tIndex)} />
            </View>
          </Pressable>
        ))}
      </View>
      <View style={[flex1, FG]}>
        <View style={[row, justifySpaceBetween, {marginHorizontal: 10}]}>
          <Text style={[text]}>{tIndex}</Text>
          <Image source={getBtnIcon()} />
        </View>
        {walletData[tIndex].map(({name, publicKey}, index) => (
          <Text key={index} style={[text]}>
            {name + ' : ' + publicKey}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const walletData = {
  spectrum: [
    {name: 's-a', publicKey: 123},
    {name: 's-b', publicKey: 123},
  ],
  ether: [
    {name: 'e-a', publicKey: 123},
    {name: 'e-b', publicKey: 123},
  ],
};

const icons = {
  walletActiveSpectrum: require('../../../../assets/image/wallet/Spectrum1.png'),
  walletInactiveWSpectrum: require('../../../../assets/image/wallet/Spectrum-white.png'),
  walletInactiveBSpectrum: require('../../../../assets/image/wallet/Spectrum-black.png'),
  walletActiveEther: require('../../../../assets/image/wallet/Ethereum.png'),
  walletInactiveWEther: require('../../../../assets/image/wallet/Ethereum-white.png'),
  walletInactiveBEther: require('../../../../assets/image/wallet/Ethereum-black.png'),
  //  plus btn
  plusBtnDefaultW: require('../../../../assets/image/wallet/icon_add_default_white.png'),
  plusBtnDefaultB: require('../../../../assets/image/wallet/icon_add_default_black.png'),
  plusBtnActiveW: require('../../../../assets/image/wallet/icon_add_presses_white.png'),
  plusBtnActiveB: require('../../../../assets/image/wallet/icon_add_presses_black.png'),
};

const styles = StyleSheet.create({
  btn: {
    margin: 15,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(WalletManager);
