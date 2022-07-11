import {connect} from 'react-redux/lib/exports';
import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  importAccountByMnemonic,
} from '../../../../remote/wallet/WalletAPI';
import Toast from 'react-native-tiny-toast';
import {getMnemonic, inviteAccept} from '../../../../remote/ssb/ssbOP';
import {shuffle} from '../../../../utils';
import {presetPubs, reconnect2pub} from '../Pubs';
import {pubHostByIp} from '../../../../remote/pubOP';

const icons = {
  deleteW: require('../../../../assets/image/wallet/Login_icon_delete_white.png'),
  deleteB: require('../../../../assets/image/wallet/Login_icon_delete.png'),
  eyeOpenW: require('../../../../assets/image/wallet/Login_icon_zhengyan_default_white.png'),
  eyeCloseW: require('../../../../assets/image/wallet/Login_icon_biyan_default_white.png'),
  eyeOpenB: require('../../../../assets/image/wallet/Login_icon_zhengyan.png'),
  eyeCloseB: require('../../../../assets/image/wallet/Login_icon_biyanjing.png'),
};

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletCreator = ({
  cfg: {darkMode},
  route: {params},
  navigation: {replace},
  wallet,
  walletCreateAccount,
  setCurrent,
  suggestPubs,
}) => {
  const {flex1, FG, text, marginTop10} = useSchemaStyles(),
    {textHolder} = colorsSchema,
    {inputs} = styles;

  const [aName, setAName] = useState((params && params.name) || ''),
    [pw, setPW] = useState(''),
    [cPw, setCPW] = useState(''),
    [prompt, setPrompt] = useState(''),
    [observer, setObserver] = useState(false);

  const [pwdSecure, setPwdSecure] = useState(true);
  const [pwdConfirmSecure, setPwdConfirmSecure] = useState(true);

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  const targetChain = params.type;

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
        <View style={[flex1, Platform.OS === 'android' ? null : marginTop10]}>
          <Section
            separator={style =>
              NormalSeparator({
                ...style,
                marginTop: Platform.OS === 'android' ? 3 : 18,
                marginBottom: Platform.OS === 'android' ? 3 : 18,
              })
            }>
            <ControllerItem>
              <TextInput
                style={[inputs, text, flex1]}
                value={aName}
                placeholder={'Wallet name'}
                placeholderTextColor={textHolder}
                onChangeText={setAName}
              />
              <Pressable onPress={() => setAName('')}>
                <Image source={darkMode ? icons.deleteB : icons.deleteW} />
              </Pressable>
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[inputs, text, flex1]}
                value={pw}
                secureTextEntry={pwdSecure}
                placeholder={'Password'}
                placeholderTextColor={textHolder}
                onChangeText={setPW}
              />
              <Pressable onPress={() => setPwdSecure(!pwdSecure)}>
                <Image
                  source={
                    pwdSecure
                      ? darkMode
                        ? icons.eyeCloseB
                        : icons.eyeCloseW
                      : darkMode
                      ? icons.eyeOpenB
                      : icons.eyeOpenW
                  }
                />
              </Pressable>
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[inputs, text, flex1]}
                value={cPw}
                secureTextEntry={pwdConfirmSecure}
                placeholder={'Confirm password'}
                placeholderTextColor={textHolder}
                onChangeText={setCPW}
              />
              <Pressable onPress={() => setPwdConfirmSecure(!pwdConfirmSecure)}>
                <Image
                  source={
                    pwdConfirmSecure
                      ? darkMode
                        ? icons.eyeCloseB
                        : icons.eyeCloseW
                      : darkMode
                      ? icons.eyeOpenB
                      : icons.eyeOpenW
                  }
                />
              </Pressable>
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[inputs, text, flex1]}
                value={prompt}
                placeholder={'Password hint'}
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                  const index = wallet.accounts[targetChain]
                    ? wallet.accounts[targetChain].length
                    : 0;
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
  image: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignContent: 'center',
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
    setBalance: payload => d({type: 'setBalance', payload}),
    walletCreateAccount: payload => d({type: 'walletCreateAccount', payload}),
    setCurrent: payload => d({type: 'setCurrent', payload}),
  };
};

export default connect(msp, mdp)(WalletCreator);
