import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import {RoundBtn} from '../../../../metalife-base';
import {getGas} from '../../../../remote/wallet/WalletAPI';
import ComText from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletTransfer = props => {
  const {darkMode, showPullMenu, preAddress} = props;
  const {navigate} = useNavigation();
  const {
    flex1,
    FG,
    BG,
    row,
    alignSelfCenter,
    justifySpaceBetween,
    text,
    marginTop10,
    modalFG,
  } = useSchemaStyles();
  const [type, setType] = useState('SMT');
  const [address, setAddress] = useState('');

  useEffect(() => {
    getGas({
      type: 'spectrum',
      fromAddress: '0xc978beb3b6be2e96c527a025a3f023045cca1fa9',
      toAddress: '0x6025B091C6AB619F8e2F75170EB69dc57040dc6e',
      amount: '300',
      remark: '',
    });
  }, []);

  function menuHandler(e) {
    e.target.measure((x, y, width, height, pageX, pageY) =>
      showPullMenu({
        position: {
          x: pageX,
          y: pageY + height,
        },
        buttons: [
          {
            title: 'SMT',
            handler: () => {
              setType('SMT');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'MTL',
            handler: () => {
              setType('MLT');
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      }),
    );
  }
  return (
    <SafeAreaView style={[flex1, marginTop10]}>
      <Pressable
        style={[flex1, FG]}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={[styles.marginH15]}>
          <View style={[row, justifySpaceBetween]}>
            <ComText style={[text, styles.title]}>Receiving account</ComText>
            <View style={[row]}>
              <Pressable
                style={[styles.marginR15]}
                onPress={() => {
                  navigate('Scan', {onCallbackData: setAddress});
                }}>
                <Image source={darkMode ? icons.scanBlack : icons.scanWhite} />
              </Pressable>
              <Image
                source={darkMode ? icons.contactBlack : icons.contactWhite}
              />
            </View>
          </View>
          <ComText style={[text, styles.title, marginTop10]}>
            0xcC5D3A537EE0cE970da3c4914bC9c103d0805810
          </ComText>
        </View>
        <View style={[BG, styles.line]} />
        <View style={[styles.marginH15]}>
          <View style={[row, justifySpaceBetween]}>
            <ComText style={[text, styles.title]}>Transfers number</ComText>
            <Pressable style={[row]} onPress={menuHandler}>
              <ComText style={[styles.marginR15, text]}>{type}</ComText>
              <Image source={icons.right} />
            </Pressable>
          </View>
          <View style={[marginTop10]}>
            <TextInput
              style={[text, styles.inputText]}
              placeholder="Enter transfer amount"
              placeholderTextColor={'#A5ABB7'}
              keyboardType={'numeric'}
            />
          </View>
          <View style={[styles.line2, BG]} />
          <View style={[marginTop10, justifySpaceBetween, row]}>
            <ComText style={[text, styles.title]}>Amount</ComText>
            <ComText style={[text, styles.number]}>32748 SMT</ComText>
          </View>
        </View>
        <View style={[BG, styles.line]} />
        <View style={[styles.marginH15]}>
          <ComText style={[text, styles.title]}>Remark</ComText>
          <TextInput
            style={[text, styles.inputText, marginTop10]}
            placeholder="Enter comments"
            placeholderTextColor={'#A5ABB7'}
          />
        </View>
        <View style={[BG, styles.line]} />
        <View style={[marginTop10, justifySpaceBetween, row, styles.marginH15]}>
          <ComText style={[text, styles.title]}>Gas</ComText>
          <ComText style={[text, styles.gas]}>0.0000384 SMT</ComText>
        </View>
        <View style={[BG, styles.line]} />
        <RoundBtn
          style={[styles.btnContainer, marginTop10]}
          title={'Confirm'}
          press={() => {}}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const icons = {
  scanBlack: require('../../../../assets/image/icons/icon_scan_default_black.png'),
  scanWhite: require('../../../../assets/image/icons/icon_scan_default_white.png'),
  contactBlack: require('../../../../assets/image/icons/icon_contact_default_black.png'),
  contactWhite: require('../../../../assets/image/icons/icon_contact_default_white.png'),
  right: require('../../../../assets/image/shared/back.png'),
};

const styles = StyleSheet.create({
  title: {
    fontSize: Platform.OS === 'ios' ? 14 : 13,
    lineHeight: 17,
  },
  marginH15: {
    margin: 15,
  },
  marginR15: {
    marginRight: 15,
  },
  line: {
    height: 10,
  },
  line2: {
    height: 0.5,
    marginTop: 10,
  },
  inputText: {
    fontSize: 16,
    height: 30,
    padding: 0,
  },
  number: {
    fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 20,
  },
  gas: {
    fontSize: 14,
    lineHeight: 17,
  },
});

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};

export default connect(msp, mdp)(WalletTransfer);
