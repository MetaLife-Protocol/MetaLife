import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import useSchemaStyles, {
  colorsBasics,
} from '../../../../shared/UseSchemaStyles';
import {useNavigation} from '@react-navigation/native';
import RoundBtn from '../../../../shared/comps/RoundBtn';
import {ComModal} from '../../../../shared/comps/ComModal';
import {
  deleteWalletAccount,
  exportAccountKeystore,
  exportAccountPrivateKey,
} from '../../../../remote/wallet/WalletAPI';
import NativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import {stopAboutWalletAccount} from '../../../../utils';
import Toast from 'react-native-tiny-toast';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletAccountDetails = ({
  cfg: {darkMode},
  route: {params},
  wallet,
  walletDeleteAccount,
  walletUpdateAccount,
  setCurrent,
}) => {
  const {
    marginTop10,
    FG,
    BG,
    modalFG,
    row,
    flex1,
    text,
    justifyCenter,
    alignItemsCenter,
    placeholderTextColor,
  } = useSchemaStyles();
  const navigation = useNavigation();
  const {goBack} = navigation;

  const [clickIndex, setClickIndex] = useState('');
  const [claimerVisible, setClaimerVisible] = useState(false);
  const [putPwdVisible, setPutPwdVisible] = useState(false);
  const [pwd, setPwd] = useState('');
  const [exportVisible, setExportVisible] = useState(false);
  const [tipList, setTipList] = useState([]);
  const [copyInfo, setCopyInfo] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');

  const {type, name, address} = params;

  const [editName, setEditName] = useState(name);
  const [edit, setEdit] = useState(false);

  const inputRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        edit ? (
          <Pressable
            onPress={() => {
              walletUpdateAccount({name: editName, type, address});
              setEdit(false);
              Toast.show('saved');
            }}>
            <Text style={[{color: '#29DAD7', fontSize: 17}]}>save</Text>
          </Pressable>
        ) : null,
    });
  }, [navigation, edit, editName]);

  function getIcon() {
    switch (type) {
      case 'spectrum':
        return iconDic.walletActiveSpectrum;
      case 'ethereum':
        return iconDic.walletActiveEther;
    }
  }

  const renderContentItem = (content, index) => {
    return (
      <View style={[row, marginTop10]} key={index}>
        <View style={[styles.dot]} />
        <Text style={[styles.grennColor, styles.keyContent]}>{content}</Text>
      </View>
    );
  };

  const checkPasswordCallback = (isCorrect, content) => {
    if (isCorrect) {
      setCopyInfo(content);
      setPutPwdVisible(false);
      setPwd('');
      setExportVisible(true);
    } else {
      setToastContent('Wrong password');
      setToastVisible(true);
    }
  };

  return (
    <SafeAreaView style={[flex1]}>
      <View style={[FG, justifyCenter, marginTop10, styles.container]}>
        <Image style={styles.avater} source={getIcon()} />
        <View style={[row, justifyCenter, alignItemsCenter, styles.titleView]}>
          <TextInput
            value={editName}
            onChangeText={setEditName}
            style={[text, styles.title]}
            ref={inputRef}
            editable={edit}
          />
          <Pressable
            onPress={() => {
              setEdit(true);
              setEditName(name);
              inputRef.current.focus();
            }}>
            <Image style={[styles.edit]} source={iconDic.iconDeitDefault} />
          </Pressable>
        </View>
        <View style={[styles.line, BG]} />
        <Text style={[text, styles.id]}>{address}</Text>
        <RoundBtn
          style={[styles.button]}
          title={'Export keystore'}
          press={() => {
            setClickIndex('keystore');
            setClaimerVisible(true);
          }}
        />
        <RoundBtn
          style={[styles.button]}
          title={'Export private key'}
          press={() => {
            setClickIndex('privatekey');
            setClaimerVisible(true);
          }}
        />
        <RoundBtn
          style={[styles.button]}
          title={'Delete'}
          press={() => {
            const count = wallet.accounts[type].length;
            if (count <= 1) {
              Toast.show('Cannot delete last one');
            } else {
              setClickIndex('delete');
              setPutPwdVisible(true);
            }
          }}
        />
      </View>
      <ComModal
        visible={claimerVisible}
        setVisible={setClaimerVisible}
        title={'Disclaimer'}
        darkMode={darkMode}
        content={
          <Text style={styles.claimerText}>
            Please ensure that the wallet has been backed up to a safe place.
            MetaLife App will not be responsible for any loss of assets caused
            by wallet loss, theft, or forgotten password.
          </Text>
        }
        submit={{
          text: 'Confirm',
          press: () => {
            setClaimerVisible(false);
            setPutPwdVisible(true);
          },
        }}
      />
      <ComModal
        visible={putPwdVisible}
        setVisible={setPutPwdVisible}
        title={'Enter Password'}
        darkMode={darkMode}
        content={
          <View style={[alignItemsCenter, styles.inputContiner, row]}>
            <TextInput
              keyboardType={'ascii-capable'}
              autoCapitalize={'none'}
              textAlign={'left'}
              value={pwd}
              textContentType={'password'}
              secureTextEntry={true}
              placeholder={'Wallet password'}
              placeholderTextColor={placeholderTextColor.color}
              onChangeText={setPwd}
              style={[text, styles.input]}
            />
            <Pressable onPress={() => setPwd('')}>
              <Image
                style={styles.delete}
                source={darkMode ? iconDic.deleteIconB : iconDic.deleteIconB}
              />
            </Pressable>
          </View>
        }
        toastVisible={toastVisible}
        setToastVisible={setToastVisible}
        toastContent={toastContent}
        submit={{
          text: 'Confirm',
          press: () => {
            if (clickIndex === 'keystore') {
              setTipList([
                'The private key is not encrypted, and there  is a risk in exporting. It is recommended to use keystore for backup.',
                'Do not use network transmission.',
                'Please ensure that the wallet has been backed up to a safe place. Metalife app will not bear any asset loss caused by wallet  loss, theft, forgetting password, etc',
              ]);
              exportAccountKeystore(address, pwd, checkPasswordCallback);
            } else if (clickIndex === 'privatekey') {
              setTipList([
                'Do not use network transmission.',
                'Please ensure that the wallet has been backed up to a safe place. Metalife app will not bear any asset loss caused by wallet  loss, theft, forgetting password, etc',
              ]);
              exportAccountPrivateKey(address, pwd, checkPasswordCallback);
            } else if (clickIndex === 'delete') {
              deleteWalletAccount(address, pwd, isCorrect => {
                if (isCorrect) {
                  setPutPwdVisible(false);
                  const addressIndex = wallet.accounts[type]
                    .map(it => it.address)
                    .indexOf(address);
                  if (addressIndex < wallet.current.index) {
                    setCurrent({type, index: wallet.current.index - 1});
                  }
                  if (addressIndex === wallet.current.index) {
                    setCurrent({type, index: 0});
                    stopAboutWalletAccount();
                  }
                  walletDeleteAccount({type, address});
                  Toast.show('Deleted');
                  goBack();
                } else {
                  setToastContent('Wrong password');
                  setToastVisible(true);
                }
              });
            }
          },
        }}
        cancel={{
          text: 'Cancel',
          press: () => {
            setPwd('');
          },
        }}
      />
      <ComModal
        visible={exportVisible}
        setVisible={setExportVisible}
        title={
          clickIndex === 'keystore' ? 'Export Keystore' : 'Export private key'
        }
        darkMode={darkMode}
        content={
          <ScrollView
            style={[clickIndex === 'keystore' ? {height: '80%'} : null]}>
            <View style={[modalFG, styles.privateKeyContainer, {marginTop: 0}]}>
              <Text style={[styles.grennColor, styles.keyTitle]}>
                Security warning:
              </Text>
              {tipList.map((it, index) => renderContentItem(it, index))}
            </View>
            <View style={[modalFG, styles.privateKeyContainer]}>
              <Text style={[text, {lineHeight: 20, fontSize: 16}]}>
                {copyInfo}
              </Text>
            </View>
          </ScrollView>
        }
        toastContent={toastContent}
        toastVisible={toastVisible}
        submit={{
          text: 'Copy',
          press: () => {
            NativeClipboard.setString(copyInfo);
            // setExportVisible(false);
            setToastContent(
              clickIndex === 'keystore'
                ? 'Keystore copied'
                : 'Private key copied',
            );
            setToastVisible(true);
          },
        }}
      />
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
  deleteIconB: require('../../../../assets/image/wallet/Login_icon_delete_white.png'),
  deleteIconW: require('../../../../assets/image/wallet/Login_icon_delete.png'),
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
  claimerText: {
    color: '#29DAD7',
    fontSize: 15,
  },
  inputContiner: {
    display: 'flex',
    borderColor: '#4E586E',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 15,
    marginVertical: 15,
    borderWidth: 0.5,
  },
  input: {
    flexGrow: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  delete: {
    width: 15,
    height: 15,
  },
  privateKeyContainer: {
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
  },
  grennColor: {
    color: colorsBasics.primary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colorsBasics.primary,
    margin: 5,
  },
  keyTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  keyContent: {
    lineHeight: 17,
    fontSize: 14,
    flexWrap: 'wrap',
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
    walletDeleteAccount: payload => d({type: 'walletDeleteAccount', payload}),
    walletUpdateAccount: payload => d({type: 'walletUpdateAccount', payload}),
    setCurrent: payload => d({type: 'setCurrent', payload}),
  };
};

export default connect(msp, mdp)(WalletAccountDetails);
