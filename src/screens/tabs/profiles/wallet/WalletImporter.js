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
  // Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Text from '../../../../shared/comps/ComText';
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
import {getCurrentAccount, stopAboutWalletAccount} from '../../../../utils';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const icon = {
  scanW: require('../../../../assets/image/wallet/icon_scan_default_white.png'),
  scanB: require('../../../../assets/image/wallet/icon_scan_default_black.png'),
  eyeOpenW: require('../../../../assets/image/wallet/Login_icon_zhengyan_default_white.png'),
  eyeCloseW: require('../../../../assets/image/wallet/Login_icon_biyan_default_white.png'),
  eyeOpenB: require('../../../../assets/image/wallet/Login_icon_zhengyan.png'),
  eyeCloseB: require('../../../../assets/image/wallet/Login_icon_biyanjing.png'),
};

const WalletImporter = ({
  cfg: {darkMode},
  route: {params},
  wallet,
  create,
  setCurrent,
}) => {
  const {navigate, goBack} = useNavigation();
  const {flex1, FG, BG, row, alignSelfCenter, text, marginTop10, modalFG} =
      useSchemaStyles(),
    {textHolder} = colorsSchema;

  const [copyInfo, setCopyInfo] = useState(''),
    [pw, setPW] = useState(''),
    [cPw, setCPW] = useState(''),
    [prompt, setPrompt] = useState('');

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  const targetChain = params.type;

  const tags = ['Mnemonic', 'Keystore', 'Private Key', 'Observe'];
  const [selected, setSelected] = useState(0);
  const [address, setAddress] = useState('');

  const [pwdSecure, setPwdSecure] = useState(true);
  const [pwdConfrimSecure, setPwdConfrimSecure] = useState(true);

  function goScreen(name, params) {
    navigate(name, params);
  }

  const exportAccount = (address, observer) => {
    const isExit = wallet.accounts[targetChain].find(
      val => val.address === address,
    );
    if (isExit) {
      Toast.show('Already imported', {
        position: Toast.position.CENTER,
      });
      return;
    }
    const count = wallet.accounts[targetChain].length + 1;
    create({
      type: targetChain,
      name: targetChain + '-' + count,
      address: address,
      observer,
      prompt,
      backup: true,
    });
    const previewAccount = getCurrentAccount(wallet);
    if (!previewAccount.observer) {
      stopAboutWalletAccount();
    }
    setCurrent({
      type: targetChain,
      index: wallet.accounts[targetChain].length,
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
              allowFontScaling={false}
              style={[text, styles.copyBorder]}
              multiline={true}
              textAlignVertical={'top'}
              value={copyInfo}
              placeholder={placeholder}
              placeholderTextColor={textHolder}
              onChangeText={setCopyInfo}
            />
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
                  allowFontScaling={false}
                  style={[text, flex1]}
                  value={pw}
                  textAlignVertical={'top'}
                  secureTextEntry={pwdSecure}
                  placeholder={'Set Password'}
                  placeholderTextColor={textHolder}
                  onChangeText={setPW}
                />
                <Pressable onPress={() => setPwdSecure(!pwdSecure)}>
                  <Image
                    source={
                      pwdSecure
                        ? darkMode
                          ? icon.eyeCloseB
                          : icon.eyeCloseW
                        : darkMode
                        ? icon.eyeOpenB
                        : icon.eyeOpenW
                    }
                  />
                </Pressable>
              </ControllerItem>
              <ControllerItem>
                <TextInput
                  allowFontScaling={false}
                  style={[text, flex1]}
                  value={cPw}
                  textAlignVertical={'top'}
                  secureTextEntry={pwdConfrimSecure}
                  placeholder={'Confirm Password'}
                  placeholderTextColor={textHolder}
                  onChangeText={setCPW}
                />
                <Pressable
                  onPress={() => setPwdConfrimSecure(!pwdConfrimSecure)}>
                  <Image
                    source={
                      pwdConfrimSecure
                        ? darkMode
                          ? icon.eyeCloseB
                          : icon.eyeCloseW
                        : darkMode
                        ? icon.eyeOpenB
                        : icon.eyeOpenW
                    }
                  />
                </Pressable>
              </ControllerItem>
              <ControllerItem>
                <TextInput
                  allowFontScaling={false}
                  style={[text, flex1]}
                  value={prompt}
                  textAlignVertical={'top'}
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                allowFontScaling={false}
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
            disabled={!address}
            press={() => exportAccount(address.replace('0x', ''), true)}
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
    setCurrent: payload => d({type: 'setCurrent', payload}),
  };
};

export default connect(msp, mdp)(WalletImporter);
