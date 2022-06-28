import {connect} from 'react-redux/lib/exports';
import React, {useState} from 'react';
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
import {createAccount} from '../../../../remote/wallet/WalletAPI';
import Toast from 'react-native-tiny-toast';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletCreator = ({
  cfg: {lang, darkMode, verbose},
  route: {params},
  navigation: {goBack},
  wallet,
  walletCreateAccount,
}) => {
  const {flex1, FG, with100p, row, alignItemsCenter, text, marginTop10} =
      useSchemaStyles(),
    {textHolder} = colorsSchema,
    {invite} = styles;

  const [aName, setAName] = useState(''),
    [pw, setPW] = useState(''),
    [cPw, setCPW] = useState(''),
    [prompt, setPrompt] = useState(''),
    [observer, setObserver] = useState(false);

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  const targetChain = params ? params.type : wallet.current.type;

  return (
    <SafeAreaView style={[flex1, FG, marginTop10]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[flex1]}>
          <Section separator={NormalSeparator}>
            <ControllerItem>
              <TextInput
                style={[invite, text, with100p]}
                value={aName}
                placeholder={'Account name'}
                placeholderTextColor={textHolder}
                onChangeText={setAName}
              />
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[invite, text, with100p]}
                value={pw}
                placeholder={'Password'}
                placeholderTextColor={textHolder}
                onChangeText={setPW}
              />
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[invite, text, with100p]}
                value={cPw}
                placeholder={'Confirm password'}
                placeholderTextColor={textHolder}
                onChangeText={setCPW}
              />
            </ControllerItem>
            <ControllerItem>
              <TextInput
                style={[invite, text, with100p]}
                value={prompt}
                placeholder={'Password prompt (optional)'}
                placeholderTextColor={textHolder}
                onChangeText={setPrompt}
              />
            </ControllerItem>
            <ControllerItem>
              <Text style={[text]}>
                {`Note:MetaLife waller does not save user password
                    nor provide backups.All password are required to
                    backup using encrypted private key.We highly
                    recommended to backup and save your private key
                    at the same time,otherwise your wallet can never
                    be retrieved.`}
              </Text>
            </ControllerItem>
          </Section>
        </View>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <RoundBtn
          style={[{marginBottom: 50}]}
          title={'Create account'}
          disabled={!(aName && pw && cPw && pw === cPw)}
          press={() =>
            createAccount(pw, targetChain, res => {
              console.log('res', res);
              const {
                keystore: {address},
                mnemonic,
                shuffleMnemonic,
              } = res;
              setAName('');
              setPW('');
              setCPW('');
              setPrompt('');
              walletCreateAccount({
                type: targetChain,
                name: aName,
                address,
                mnemonic,
                shuffleMnemonic,
                observer,
              });
              Toast.show('Wallet created');
              goBack();
            })
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

const msp = s => {
  return {
    cfg: s.cfg,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    walletCreateAccount: payload => d({type: 'walletCreateAccount', payload}),
  };
};

export default connect(msp, mdp)(WalletCreator);
