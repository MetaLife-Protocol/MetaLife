import {connect} from 'react-redux/lib/exports';
import React, {useCallback, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Section from '../../../../shared/comps/Section';
import {NormalSeparator} from '../../../../shared/comps/SectionSeparators';
import ControllerItem from '../../../../shared/comps/ControllerItem';
import useSchemaStyles, {
  colorsSchema,
} from '../../../../shared/UseSchemaStyles';
import RoundBtn from '../../../../shared/comps/RoundBtn';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {
  createAccount,
  exportAccountPrivateKey,
  getWBalance,
  importAccountByMnemonic,
} from '../../../../remote/wallet/WalletAPI';
import Toast from 'react-native-tiny-toast';
import {useRoute} from '@react-navigation/native';
import {initPhoton} from '../../../photon/PhotonUtils';
import {getMnemonic, inviteAccept} from '../../../../remote/ssb/ssbOP';
import {shuffle} from '../../../../utils';
import {bindIDAndWallet} from '../../../../remote/pubOP';
import {presetPubs, reconnect2pub} from '../Pubs';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletCreator = ({
  cfg: {lang, darkMode, verbose},
  route: {params},
  navigation: {replace},
  wallet,
  walletCreateAccount,
  setBalance,
  setCurrent,
  feedId,
}) => {
  const {flex1, FG, with100p, row, alignItemsCenter, text, marginTop10} =
      useSchemaStyles(),
    {textHolder} = colorsSchema,
    {inputs} = styles;

  const [aName, setAName] = useState((params && params.name) || ''),
    [pw, setPW] = useState(''),
    [cPw, setCPW] = useState(''),
    [prompt, setPrompt] = useState(''),
    [observer, setObserver] = useState(false),
    [backup, setBackup] = useState(false);

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  const targetChain = params ? params.type : wallet.current.type;

  function clearInputs() {
    setAName('');
    setPW('');
    setCPW('');
    setPrompt('');
    Toast.show('Wallet creating...', {
      loading: true,
      position: Toast.position.CENTER,
    });
  }

  return (
    <SafeAreaView style={[flex1, FG, marginTop10]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[flex1]}>
          <Section separator={NormalSeparator}>
            <ControllerItem>
              <TextInput
                style={[inputs, text, with100p]}
                value={aName}
                placeholder={'Account name'}
                placeholderTextColor={textHolder}
                onChangeText={setAName}
              />
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[inputs, text, with100p]}
                value={pw}
                placeholder={'Password'}
                placeholderTextColor={textHolder}
                onChangeText={setPW}
              />
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[inputs, text, with100p]}
                value={cPw}
                placeholder={'Confirm password'}
                placeholderTextColor={textHolder}
                onChangeText={setCPW}
              />
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[inputs, text, with100p]}
                value={prompt}
                placeholder={'Password prompt (optional)'}
                placeholderTextColor={textHolder}
                onChangeText={setPrompt}
              />
            </ControllerItem>
            <ControllerItem>
              <Text style={[text, {color: textHolder}]}>
                Note:MetaLife waller does not save user password nor provide
                backups.All password are required to backup using encrypted
                private key.We highly recommended to backup and save your
                private key at the same time,otherwise your wallet can never be
                retrieved.
              </Text>
            </ControllerItem>
          </Section>
        </View>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <RoundBtn
          style={[{marginBottom: 40}]}
          title={'Create account'}
          disabled={!(aName && pw && cPw && pw === cPw)}
          press={() =>
            params.from === 'guid'
              ? getMnemonic(mnemonic => {
                  clearInputs();
                  importAccountByMnemonic(
                    mnemonic.trim(),
                    pw,
                    'spectrum',
                    (isExit, res) => {
                      const {
                        keystore: {address},
                      } = res;
                      const account = {
                        type: 'spectrum',
                        name: aName,
                        prompt,
                        address,
                        observer,
                        backup: false,
                      };
                      walletCreateAccount(account);
                      setCurrent({type: 'spectrum', index: 0});
                      // getWBalance('spectrum', address, setBalance);
                      // join pub 2
                      inviteAccept(presetPubs[0].invite, (e, v) => {
                        // inviteAccept(presetPubs[1].invite, (e, v) => {
                        console.log(e ? e.message : 'invite accepted');
                        e || reconnect2pub();
                      });
                      // register pub
                      bindIDAndWallet(
                        {client_id: feedId, client_eth_address: '0x' + address},
                        console.log,
                      );
                      // start photon
                      // exportAccountPrivateKey(address, pw, ({_, privateKey}) =>
                      //   initPhoton({privateKey, address}),
                      // );
                      Toast.hide();
                      replace('WalletBackup', {
                        ...params,
                        account,
                        mnemonic: mnemonic.trim().split(' '),
                        shuffleMnemonic: shuffle(mnemonic),
                      });
                    },
                  );
                })
              : createAccount(pw, targetChain, res => {
                  const {
                    keystore: {address},
                    mnemonic,
                    shuffleMnemonic,
                  } = res;
                  clearInputs();
                  const account = {
                    type: targetChain,
                    name: aName,
                    prompt,
                    address,
                    observer,
                    backup: false,
                  };
                  walletCreateAccount(account);
                  const index = wallet.accounts[targetChain].length;
                  setCurrent({type: targetChain, index});
                  Toast.show('Wallet created');
                  replace('WalletBackup', {
                    ...params,
                    account,
                    mnemonic,
                    shuffleMnemonic,
                  });
                })
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputs: {
    fontSize: 16,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    wallet: s.wallet,
    feedId: s.user.feedId,
  };
};

const mdp = d => {
  return {
    setBalance: payload => d({type: 'setBalance', payload}),
    walletCreateAccount: payload => d({type: 'walletCreateAccount', payload}),
    setCurrent: payload => d({type: 'setCurrent', payload}),
  };
};

export default connect(msp, mdp)(WalletCreator);
