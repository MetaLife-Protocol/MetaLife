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
  importAccountByKeystore,
  importAccountByMnemonic,
  importAccountByPrivateKey,
} from '../../../../remote/wallet/WalletAPI';
import Toast from 'react-native-tiny-toast';
import {useNavigation} from '@react-navigation/native';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const icon = {
  scanW: require('../../../../assets/image/wallet/icon_scan_default_white.png'),
  scanB: require('../../../../assets/image/wallet/icon_scan_default_black.png'),
};

const WalletImporter = ({cfg: {darkMode}, route: {params}, wallet, create}) => {
  const {navigate, goBack} = useNavigation();
  const {flex1, FG, BG, row, alignSelfCenter, text, marginTop10, modalFG} =
      useSchemaStyles(),
    {textHolder} = colorsSchema;

  const [copyInfo, setCopyInfo] = useState(''),
    [pw, setPW] = useState(''),
    [cPw, setCPW] = useState(''),
    [prompt, setPrompt] = useState('');

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  const targetChain = params ? params.type : targetChain;

  const tags = ['Mnemoic', 'Keystore', 'Private Key', 'Observe'];
  const [selected, setSelected] = useState(0);
  const [address, setAddress] = useState('');

  function goScreen(name, params) {
    navigate(name, params);
  }

  const exportAccount = (address, observer) => {
    const count = wallet.accounts[targetChain].length + 1;
    create({
      type: targetChain,
      name: targetChain + '-' + count,
      address: address,
      observer,
    });
    goBack();
    Toast.show('Import success');
  };

  const renderPage = (placeholder, press, tip) => {
    return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[flex1]}>
            {tip ? <Text style={styles.tip}>{tip}</Text> : null}
            <TextInput
              style={[text, styles.copyBorder]}
              multiline={true}
              value={copyInfo}
              placeholder={placeholder}
              placeholderTextColor={textHolder}
              onChangeText={setCopyInfo}
            />
            <Section separator={NormalSeparator}>
              <ControllerItem>
                <TextInput
                  style={[text, flex1]}
                  value={pw}
                  placeholder={'Set Password'}
                  placeholderTextColor={textHolder}
                  onChangeText={setPW}
                />
              </ControllerItem>
              <ControllerItem>
                <TextInput
                  style={[text, flex1]}
                  value={cPw}
                  placeholder={'Confirm Password'}
                  placeholderTextColor={textHolder}
                  onChangeText={setCPW}
                />
              </ControllerItem>
              <ControllerItem>
                <TextInput
                  style={[text, flex1]}
                  value={prompt}
                  placeholder={'Password prompt (optional)'}
                  placeholderTextColor={textHolder}
                  onChangeText={setPrompt}
                />
              </ControllerItem>
            </Section>
          </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <RoundBtn
            style={[{marginBottom: 50}]}
            title={'Start Importing'}
            disabled={!(copyInfo && pw && cPw && pw === cPw)}
            press={press}
          />
        </KeyboardAvoidingView>
      </>
    );
  };
  const renderObserve = () => {
    return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[flex1]}>
            <Text style={styles.tip}>
              Observe mode only needs the wallet address
            </Text>
            <ControllerItem>
              <TextInput
                style={[text, flex1, {height: 50, fontSize: 15}]}
                value={address}
                placeholder={'Enter The Address'}
                placeholderTextColor={textHolder}
                onChangeText={setAddress}
              />
              <Pressable
                onPress={() =>
                  goScreen('Scan', {
                    onCallbackData: setAddress,
                  })
                }>
                <Image source={darkMode ? icon.scanB : icon.scanW} />
              </Pressable>
            </ControllerItem>
            <View style={[styles.line, BG]} />
          </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <RoundBtn
            style={[{marginBottom: 50}]}
            title={'Start Importing'}
            disabled={!(copyInfo && pw && cPw && pw === cPw)}
            press={() => exportAccount(address, true)}
          />
        </KeyboardAvoidingView>
      </>
    );
  };

  const renderContent = () => {
    if (selected === 0) {
      return renderPage(
        'Please use space to separate the mnemonic words',
        () => {
          importAccountByMnemonic(copyInfo, pw, targetChain, (isExit, res) => {
            if (isExit) {
              exportAccount(res.keystore.address, false);
            } else {
              Toast.show('Wrong password');
            }
          });
        },
      );
    }
    if (selected === 1) {
      return renderPage(
        'Keystore text content',
        () => {
          importAccountByKeystore(copyInfo, pw, (isExit, res) => {
            if (isExit) {
              const keystore = JSON.parse(res.keystore);
              exportAccount(keystore.address, false);
            } else {
              Toast.show('Wrong password');
            }
          });
        },
        'Copy and paste Ether keystore.',
      );
    }
    if (selected === 2) {
      return renderPage('Please enter the private key in text.', () => {
        importAccountByPrivateKey(copyInfo, pw, (isExit, res) => {
          if (isExit) {
            exportAccount(res.keystore.address, false);
          } else {
            Toast.show('Wrong password');
          }
        });
      });
    }

    if (selected === 3) {
      return renderObserve();
    }
  };

  const reset = () => {
    setCopyInfo('');
    setPW('');
    setCPW('');
    setPrompt('');
  };

  return (
    <SafeAreaView style={[flex1, FG, marginTop10]}>
      <View style={[row]}>
        {tags.map((value, index) => (
          <Pressable
            key={index}
            onPress={() => {
              reset();
              setSelected(index);
            }}
            style={styles.tagActive}>
            <Text
              style={
                selected === index
                  ? [styles.tagActive, text]
                  : [styles.tagDefault, flex1]
              }>
              {value}
            </Text>
            {selected === index && (
              <View style={[styles.indicator, alignSelfCenter]} />
            )}
          </Pressable>
        ))}
      </View>
      <View style={[styles.line, modalFG]} />
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tip: {
    color: '#4E586E',
    fontSize: 15,
    marginHorizontal: 15,
    marginTop: 15,
  },
  copyBorder: {
    height: 135,
    borderColor: '#4E586E',
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  tagDefault: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 46,
    color: '#8E8E92',
  },
  tagActive: {
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 46,
    color: '#E2EDEA',
    fontSize: 15,
    height: 46,
    textAlign: 'center',
  },
  indicator: {
    height: 2,
    width: 40,
    backgroundColor: colorsSchema.primary,
  },
  line: {
    height: 0.5,
    width: '100%',
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
    create: payload => d({type: 'walletCreateAccount', payload}),
  };
};

export default connect(msp, mdp)(WalletImporter);
